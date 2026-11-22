import uuid
from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session

from core.database import get_db

from models.envio import Envio
from models.paquete import Paquete
from models.tipo_envio import TipoEnvio
from models.estado_envio import EstadoEnvio
from models.rutas import Ruta

from models.usuario import Usuario
from models.rol import Rol
from models.usuario_roles import UsuarioRol
from sqlalchemy import func

from schemas.schemas import (
    EnvioRequest,
    EnvioResponse,
    RastreoResponse,
    RegistrarPaqueteRequest,
    RegistrarPaqueteResponse,
    TokenData
)

from core.security import get_current_user


router = APIRouter(
    prefix="/envios",
    tags=["Envíos"]
)


# ─────────────────────────────────────────────
# GENERAR CÓDIGO DE RASTREO
# ─────────────────────────────────────────────

def generar_codigo_rastreo() -> str:
    return f"ONU-{uuid.uuid4().hex[:10].upper()}"


# ─────────────────────────────────────────────
# GET /envios/mis-pedidos
# Ver mis pedidos (usuario autenticado)
# ─────────────────────────────────────────────

@router.get(
    "/mis-pedidos",
    summary="Ver mis pedidos (usuario autenticado)"
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

        cantidad_paquetes = db.query(Paquete).filter(
            Paquete.id_envio == envio.id_envio
        ).count()

        resultado.append({
            "id_pedido": envio.id_envio,
            "codigo_rastreo": envio.codigo_rastreo,
            "tipo_envio": (
                tipo.descripcion
                if tipo else "Desconocido"
            ),
            "cantidad": cantidad_paquetes,
            "paquetes_registrados": cantidad_paquetes,
            "estado": envio.estado_paquete,
        })

    return {"pedidos": resultado}


# ─────────────────────────────────────────────
# GET /envios/rastreo/{codigo_rastreo}
# Rastrear un envío por código
# ─────────────────────────────────────────────

@router.get(
    "/rastreo/{codigo_rastreo}",
    response_model=RastreoResponse,
    summary="Rastrear un envío por código"
)
def rastrear_envio(
    codigo_rastreo: str,
    db: Session = Depends(get_db)
):
    # Buscar el envío
    envio = db.query(Envio).filter(
        Envio.codigo_rastreo == codigo_rastreo
    ).first()

    if not envio:
        raise HTTPException(
            status_code=404,
            detail="Envío no encontrado"
        )

    # ─────────────────────────────────────────
    # Buscar el usuario que registró el envío
    # ─────────────────────────────────────────

    from models.usuario import Usuario

    usuario = db.query(Usuario).filter(
        Usuario.id_usuario == envio.id_usuario
    ).first()

    # ─────────────────────────────────────────
    # Buscar el paquete asociado
    # ─────────────────────────────────────────

    paquete = db.query(Paquete).filter(
        Paquete.id_envio == envio.id_envio
    ).first()

    # ─────────────────────────────────────────
    # Buscar el tipo de envío
    # ─────────────────────────────────────────

    tipo = db.query(TipoEnvio).filter(
        TipoEnvio.id_tipenvio == envio.id_tipenvio
    ).first()

    # ─────────────────────────────────────────
    # Devolver información completa
    # ─────────────────────────────────────────

    return {
        "id_envio": envio.id_envio,
        "id_usuario": envio.id_usuario,
        "codigo_rastreo": envio.codigo_rastreo,
        "fecha_creacion": envio.fecha_creacion,

        # Remitente
        "remitente": (
            f"{usuario.nombre} {usuario.apellido}"
            if usuario else "No especificado"
        ),

        # Destinatario
        "nombre_destinatario": envio.nombre_destinatario,
        "documento_destinatario": envio.documento_destinatario,

        # Ubicaciones
        "origen": (
            paquete.origen
            if paquete else "No especificado"
        ),

        "destino": (
            paquete.destino
            if paquete else "No especificado"
        ),

        # Tipo de envío
        "tipo_envio": (
            tipo.descripcion
            if tipo else "No especificado"
        ),

        # Estado
        "estado_paquete": envio.estado_paquete
    }


# ─────────────────────────────────────────────
# GET /envios/
# Ver todos los envíos
# ─────────────────────────────────────────────

@router.get(
    "/",
    response_model=List[EnvioResponse],
    summary="Ver todos los envíos"
)
def listar_envios(
    db: Session = Depends(get_db)
):
    return db.query(Envio).all()


# ─────────────────────────────────────────────
# FUNCIONES AUXILIARES
# ─────────────────────────────────────────────

def obtener_o_crear_estado_pendiente(
    db: Session
) -> int:

    estado = db.query(EstadoEnvio).filter(
        EstadoEnvio.estado == "Pendiente"
    ).first()

    if not estado:
        estado = EstadoEnvio(
            estado="Pendiente"
        )

        db.add(estado)
        db.commit()
        db.refresh(estado)

    return estado.id_estadoenvio


def obtener_o_crear_ruta_sin_asignar(
    db: Session
) -> int:

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


# ─────────────────────────────────────────────
# POST /envios/registrar-paquete
# Registrar un nuevo paquete
# ─────────────────────────────────────────────

@router.post(
    "/registrar-paquete",
    response_model=RegistrarPaqueteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar un nuevo paquete (crea envío + paquete)"
)
def registrar_paquete(
    payload: RegistrarPaqueteRequest,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Generar código de rastreo
    codigo = generar_codigo_rastreo()

    # Obtener estado pendiente
    id_estado = obtener_o_crear_estado_pendiente(db)

    # Obtener ruta sin asignar
    id_ruta = obtener_o_crear_ruta_sin_asignar(db)

    # ─────────────────────────────────────────
    # Crear envío
    # ─────────────────────────────────────────

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
    db.commit()
    db.refresh(envio)

    # ─────────────────────────────────────────
    # Crear paquete
    # ─────────────────────────────────────────

    paquete = Paquete(
        id_envio=envio.id_envio,
        cod_rastreo=codigo,
        peso=payload.peso,
        alto=payload.alto,
        largo=payload.largo,
        ancho=payload.ancho,
        descripcion=payload.descripcion,
        origen=payload.origen,
        destino=payload.destino
    )

    db.add(paquete)
    db.commit()
    db.refresh(paquete)

    # ─────────────────────────────────────────
    # Respuesta
    # ─────────────────────────────────────────

    return RegistrarPaqueteResponse(
        id_envio=envio.id_envio,
        id_paquete=paquete.id_paquete,
        codigo_rastreo=codigo
    )


# ─────────────────────────────────────────────
# GET /envios/mis-entregas
# Entregas asignadas al conductor autenticado
# ─────────────────────────────────────────────


@router.get("/mis-entregas")
def obtener_mis_entregas(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from models.usuario import Usuario
    from models.rol import Rol
    from models.usuario_roles import UsuarioRol
    from sqlalchemy import func

    # 1. Buscar el usuario autenticado
    usuario = db.query(Usuario).filter(
        Usuario.id_usuario == current_user.id_usuario
    ).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    # 2. Consultar los roles del usuario
    roles = (
        db.query(Rol.nombre_rol)
        .join(UsuarioRol, UsuarioRol.id_rol == Rol.id_rol)
        .filter(UsuarioRol.id_usuario == current_user.id_usuario)
        .all()
    )

    nombres_roles = [rol[0] for rol in roles]

    # 3. Verificar que sea conductor
    if not any(
        rol in nombres_roles
        for rol in ["Conductor", "Conductor Auxiliar"]
    ):
        raise HTTPException(
            status_code=403,
            detail="No tienes permisos para consultar estas entregas"
        )

    # 4. Buscar las rutas asignadas al conductor
    rutas = db.query(Ruta).filter(
        func.lower(Ruta.nombre_conductor) == func.lower(usuario.nombre)
    ).all()

    ids_rutas = [ruta.id_rutas for ruta in rutas]

    # 5. Buscar los envíos que pertenecen a esas rutas
    envios = db.query(Envio).filter(
        Envio.id_rutas.in_(ids_rutas)
    ).all() if ids_rutas else []

    # 6. Construir la respuesta con la información de cada entrega
    resultado = []

    for envio in envios:
        paquete = db.query(Paquete).filter(
            Paquete.id_envio == envio.id_envio
        ).first()

        estado = db.query(EstadoEnvio).filter(
            EstadoEnvio.id_estadoenvio == envio.id_estadoenvio
        ).first()

        resultado.append({
            "id": envio.id_envio,
            "id_envio": envio.id_envio,
            "codigo": envio.codigo_rastreo,
            "destinatario": envio.nombre_destinatario,
            "documento": envio.documento_destinatario,
            "direccion": paquete.destino if paquete else "No disponible",
            "ciudad": paquete.destino if paquete else "No disponible",
            "descripcion": paquete.descripcion if paquete else "Sin descripción",
            "origen": paquete.origen if paquete else "No disponible",
            "destino": paquete.destino if paquete else "No disponible",
            "estado": estado.estado if estado else "Pendiente",
            "id_estadoenvio": envio.id_estadoenvio,
            "id_rutas": envio.id_rutas
        })

    return resultado



# ─────────────────────────────────────────────
# PATCH /envios/{id_envio}/estado
# Actualizar el estado de una entrega
# ─────────────────────────────────────────────

@router.patch("/{id_envio}/estado")
def actualizar_estado_entrega(
    id_envio: int,
    estado: str = Body(..., embed=True),
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    

    # Verificar usuario
    usuario = db.query(Usuario).filter(
        Usuario.id_usuario == current_user.id_usuario
    ).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    # Verificar rol
    roles = (
        db.query(Rol.nombre_rol)
        .join(UsuarioRol, UsuarioRol.id_rol == Rol.id_rol)
        .filter(
            UsuarioRol.id_usuario == current_user.id_usuario
        )
        .all()
    )

    nombres_roles = [rol[0] for rol in roles]

    if not any(
        rol in nombres_roles
        for rol in ["Conductor", "Conductor Auxiliar"]
    ):
        raise HTTPException(
            status_code=403,
            detail="No tienes permisos para actualizar entregas"
        )

    # Buscar las rutas del conductor
    rutas = db.query(Ruta).filter(
        func.lower(Ruta.nombre_conductor) ==
        func.lower(usuario.nombre)
    ).all()

    ids_rutas = [ruta.id_rutas for ruta in rutas]

    # Buscar el envío y comprobar que pertenece al conductor
    envio = db.query(Envio).filter(
        Envio.id_envio == id_envio,
        Envio.id_rutas.in_(ids_rutas)
    ).first()

    if not envio:
        raise HTTPException(
            status_code=404,
            detail="Entrega no encontrada o no asignada a este conductor"
        )

    # Validar estados permitidos
    estados_permitidos = ["Pendiente", "En camino", "Entregado"]

    if estado not in estados_permitidos:
        raise HTTPException(
            status_code=400,
            detail="Estado no válido"
        )

    # Buscar el estado en la tabla estado_envio
    estado_db = db.query(EstadoEnvio).filter(
        func.lower(EstadoEnvio.estado) == func.lower(estado)
    ).first()

    # Crear el estado si todavía no existe
    if not estado_db:
        estado_db = EstadoEnvio(estado=estado)
        db.add(estado_db)
        db.flush()

    # Actualizar únicamente el estado del envío
    envio.id_estadoenvio = estado_db.id_estadoenvio

    db.commit()
    db.refresh(envio)

    return {
        "mensaje": "Estado de entrega actualizado correctamente",
        "id_envio": envio.id_envio,
        "estado": estado_db.estado
    }


# ─────────────────────────────────────────────
# GET /envios/{id_envio}
# Ver un envío
# ─────────────────────────────────────────────

@router.get(
        
    "/{id_envio}",
    response_model=EnvioResponse,
    summary="Ver un envío"
)
def obtener_envio(
    id_envio: int,
    db: Session = Depends(get_db)
):

    envio = db.query(Envio).filter(
        Envio.id_envio == id_envio
    ).first()

    if not envio:
        raise HTTPException(
            status_code=404,
            detail="Envío no encontrado"
        )

    return envio


# ─────────────────────────────────────────────
# POST /envios/
# Crear un envío
# ─────────────────────────────────────────────

@router.post(
    "/",
    response_model=EnvioResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un envío"
)
def crear_envio(
    payload: EnvioRequest,
    db: Session = Depends(get_db)
):

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

    db.add(envio)
    db.commit()
    db.refresh(envio)

    return envio


# ─────────────────────────────────────────────
# PUT /envios/{id_envio}
# Actualizar un envío
# ─────────────────────────────────────────────

@router.put(
    "/{id_envio}",
    response_model=EnvioResponse,
    summary="Actualizar un envío"
)
def actualizar_envio(
    id_envio: int,
    payload: EnvioRequest,
    db: Session = Depends(get_db)
):

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

    db.commit()
    db.refresh(envio)

    return envio


# ─────────────────────────────────────────────
# DELETE /envios/{id_envio}
# Eliminar un envío
# ─────────────────────────────────────────────

@router.delete(
    "/{id_envio}",
    summary="Eliminar un envío"
)
def eliminar_envio(
    id_envio: int,
    db: Session = Depends(get_db)
):

    envio = db.query(Envio).filter(
        Envio.id_envio == id_envio
    ).first()

    if not envio:
        raise HTTPException(
            status_code=404,
            detail="Envío no encontrado"
        )

    db.delete(envio)
    db.commit()

    return {
        "mensaje": "Envío eliminado correctamente"
    }




