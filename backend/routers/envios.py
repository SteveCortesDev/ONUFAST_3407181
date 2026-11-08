import uuid
from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db

from models.envio import Envio
from models.paquete import Paquete
from models.tipo_envio import TipoEnvio
from models.estado_envio import EstadoEnvio
from models.rutas import Ruta

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