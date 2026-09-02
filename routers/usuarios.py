from fastapi import APIRouter

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)


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