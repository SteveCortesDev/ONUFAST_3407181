import uuid
from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.envio import Envio
from schemas.schemas import EnvioRequest, EnvioResponse


router = APIRouter(
    prefix="/envios",
    tags=["Envíos"]
)


def generar_codigo_rastreo() -> str:
    return f"ONU-{uuid.uuid4().hex[:10].upper()}"


# ─────────────────────────────────────────────
# GET /envios/
# ─────────────────────────────────────────────

@router.get(
    "/",
    response_model=List[EnvioResponse],
    summary="Ver todos los envíos"
)
def listar_envios(db: Session = Depends(get_db)):
    return db.query(Envio).all()


# ─────────────────────────────────────────────
# GET /envios/{id_envio}
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