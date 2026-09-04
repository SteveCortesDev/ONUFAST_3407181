from fastapi import APIRouter, HTTPException, Depends
from core.security import get_current_user, TokenData
import store

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)


@router.get("/perfil")
def obtener_perfil(
    current_user: TokenData = Depends(get_current_user)
):
    usuario = store.usuarios.get(current_user.id_usuario)

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    return {
        "id_usuario": usuario["id_usuario"],
        "nombre": usuario["nombre"],
        "correo": usuario["correo"],
        "telefono": usuario["telefono"],
        "tipo_documento": usuario["tipo_documento"],
        "num_documento": usuario["num_documento"],
        "direccion": usuario["direccion"]
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