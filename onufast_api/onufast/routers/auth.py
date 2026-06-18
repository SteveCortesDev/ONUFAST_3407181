from fastapi import APIRouter, HTTPException, status
from schemas.schemas import RegistroRequest, RegistroResponse, LoginRequest, LoginResponse
from core.security import hash_password, verify_password, create_token
import store

router = APIRouter(prefix="/auth", tags=["Autenticación"])


# ─────────────────────────────────────────────────────────────
#  POST /auth/registro
# ─────────────────────────────────────────────────────────────
@router.post(
    "/registro",
    response_model=RegistroResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear cuenta de usuario"
)
def registro(payload: RegistroRequest):
    # Verificar correo único
    for u in store.usuarios.values():
        if u["correo"] == payload.correo:
            raise HTTPException(
                status_code=400,
                detail="El correo ya está registrado"
            )

    nombre_completo = f"{payload.nombre} {payload.apellido}"

    # Verificar nombre único (se usa para login)
    for u in store.usuarios.values():
        if u["nombre"] == nombre_completo:
            raise HTTPException(
                status_code=400,
                detail="Ya existe un usuario con ese nombre completo"
            )

    uid = store.next_id("usuario")
    store.usuarios[uid] = {
        "id_usuario":     uid,
        "nombre":         nombre_completo,
        "clave":          hash_password(payload.contrasena),
        "correo":         payload.correo,
        "telefono":       payload.telefono or "",
        "tipo_documento": payload.tipo_documento,
        "num_documento":  payload.num_documento,
        "direccion":      "",
    }

    return RegistroResponse(
        id_usuario=uid,
        nombre=nombre_completo,
        correo=payload.correo,
    )


# ─────────────────────────────────────────────────────────────
#  POST /auth/login
# ─────────────────────────────────────────────────────────────
@router.post(
    "/login",
    response_model=LoginResponse,
    summary="Iniciar sesión"
)
def login(payload: LoginRequest):
    usuario = next(
        (u for u in store.usuarios.values() if u["nombre"] == payload.nombre),
        None
    )

    if not usuario or not verify_password(payload.contrasena, usuario["clave"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nombre o contraseña incorrectos"
        )

    # Guardar dirección
    store.usuarios[usuario["id_usuario"]]["direccion"] = payload.direccion

    token = create_token(usuario["id_usuario"], usuario["nombre"])

    return LoginResponse(
        access_token=token,
        id_usuario=usuario["id_usuario"],
        nombre=usuario["nombre"],
    )
