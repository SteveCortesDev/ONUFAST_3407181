from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from core.security import get_current_user, TokenData
from core.database import get_db

from models.usuario import Usuario
from models.documento import Documento

from models.rol import Rol
from models.usuario_roles import UsuarioRol

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)


@router.get("/perfil")
def obtener_perfil(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Buscar al usuario autenticado
    usuario = (
        db.query(Usuario)
        .filter(Usuario.id_usuario == current_user.id_usuario)
        .first()
    )

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    # Buscar documento del usuario
    documento = (
        db.query(Documento)
        .filter(Documento.id_usuario == usuario.id_usuario)
        .first()
    )

    # Buscar roles asignados al usuario
    roles = (
        db.query(Rol.nombre_rol)
        .join(UsuarioRol, UsuarioRol.id_rol == Rol.id_rol)
        .filter(UsuarioRol.id_usuario == usuario.id_usuario)
        .all()
    )

    # Organizar los roles en una lista
    lista_roles = [rol[0] for rol in roles]

    # Devolver información del perfil
    return {
        "id_usuario": usuario.id_usuario,
        "nombre": f"{usuario.nombre} {usuario.apellido}",
        "correo": usuario.correo,
        "telefono": usuario.telefono,
        "jornada": usuario.jornada,
        "tipo_documento": documento.tipo_documento if documento else None,
        "num_documento": documento.num_documento if documento else None,
        "roles": lista_roles
    }

@router.get("/")
def obtener_usuarios():
    return {
        "mensaje": "Lista de usuarios"
    }


@router.post("/")
def crear_usuario():
    return {
        "mensaje": "Usuario creado"
    }