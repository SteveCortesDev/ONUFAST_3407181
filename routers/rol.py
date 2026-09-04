from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.rol import Rol
from schemas.schemas import RolRequest, RolResponse


router = APIRouter(prefix="/roles", tags=["Roles"])


# ─────────────────────────────────────────────
# GET /roles/
# ─────────────────────────────────────────────

@router.get(
    "/",
    response_model=List[RolResponse],
    summary="Ver todos los roles"
)
def listar_roles(db: Session = Depends(get_db)):
    return db.query(Rol).all()


# ─────────────────────────────────────────────
# GET /roles/{id_rol}
# ─────────────────────────────────────────────

@router.get(
    "/{id_rol}",
    response_model=RolResponse,
    summary="Ver un rol"
)
def obtener_rol(
    id_rol: int,
    db: Session = Depends(get_db)
):
    rol = db.query(Rol).filter(
        Rol.id_rol == id_rol
    ).first()

    if not rol:
        raise HTTPException(
            status_code=404,
            detail="Rol no encontrado"
        )

    return rol


# ─────────────────────────────────────────────
# POST /roles/
# ─────────────────────────────────────────────

@router.post(
    "/",
    response_model=RolResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un nuevo rol"
)
def crear_rol(
    payload: RolRequest,
    db: Session = Depends(get_db)
):
    rol = Rol(
        nombre_rol=payload.nombre_rol
    )

    db.add(rol)
    db.commit()
    db.refresh(rol)

    return rol


# ─────────────────────────────────────────────
# PUT /roles/{id_rol}
# ─────────────────────────────────────────────

@router.put(
    "/{id_rol}",
    response_model=RolResponse,
    summary="Actualizar un rol"
)
def actualizar_rol(
    id_rol: int,
    payload: RolRequest,
    db: Session = Depends(get_db)
):
    rol = db.query(Rol).filter(
        Rol.id_rol == id_rol
    ).first()

    if not rol:
        raise HTTPException(
            status_code=404,
            detail="Rol no encontrado"
        )

    rol.nombre_rol = payload.nombre_rol

    db.commit()
    db.refresh(rol)

    return rol


# ─────────────────────────────────────────────
# DELETE /roles/{id_rol}
# ─────────────────────────────────────────────

@router.delete(
    "/{id_rol}",
    summary="Eliminar un rol"
)
def eliminar_rol(
    id_rol: int,
    db: Session = Depends(get_db)
):
    rol = db.query(Rol).filter(
        Rol.id_rol == id_rol
    ).first()

    if not rol:
        raise HTTPException(
            status_code=404,
            detail="Rol no encontrado"
        )

    db.delete(rol)
    db.commit()

    return {
        "mensaje": "Rol eliminado correctamente"
    }