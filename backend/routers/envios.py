import uuid
from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel

from core.database import get_db
from core.security import get_current_user

from models.envio import Envio
from models.paquete import Paquete
from models.tipo_envio import TipoEnvio
from models.estado_envio import EstadoEnvio
from models.rutas import Ruta
from models.usuario import Usuario
from models.usuario_roles import UsuarioRol

from schemas.schemas import (
    EnvioRequest,
    EnvioResponse,
    RastreoResponse,
    RegistrarPaqueteRequest,
    RegistrarPaqueteResponse,
    TokenData
)


router = APIRouter(
    prefix="/envios",
    tags=["Envíos"]
)


# ============================================================
# ESQUEMA PARA ACTUALIZAR ESTADO
# ============================================================

class ActualizarEstadoRequest(BaseModel):
    estado: str


# ============================================================
# VERIFICAR ADMINISTRADOR
# ============================================================

def verificar_administrador(
    current_user: TokenData,
    db: Session
):
    usuario_rol = db.query(UsuarioRol).filter(
        UsuarioRol.id_usuario == current_user.id_usuario,
        UsuarioRol.id_rol == 1
    ).first()

    if not usuario_rol:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos de administrador"
        )

    return True


# ============================================================
# GENERAR CÓDIGO DE RASTREO
# ============================================================

def generar_codigo_rastreo() -> str:
    return f"ONU-{uuid.uuid4().hex[:10].upper()}"


# ============================================================
# GET /envios/mis-pedidos
# VER PEDIDOS DEL USUARIO AUTENTICADO
# ============================================================

