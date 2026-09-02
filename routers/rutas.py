from fastapi import APIRouter

router = APIRouter(
    prefix="/rutas",
    tags=["Rutas"]
)


@router.get("/")
def obtener_rutas():
    return {
        "mensaje": "Lista de rutas"
    }


@router.post("/")
def crear_ruta():
    return {
        "mensaje": "Ruta creada"
    }