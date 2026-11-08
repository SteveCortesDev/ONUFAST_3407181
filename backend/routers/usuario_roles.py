from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.usuario_roles import UsuarioRol
from schemas.schemas import UsuarioRolRequest, UsuarioRolResponse


router = APIRouter(
    prefix="/usuario-roles",
    tags=["Usuario Roles"]
)


@router.get(
    "/",
    response_model=List[UsuarioRolResponse],
    summary="Ver todas las relaciones usuario-rol"
)
def listar_usuario_roles(db: Session = Depends(get_db)):
    return db.query(UsuarioRol).all()


@router.get(
    "/{id_usuario_rol}",
    response_model=UsuarioRolResponse,
    summary="Ver una relación usuario-rol"
)
def obtener_usuario_rol(
    id_usuario_rol: int,
    db: Session = Depends(get_db)
):
    relacion = db.query(UsuarioRol).filter(
        UsuarioRol.id_usuario_rol == id_usuario_rol
    ).first()

    if not relacion:
        raise HTTPException(
            status_code=404,
            detail="Relación usuario-rol no encontrada"
        )

    return relacion


@router.post(
    "/",
    response_model=UsuarioRolResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Asignar un rol a un usuario"
)
def crear_usuario_rol(
    payload: UsuarioRolRequest,
    db: Session = Depends(get_db)
):
    relacion = UsuarioRol(
        id_usuario=payload.id_usuario,
        id_rol=payload.id_rol
    )

    db.add(relacion)
    db.commit()
    db.refresh(relacion)

    return relacion


@router.put(
    "/{id_usuario_rol}",
    response_model=UsuarioRolResponse,
    summary="Actualizar una relación usuario-rol"
)
def actualizar_usuario_rol(
    id_usuario_rol: int,
    payload: UsuarioRolRequest,
    db: Session = Depends(get_db)
):
    relacion = db.query(UsuarioRol).filter(
        UsuarioRol.id_usuario_rol == id_usuario_rol
    ).first()

    if not relacion:
        raise HTTPException(
            status_code=404,
            detail="Relación usuario-rol no encontrada"
        )

    relacion.id_usuario = payload.id_usuario
    relacion.id_rol = payload.id_rol

    db.commit()
    db.refresh(relacion)

    return relacion


@router.delete(
    "/{id_usuario_rol}",
    summary="Eliminar una relación usuario-rol"
)
def eliminar_usuario_rol(
    id_usuario_rol: int,
    db: Session = Depends(get_db)
):
    relacion = db.query(UsuarioRol).filter(
        UsuarioRol.id_usuario_rol == id_usuario_rol
    ).first()

    if not relacion:
        raise HTTPException(
            status_code=404,
            detail="Relación usuario-rol no encontrada"
        )

    db.delete(relacion)
    db.commit()

    return {
        "mensaje": "Relación usuario-rol eliminada correctamente"
    }