@router.get(
    "/mis-pedidos",
    summary="Ver mis pedidos"
)
def mis_pedidos(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    envios = (
        db.query(Envio)
        .filter(Envio.id_usuario == current_user.id_usuario)
        .all()
    )

    resultado = []

    for envio in envios:
        tipo = db.query(TipoEnvio).filter(
            TipoEnvio.id_tipenvio == envio.id_tipenvio
        ).first()

        estado = db.query(EstadoEnvio).filter(
            EstadoEnvio.id_estadoenvio == envio.id_estadoenvio
        ).first()

        cantidad_paquetes = db.query(Paquete).filter(
            Paquete.id_envio == envio.id_envio
        ).count()

        resultado.append({
            "id_pedido": envio.id_envio,
            "codigo_rastreo": envio.codigo_rastreo,
            "tipo_envio": (
                tipo.descripcion if tipo else "Desconocido"
            ),
            "cantidad": cantidad_paquetes,
            "paquetes_registrados": cantidad_paquetes,
            "estado": (
                estado.estado if estado else envio.estado_paquete
            )
        })

    return {"pedidos": resultado}


# ============================================================
# VALIDAR QUE EL USUARIO SEA CONDUCTOR
# ============================================================

def validar_rol_conductor(db: Session, id_usuario: int):
    conductor = db.query(UsuarioRol).filter(
        UsuarioRol.id_usuario == id_usuario,
        UsuarioRol.id_rol == 3
    ).first()

    if not conductor:
        raise HTTPException(
            status_code=403,
            detail="No tienes permisos de conductor"
        )


# ============================================================
# GET /envios/mis-entregas
# CONSULTAR ENTREGAS ASIGNADAS AL CONDUCTOR
# ============================================================

@router.get("/mis-entregas")
def mis_entregas(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    validar_rol_conductor(db, current_user.id_usuario)

    envios = (
        db.query(Envio)
        .join(Ruta, Envio.id_rutas == Ruta.id_rutas)
        .filter(
            Ruta.id_conductor == current_user.id_usuario,
            Ruta.codigo_ruta != "SIN-ASIGNAR"
        )
        .all()
    )

    resultado = []

    for envio in envios:
        paquete = db.query(
            Paquete.destino,
            Paquete.direccion,
            Paquete.descripcion,
            Paquete.latitud_destino,
            Paquete.longitud_destino
        ).filter(
            Paquete.id_envio == envio.id_envio
        ).first()

        estado_db = db.query(EstadoEnvio).filter(
            EstadoEnvio.id_estadoenvio == envio.id_estadoenvio
        ).first()

        estado = (
            estado_db.estado
            if estado_db
            else envio.estado_paquete
        )

        if estado in ["Confirmado", "En bodega"]:
            estado = "Pendiente"

        resultado.append({
            "id_envio": envio.id_envio,
            "codigo": envio.codigo_rastreo,
            "destinatario": envio.nombre_destinatario,
            "direccion": (
                paquete.direccion
                if paquete and paquete.direccion
                else (paquete.destino if paquete and paquete.destino else "No registrada")
            ),
            "ciudad": paquete.destino if paquete and paquete.destino else "No registrada",
            "documento": envio.documento_destinatario,
            "descripcion": (
                paquete.descripcion
                if paquete and paquete.descripcion else "Paquete no registrado"
            ),
            "latitud_destino": paquete.latitud_destino if paquete else None,
            "longitud_destino": paquete.longitud_destino if paquete else None,
            "estado": estado
        })

    return resultado


# ============================================================
# PATCH /envios/{id_envio}/estado
# ACTUALIZAR ESTADO DE UNA ENTREGA
# ============================================================

@router.patch("/{id_envio}/estado")
def actualizar_estado_entrega(
    id_envio: int,
    estado: str = Body(..., embed=True),
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    validar_rol_conductor(db, current_user.id_usuario)

    envio = (
        db.query(Envio)
        .join(Ruta, Envio.id_rutas == Ruta.id_rutas)
        .filter(
            Envio.id_envio == id_envio,
            Ruta.id_conductor == current_user.id_usuario,
            Ruta.codigo_ruta != "SIN-ASIGNAR"
        )
        .first()
    )

    if not envio:
        raise HTTPException(
            status_code=404,
            detail="Entrega no encontrada o no asignada a este conductor"
        )

    estados_permitidos = ["En camino", "Entregado"]

    if estado not in estados_permitidos:
        raise HTTPException(
            status_code=400,
            detail="Estado no permitido"
        )

    nuevo_estado = db.query(EstadoEnvio).filter(
        EstadoEnvio.estado == estado
    ).first()

    if not nuevo_estado:
        raise HTTPException(
            status_code=404,
            detail=f"No existe el estado: {estado}"
        )

    envio.id_estadoenvio = nuevo_estado.id_estadoenvio
    envio.estado_paquete = estado

    db.commit()
    db.refresh(envio)

    return {
        "mensaje": "Estado actualizado correctamente",
        "id_envio": envio.id_envio,
        "estado": estado
    }


# ============================================================
# GET /envios/rastreo/{codigo_rastreo}
# RASTREAR UN ENVÍO
# ============================================================

@router.get(
    "/rastreo/{codigo_rastreo}",
    response_model=RastreoResponse,
    summary="Rastrear un envío por código"
)
def rastrear_envio(
    codigo_rastreo: str,
    db: Session = Depends(get_db)
):
    envio = db.query(Envio).filter(
        Envio.codigo_rastreo == codigo_rastreo
    ).first()

    if not envio:
        raise HTTPException(
            status_code=404,
            detail="Envío no encontrado"
        )

    usuario = db.query(Usuario).filter(
        Usuario.id_usuario == envio.id_usuario
    ).first()

    paquete = db.query(Paquete).filter(
        Paquete.id_envio == envio.id_envio
    ).first()

    tipo = db.query(TipoEnvio).filter(
        TipoEnvio.id_tipenvio == envio.id_tipenvio
    ).first()

    estado = db.query(EstadoEnvio).filter(
        EstadoEnvio.id_estadoenvio == envio.id_estadoenvio
    ).first()

    return {
        "id_envio": envio.id_envio,
        "id_usuario": envio.id_usuario,
        "codigo_rastreo": envio.codigo_rastreo,
        "fecha_creacion": envio.fecha_creacion,
        "remitente": (
            f"{usuario.nombre} {usuario.apellido}"
            if usuario else "No especificado"
        ),
        "nombre_destinatario": envio.nombre_destinatario,
        "documento_destinatario": envio.documento_destinatario,
        "origen": paquete.origen if paquete else "No especificado",
        "destino": paquete.destino if paquete else "No especificado",
        "tipo_envio": (
            tipo.descripcion if tipo else "No especificado"
        ),
        "estado_paquete": (
            estado.estado if estado else envio.estado_paquete
        )
    }


# ============================================================
# GET /envios/admin/listado
# LISTADO COMPLETO PARA EL PANEL ADMINISTRATIVO
# SOLO ADMINISTRADORES
# ============================================================

@router.get(
    "/admin/listado",
    summary="Listar todos los envíos para administración"
)
def listar_envios_admin(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_administrador(current_user, db)

    envios = (
        db.query(Envio)
        .order_by(Envio.fecha_creacion.desc())
        .all()
    )

    resultado = []

    for envio in envios:
        usuario = db.query(Usuario).filter(
            Usuario.id_usuario == envio.id_usuario
        ).first()

        paquete = db.query(Paquete).filter(
            Paquete.id_envio == envio.id_envio
        ).first()

        tipo = db.query(TipoEnvio).filter(
            TipoEnvio.id_tipenvio == envio.id_tipenvio
        ).first()

        estado = db.query(EstadoEnvio).filter(
            EstadoEnvio.id_estadoenvio == envio.id_estadoenvio
        ).first()

        ruta = db.query(Ruta).filter(
            Ruta.id_rutas == envio.id_rutas
        ).first()

        resultado.append({
            "id_envio": envio.id_envio,
            "id_usuario": envio.id_usuario,
            "codigo_rastreo": envio.codigo_rastreo,
            "fecha_creacion": envio.fecha_creacion,
            "cliente": (
                f"{usuario.nombre} {usuario.apellido}"
                if usuario else "Usuario no encontrado"
            ),
            "nombre_destinatario": envio.nombre_destinatario,
            "documento_destinatario": envio.documento_destinatario,
            "origen": (
                paquete.origen
                if paquete and paquete.origen
                else ruta.ciudad_origen if ruta else "No especificado"
            ),
            "destino": (
                paquete.destino
                if paquete and paquete.destino
                else ruta.ciudad_destino if ruta else "No especificado"
            ),
            "tipo_envio": (
                tipo.descripcion if tipo else "No especificado"
            ),
            "estado_paquete": envio.estado_paquete,
            "estado": (
                estado.estado if estado else envio.estado_paquete
            ),
            "id_estadoenvio": envio.id_estadoenvio,
            "id_tipenvio": envio.id_tipenvio,
            "id_rutas": envio.id_rutas,
            "codigo_ruta": ruta.codigo_ruta if ruta else "SIN-ASIGNAR",
            "nombre_conductor": ruta.nombre_conductor if ruta else "Sin asignar",
            "paquete": {
                "id_paquete": paquete.id_paquete,
                "peso": float(paquete.peso),
                "alto": float(paquete.alto),
                "largo": float(paquete.largo),
                "ancho": float(paquete.ancho),
                "descripcion": paquete.descripcion,
                "direccion": paquete.direccion,
                "barrio": paquete.barrio,
                "telefono_destinatario": paquete.telefono_destinatario,
                "referencias": paquete.referencias,
                "latitud_destino": paquete.latitud_destino,
                "longitud_destino": paquete.longitud_destino,
                "precio_envio": float(paquete.precio_envio or 0),
                "metodo_pago": paquete.metodo_pago
            } if paquete else None
        })

    return resultado


# ============================================================
# FUNCIONES AUXILIARES
# ============================================================

def obtener_o_crear_estado_pendiente(db: Session) -> int:
    estado = db.query(EstadoEnvio).filter(
        EstadoEnvio.estado == "Pendiente"
    ).first()

    if not estado:
        estado = EstadoEnvio(estado="Pendiente")
        db.add(estado)
        db.commit()
        db.refresh(estado)

    return estado.id_estadoenvio


def obtener_o_crear_ruta_sin_asignar(db: Session) -> int:
    ruta = db.query(Ruta).filter(
        Ruta.codigo_ruta == "SIN-ASIGNAR"
    ).first()

    if not ruta:
        ruta = Ruta(
            fecha_creacion=datetime.now(),
            tiempo_estimado="Por definir",
            distancia_ruta=0.01,
            ciudad_origen="Por definir",
            ciudad_destino="Por definir",
            cantidad_paquetes=0,
            codigo_ruta="SIN-ASIGNAR",
            tipo_vehiculo="Por definir",
            nombre_conductor="Por definir"
        )

        db.add(ruta)
        db.commit()
        db.refresh(ruta)

    return ruta.id_rutas


# ============================================================
# POST /envios/registrar-paquete
# REGISTRAR UN PAQUETE
# ============================================================

@router.post(
    "/registrar-paquete",
    response_model=RegistrarPaqueteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar un nuevo paquete"
)
def registrar_paquete(
    payload: RegistrarPaqueteRequest,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    codigo = generar_codigo_rastreo()
    id_estado = obtener_o_crear_estado_pendiente(db)
    id_ruta = obtener_o_crear_ruta_sin_asignar(db)

    try:
        envio = Envio(
            id_usuario=current_user.id_usuario,
            id_tipenvio=payload.id_tipenvio,
            id_estadoenvio=id_estado,
            id_rutas=id_ruta,
            codigo_rastreo=codigo,
            fecha_creacion=datetime.now(),
            nombre_destinatario=payload.nombre_destinatario,
            documento_destinatario=payload.documento_destinatario,
            estado_paquete="Pendiente"
        )

        db.add(envio)
        db.flush()

        paquete = Paquete(
            id_envio=envio.id_envio,
            cod_rastreo=codigo,
            peso=payload.peso,
            alto=payload.alto,
            largo=payload.largo,
            ancho=payload.ancho,
            descripcion=payload.descripcion,
            origen=payload.origen,
            destino=payload.destino,
            direccion=payload.direccion,
            barrio=payload.barrio,
            telefono_destinatario=payload.telefono_destinatario,
            referencias=payload.referencias,
            latitud_destino=payload.latitud_destino,
            longitud_destino=payload.longitud_destino,
            precio_envio=payload.precio_envio,
            metodo_pago=payload.metodo_pago
        )

        db.add(paquete)
        db.commit()

        db.refresh(envio)
        db.refresh(paquete)

        return RegistrarPaqueteResponse(
            id_envio=envio.id_envio,
            id_paquete=paquete.id_paquete,
            codigo_rastreo=codigo
        )

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="No fue posible registrar el paquete"
        )


# ============================================================
# GET /envios/
# LISTAR ENVÍOS
# SOLO ADMINISTRADORES
# ============================================================

@router.get(
    "/",
    response_model=List[EnvioResponse],
    summary="Ver todos los envíos"
)
def listar_envios(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_administrador(current_user, db)
    return db.query(Envio).all()


# ============================================================
# GET /envios/{id_envio}
# OBTENER UN ENVÍO
# SOLO ADMINISTRADORES
# ============================================================

@router.get(
    "/{id_envio}",
    response_model=EnvioResponse,
    summary="Ver un envío"
)
def obtener_envio(
    id_envio: int,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_administrador(current_user, db)

    envio = db.query(Envio).filter(
        Envio.id_envio == id_envio
    ).first()

    if not envio:
        raise HTTPException(
            status_code=404,
            detail="Envío no encontrado"
        )

    return envio


# ============================================================
# POST /envios/
# CREAR UN ENVÍO
# SOLO ADMINISTRADORES
# ============================================================

@router.post(
    "/",
    response_model=EnvioResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un envío"
)
def crear_envio(
    payload: EnvioRequest,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_administrador(current_user, db)

    envio = Envio(
        id_usuario=payload.id_usuario,
        id_tipenvio=payload.id_tipenvio,
        id_estadoenvio=payload.id_estadoenvio,
        id_rutas=payload.id_rutas,
        codigo_rastreo=generar_codigo_rastreo(),
        fecha_creacion=datetime.now(),
        nombre_destinatario=payload.nombre_destinatario,
        documento_destinatario=payload.documento_destinatario,
        estado_paquete=payload.estado_paquete
    )

    try:
        db.add(envio)
        db.commit()
        db.refresh(envio)
        return envio

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="No fue posible crear el envío"
        )


# ============================================================
# PUT /envios/admin/{id_envio}/estado
# ACTUALIZAR ESTADO DESDE EL PANEL ADMINISTRATIVO
# SOLO ADMINISTRADORES
# ============================================================

@router.put(
    "/admin/{id_envio}/estado",
    summary="Actualizar el estado de un envío"
)
def actualizar_estado_envio(
    id_envio: int,
    payload: ActualizarEstadoRequest,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_administrador(current_user, db)

    envio = db.query(Envio).filter(
        Envio.id_envio == id_envio
    ).first()

    if not envio:
        raise HTTPException(
            status_code=404,
            detail="Envío no encontrado"
        )

    nuevo_estado = db.query(EstadoEnvio).filter(
        EstadoEnvio.estado == payload.estado
    ).first()

    if not nuevo_estado:
        raise HTTPException(
            status_code=404,
            detail=f"El estado '{payload.estado}' no existe en la base de datos"
        )

    try:
        envio.id_estadoenvio = nuevo_estado.id_estadoenvio

        db.commit()
        db.refresh(envio)

        return {
            "mensaje": "Estado del envío actualizado correctamente",
            "id_envio": envio.id_envio,
            "estado": nuevo_estado.estado,
            "id_estadoenvio": nuevo_estado.id_estadoenvio
        }

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="No fue posible actualizar el estado del envío"
        )


# ============================================================
# PUT /envios/{id_envio}
# ACTUALIZAR UN ENVÍO
# SOLO ADMINISTRADORES
# ============================================================

@router.put(
    "/{id_envio}",
    response_model=EnvioResponse,
    summary="Actualizar un envío"
)
def actualizar_envio(
    id_envio: int,
    payload: EnvioRequest,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_administrador(current_user, db)

    envio = db.query(Envio).filter(
        Envio.id_envio == id_envio
    ).first()

    if not envio:
        raise HTTPException(
            status_code=404,
            detail="Envío no encontrado"
        )

    envio.id_usuario = payload.id_usuario
    envio.id_tipenvio = payload.id_tipenvio
    envio.id_estadoenvio = payload.id_estadoenvio
    envio.id_rutas = payload.id_rutas
    envio.nombre_destinatario = payload.nombre_destinatario
    envio.documento_destinatario = payload.documento_destinatario
    envio.estado_paquete = payload.estado_paquete

    try:
        db.commit()
        db.refresh(envio)
        return envio

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="No fue posible actualizar el envío"
        )


# ============================================================
# DELETE /envios/{id_envio}
# ELIMINAR UN ENVÍO
# SOLO ADMINISTRADORES
# ============================================================

@router.delete(
    "/{id_envio}",
    summary="Eliminar un envío"
)
def eliminar_envio(
    id_envio: int,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_administrador(current_user, db)

    envio = db.query(Envio).filter(
        Envio.id_envio == id_envio
    ).first()

    if not envio:
        raise HTTPException(
            status_code=404,
            detail="Envío no encontrado"
        )

    try:
        paquetes = db.query(Paquete).filter(
            Paquete.id_envio == id_envio
        ).all()

        for paquete in paquetes:
            db.delete(paquete)

        db.delete(envio)
        db.commit()

        return {
            "mensaje": "Envío eliminado correctamente",
            "id_envio": id_envio
        }

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="No se puede eliminar el envío porque tiene registros relacionados"
        )

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="No fue posible eliminar el envío"
        )