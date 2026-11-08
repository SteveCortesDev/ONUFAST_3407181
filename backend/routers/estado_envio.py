from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.estado_envio import EstadoEnvio
from schemas.schemas import EstadoEnvioRequest, EstadoEnvioResponse


router = APIRouter(
    prefix="/estados-envio",
    tags=["Estados de Envío"]
)


@router.get(
    "/",
    response_model=List[EstadoEnvioResponse],
    summary="Ver todos los estados de envío"
)
def listar_estados_envio(db: Session = Depends(get_db)):
    return db.query(EstadoEnvio).all()


@router.get(
    "/{id_estadoenvio}",
    response_model=EstadoEnvioResponse,
    summary="Ver un estado de envío"
)
def obtener_estado_envio(
    id_estadoenvio: int,
    db: Session = Depends(get_db)
):
    estado = db.query(EstadoEnvio).filter(
        EstadoEnvio.id_estadoenvio == id_estadoenvio
    ).first()

    if not estado:
        raise HTTPException(
            status_code=404,
            detail="Estado de envío no encontrado"
        )

    return estado


@router.post(
    "/",
    response_model=EstadoEnvioResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un estado de envío"
)
def crear_estado_envio(
    payload: EstadoEnvioRequest,
    db: Session = Depends(get_db)
):
    estado = EstadoEnvio(
        estado=payload.estado
    )

    db.add(estado)
    db.commit()
    db.refresh(estado)

    return estado


@router.put(
    "/{id_estadoenvio}",
    response_model=EstadoEnvioResponse,
    summary="Actualizar un estado de envío"
)
def actualizar_estado_envio(
    id_estadoenvio: int,
    payload: EstadoEnvioRequest,
    db: Session = Depends(get_db)
):
    estado = db.query(EstadoEnvio).filter(
        EstadoEnvio.id_estadoenvio == id_estadoenvio
    ).first()

    if not estado:
        raise HTTPException(
            status_code=404,
            detail="Estado de envío no encontrado"
        )

    estado.estado = payload.estado

    db.commit()
    db.refresh(estado)

    return estado


@router.delete(
    "/{id_estadoenvio}",
    summary="Eliminar un estado de envío"
)
def eliminar_estado_envio(
    id_estadoenvio: int,
    db: Session = Depends(get_db)
):
    estado = db.query(EstadoEnvio).filter(
        EstadoEnvio.id_estadoenvio == id_estadoenvio
    ).first()

    if not estado:
        raise HTTPException(
            status_code=404,
            detail="Estado de envío no encontrado"
        )

    db.delete(estado)
    db.commit()

    return {
        "mensaje": "Estado de envío eliminado correctamente"
    }