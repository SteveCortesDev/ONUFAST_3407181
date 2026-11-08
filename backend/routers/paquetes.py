from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.paquete import Paquete
from schemas.schemas import PaqueteRequest, PaqueteResponse


router = APIRouter(
    prefix="/paquetes",
    tags=["Paquetes"]
)


@router.get(
    "/",
    response_model=List[PaqueteResponse],
    summary="Ver todos los paquetes"
)
def listar_paquetes(db: Session = Depends(get_db)):
    return db.query(Paquete).all()


@router.get(
    "/{id_paquete}",
    response_model=PaqueteResponse,
    summary="Ver un paquete"
)
def obtener_paquete(
    id_paquete: int,
    db: Session = Depends(get_db)
):
    paquete = db.query(Paquete).filter(
        Paquete.id_paquete == id_paquete
    ).first()

    if not paquete:
        raise HTTPException(
            status_code=404,
            detail="Paquete no encontrado"
        )

    return paquete


@router.get(
    "/envio/{id_envio}",
    response_model=List[PaqueteResponse],
    summary="Ver paquetes de un envío"
)
def listar_paquetes_envio(
    id_envio: int,
    db: Session = Depends(get_db)
):
    paquetes = db.query(Paquete).filter(
        Paquete.id_envio == id_envio
    ).all()

    return paquetes


@router.post(
    "/",
    response_model=PaqueteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar un paquete"
)
def crear_paquete(
    payload: PaqueteRequest,
    db: Session = Depends(get_db)
):
    paquete = Paquete(
        id_envio=payload.id_envio,
        peso=payload.peso,
        alto=payload.alto,
        largo=payload.largo,
        ancho=payload.ancho,
        descripcion=payload.descripcion,
        origen=payload.origen,
        destino=payload.destino,
        cod_rastreo=f"PKG-{payload.id_envio}-{payload.peso}"
    )

    db.add(paquete)
    db.commit()
    db.refresh(paquete)

    return paquete


@router.put(
    "/{id_paquete}",
    response_model=PaqueteResponse,
    summary="Actualizar un paquete"
)
def actualizar_paquete(
    id_paquete: int,
    payload: PaqueteRequest,
    db: Session = Depends(get_db)
):
    paquete = db.query(Paquete).filter(
        Paquete.id_paquete == id_paquete
    ).first()

    if not paquete:
        raise HTTPException(
            status_code=404,
            detail="Paquete no encontrado"
        )

    paquete.id_envio = payload.id_envio
    paquete.peso = payload.peso
    paquete.alto = payload.alto
    paquete.largo = payload.largo
    paquete.ancho = payload.ancho
    paquete.descripcion = payload.descripcion
    paquete.origen = payload.origen
    paquete.destino = payload.destino

    db.commit()
    db.refresh(paquete)

    return paquete


@router.delete(
    "/{id_paquete}",
    summary="Eliminar un paquete"
)
def eliminar_paquete(
    id_paquete: int,
    db: Session = Depends(get_db)
):
    paquete = db.query(Paquete).filter(
        Paquete.id_paquete == id_paquete
    ).first()

    if not paquete:
        raise HTTPException(
            status_code=404,
            detail="Paquete no encontrado"
        )

    db.delete(paquete)
    db.commit()

    return {
        "mensaje": "Paquete eliminado correctamente"
    }