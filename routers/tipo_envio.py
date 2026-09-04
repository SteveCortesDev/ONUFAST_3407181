from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.tipo_envio import TipoEnvio
from schemas.schemas import TipoEnvioRequest, TipoEnvioResponse


router = APIRouter(
    prefix="/tipos-envio",
    tags=["Tipos de Envío"]
)


# ─────────────────────────────────────────────
# GET - Ver todos los tipos de envío
# ─────────────────────────────────────────────

@router.get(
    "/",
    response_model=List[TipoEnvioResponse],
    summary="Ver todos los tipos de envío"
)
def listar_tipos_envio(db: Session = Depends(get_db)):
    return db.query(TipoEnvio).all()


# ─────────────────────────────────────────────
# GET - Ver un tipo de envío
# ─────────────────────────────────────────────

@router.get(
    "/{id_tipenvio}",
    response_model=TipoEnvioResponse,
    summary="Ver un tipo de envío"
)
def obtener_tipo_envio(
    id_tipenvio: int,
    db: Session = Depends(get_db)
):
    tipo = db.query(TipoEnvio).filter(
        TipoEnvio.id_tipenvio == id_tipenvio
    ).first()

    if not tipo:
        raise HTTPException(
            status_code=404,
            detail="Tipo de envío no encontrado"
        )

    return tipo


# ─────────────────────────────────────────────
# POST - Crear tipo de envío
# ─────────────────────────────────────────────

@router.post(
    "/",
    response_model=TipoEnvioResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un tipo de envío"
)
def crear_tipo_envio(
    payload: TipoEnvioRequest,
    db: Session = Depends(get_db)
):
    tipo = TipoEnvio(
        descripcion=payload.descripcion
    )

    db.add(tipo)
    db.commit()
    db.refresh(tipo)

    return tipo


# ─────────────────────────────────────────────
# PUT - Actualizar tipo de envío
# ─────────────────────────────────────────────

@router.put(
    "/{id_tipenvio}",
    response_model=TipoEnvioResponse,
    summary="Actualizar un tipo de envío"
)
def actualizar_tipo_envio(
    id_tipenvio: int,
    payload: TipoEnvioRequest,
    db: Session = Depends(get_db)
):
    tipo = db.query(TipoEnvio).filter(
        TipoEnvio.id_tipenvio == id_tipenvio
    ).first()

    if not tipo:
        raise HTTPException(
            status_code=404,
            detail="Tipo de envío no encontrado"
        )

    tipo.descripcion = payload.descripcion

    db.commit()
    db.refresh(tipo)

    return tipo


# ─────────────────────────────────────────────
# DELETE - Eliminar tipo de envío
# ─────────────────────────────────────────────

@router.delete(
    "/{id_tipenvio}",
    summary="Eliminar un tipo de envío"
)
def eliminar_tipo_envio(
    id_tipenvio: int,
    db: Session = Depends(get_db)
):
    tipo = db.query(TipoEnvio).filter(
        TipoEnvio.id_tipenvio == id_tipenvio
    ).first()

    if not tipo:
        raise HTTPException(
            status_code=404,
            detail="Tipo de envío no encontrado"
        )

    db.delete(tipo)
    db.commit()

    return {
        "mensaje": "Tipo de envío eliminado correctamente"
    }