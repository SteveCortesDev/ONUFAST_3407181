from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.documento import Documento
from schemas.schemas import DocumentoRequest, DocumentoResponse


router = APIRouter(
    prefix="/documentos",
    tags=["Documentos"]
)


# ─────────────────────────────────────────────
# GET - Ver todos los documentos
# ─────────────────────────────────────────────

@router.get(
    "/",
    response_model=List[DocumentoResponse],
    summary="Ver todos los documentos"
)
def listar_documentos(db: Session = Depends(get_db)):
    return db.query(Documento).all()


# ─────────────────────────────────────────────
# GET - Ver un documento
# ─────────────────────────────────────────────

@router.get(
    "/{id_documento}",
    response_model=DocumentoResponse,
    summary="Ver un documento"
)
def obtener_documento(
    id_documento: int,
    db: Session = Depends(get_db)
):
    documento = db.query(Documento).filter(
        Documento.id_documento == id_documento
    ).first()

    if not documento:
        raise HTTPException(
            status_code=404,
            detail="Documento no encontrado"
        )

    return documento


# ─────────────────────────────────────────────
# POST - Crear documento
# ─────────────────────────────────────────────

@router.post(
    "/",
    response_model=DocumentoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar un documento"
)
def crear_documento(
    payload: DocumentoRequest,
    db: Session = Depends(get_db)
):
    documento = Documento(
        tipo_documento=payload.tipo_documento,
        num_documento=payload.num_documento,
        id_usuario=payload.id_usuario
    )

    db.add(documento)
    db.commit()
    db.refresh(documento)

    return documento


# ─────────────────────────────────────────────
# PUT - Actualizar documento
# ─────────────────────────────────────────────

@router.put(
    "/{id_documento}",
    response_model=DocumentoResponse,
    summary="Actualizar un documento"
)
def actualizar_documento(
    id_documento: int,
    payload: DocumentoRequest,
    db: Session = Depends(get_db)
):
    documento = db.query(Documento).filter(
        Documento.id_documento == id_documento
    ).first()

    if not documento:
        raise HTTPException(
            status_code=404,
            detail="Documento no encontrado"
        )

    documento.tipo_documento = payload.tipo_documento
    documento.num_documento = payload.num_documento
    documento.id_usuario = payload.id_usuario

    db.commit()
    db.refresh(documento)

    return documento


# ─────────────────────────────────────────────
# DELETE - Eliminar documento
# ─────────────────────────────────────────────

@router.delete(
    "/{id_documento}",
    summary="Eliminar un documento"
)
def eliminar_documento(
    id_documento: int,
    db: Session = Depends(get_db)
):
    documento = db.query(Documento).filter(
        Documento.id_documento == id_documento
    ).first()

    if not documento:
        raise HTTPException(
            status_code=404,
            detail="Documento no encontrado"
        )

    db.delete(documento)
    db.commit()

    return {
        "mensaje": "Documento eliminado correctamente"
    }