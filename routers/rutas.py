from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.rutas import Ruta
from schemas.schemas import RutaRequest, RutaResponse


router = APIRouter(prefix="/rutas", tags=["Rutas"])


# ─────────────────────────────────────────────
# GET /rutas/
# Listar todas las rutas
# ─────────────────────────────────────────────

@router.get(
    "/",
    response_model=List[RutaResponse],
    summary="Ver todas las rutas"
)
def listar_rutas(db: Session = Depends(get_db)):

    rutas = db.query(Ruta).all()

    return rutas


# ─────────────────────────────────────────────
# GET /rutas/{id_rutas}
# Obtener una ruta
# ─────────────────────────────────────────────

@router.get(
    "/{id_rutas}",
    response_model=RutaResponse,
    summary="Ver el detalle de una ruta"
)
def obtener_ruta(
    id_rutas: int,
    db: Session = Depends(get_db)
):

    ruta = db.query(Ruta).filter(
        Ruta.id_rutas == id_rutas
    ).first()

    if not ruta:
        raise HTTPException(
            status_code=404,
            detail="Ruta no encontrada"
        )

    return ruta


# ─────────────────────────────────────────────
# POST /rutas/
# Crear una nueva ruta
# ─────────────────────────────────────────────

@router.post(
    "/",
    response_model=RutaResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar una nueva ruta"
)
def crear_ruta(
    payload: RutaRequest,
    db: Session = Depends(get_db)
):

    ruta = Ruta(
        fecha_creacion=datetime.now(),
        tiempo_estimado=payload.tiempo_estimado,
        distancia_ruta=payload.distancia_ruta,
        ciudad_origen=payload.ciudad_origen,
        ciudad_destino=payload.ciudad_destino,
        cantidad_paquetes=payload.cantidad_paquetes,
        codigo_ruta=payload.codigo_ruta,
        tipo_vehiculo=payload.tipo_vehiculo,
        nombre_conductor=payload.nombre_conductor
    )

    db.add(ruta)
    db.commit()
    db.refresh(ruta)

    return ruta


# ─────────────────────────────────────────────
# PUT /rutas/{id_rutas}
# Actualizar una ruta
# ─────────────────────────────────────────────

@router.put(
    "/{id_rutas}",
    response_model=RutaResponse,
    summary="Actualizar una ruta"
)
def actualizar_ruta(
    id_rutas: int,
    payload: RutaRequest,
    db: Session = Depends(get_db)
):

    ruta = db.query(Ruta).filter(
        Ruta.id_rutas == id_rutas
    ).first()

    if not ruta:
        raise HTTPException(
            status_code=404,
            detail="Ruta no encontrada"
        )

    ruta.tiempo_estimado = payload.tiempo_estimado
    ruta.distancia_ruta = payload.distancia_ruta
    ruta.ciudad_origen = payload.ciudad_origen
    ruta.ciudad_destino = payload.ciudad_destino
    ruta.cantidad_paquetes = payload.cantidad_paquetes
    ruta.codigo_ruta = payload.codigo_ruta
    ruta.tipo_vehiculo = payload.tipo_vehiculo
    ruta.nombre_conductor = payload.nombre_conductor

    db.commit()
    db.refresh(ruta)

    return ruta


# ─────────────────────────────────────────────
# DELETE /rutas/{id_rutas}
# Eliminar una ruta
# ─────────────────────────────────────────────

@router.delete(
    "/{id_rutas}",
    summary="Eliminar una ruta"
)
def eliminar_ruta(
    id_rutas: int,
    db: Session = Depends(get_db)
):

    ruta = db.query(Ruta).filter(
        Ruta.id_rutas == id_rutas
    ).first()

    if not ruta:
        raise HTTPException(
            status_code=404,
            detail="Ruta no encontrada"
        )

    db.delete(ruta)
    db.commit()

    return {
        "mensaje": "Ruta eliminada correctamente"
    }