from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.factura import Factura
from schemas.schemas import FacturaRequest, FacturaResponse


router = APIRouter(
    prefix="/facturas",
    tags=["Facturas"]
)


@router.get(
    "/",
    response_model=List[FacturaResponse],
    summary="Ver todas las facturas"
)
def listar_facturas(db: Session = Depends(get_db)):
    return db.query(Factura).all()


@router.get(
    "/{id_factura}",
    response_model=FacturaResponse,
    summary="Ver una factura"
)
def obtener_factura(
    id_factura: int,
    db: Session = Depends(get_db)
):
    factura = db.query(Factura).filter(
        Factura.id_factura == id_factura
    ).first()

    if not factura:
        raise HTTPException(
            status_code=404,
            detail="Factura no encontrada"
        )

    return factura


@router.post(
    "/",
    response_model=FacturaResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear una factura"
)
def crear_factura(
    payload: FacturaRequest,
    db: Session = Depends(get_db)
):
    factura = Factura(
        id_envio=payload.id_envio,
        num_factura=payload.num_factura,
        fecha_emision=datetime.now(),
        subtotal=payload.subtotal,
        iva=payload.iva,
        total_pago=payload.total_pago,
        metodo_pago=payload.metodo_pago
    )

    db.add(factura)
    db.commit()
    db.refresh(factura)

    return factura


@router.put(
    "/{id_factura}",
    response_model=FacturaResponse,
    summary="Actualizar una factura"
)
def actualizar_factura(
    id_factura: int,
    payload: FacturaRequest,
    db: Session = Depends(get_db)
):
    factura = db.query(Factura).filter(
        Factura.id_factura == id_factura
    ).first()

    if not factura:
        raise HTTPException(
            status_code=404,
            detail="Factura no encontrada"
        )

    factura.id_envio = payload.id_envio
    factura.num_factura = payload.num_factura
    factura.subtotal = payload.subtotal
    factura.iva = payload.iva
    factura.total_pago = payload.total_pago
    factura.metodo_pago = payload.metodo_pago

    db.commit()
    db.refresh(factura)

    return factura


@router.delete(
    "/{id_factura}",
    summary="Eliminar una factura"
)
def eliminar_factura(
    id_factura: int,
    db: Session = Depends(get_db)
):
    factura = db.query(Factura).filter(
        Factura.id_factura == id_factura
    ).first()

    if not factura:
        raise HTTPException(
            status_code=404,
            detail="Factura no encontrada"
        )

    db.delete(factura)
    db.commit()

    return {
        "mensaje": "Factura eliminada correctamente"
    }