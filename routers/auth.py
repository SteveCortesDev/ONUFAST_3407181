from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from models.usuario_roles import UsuarioRol

from schemas.schemas import (
    RegistroRequest,
    RegistroResponse,
    LoginRequest,
    LoginResponse
)

from core.security import hash_password, verify_password, create_token
from core.database import get_db

from models.usuario import Usuario
from models.documento import Documento

import store


router = APIRouter(prefix="/auth", tags=["Autenticación"])


# ─────────────────────────────────────────────────────────────
# POST /auth/registro
# ─────────────────────────────────────────────────────────────
@router.post(
    '/registro',
    response_model=RegistroResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear cuenta de usuario"
)
def registro(
    payload: RegistroRequest,
    db: Session = Depends(get_db)
):
    # Verificar correo único
    usuario_existente = (
        db.query(Usuario)
        .filter(Usuario.correo == payload.correo)
        .first()
    )

    if usuario_existente:
        raise HTTPException(
            status_code=400,
            detail="El correo ya está registrado"
        )

    try:
        # Crear usuario
        usuario = Usuario(
            nombre=payload.nombre,
            apellido=payload.apellido,
            clave=hash_password(payload.contrasena),
            correo=payload.correo,
            telefono=payload.telefono or "",
            jornada="No definida"
        )

        db.add(usuario)
        db.flush()  # Obtiene el ID sin confirmar todavía la transacción

        # Crear documento
        documento = Documento(
            tipo_documento=payload.tipo_documento,
            num_documento=payload.num_documento,
            id_usuario=usuario.id_usuario
        )

        # Asignar rol Cliente (ID 2)
        usuario_rol = UsuarioRol(
            id_usuario=usuario.id_usuario,
            id_rol=2
        )

        db.add(documento)
        db.add(usuario_rol)

        # Guardar todo
        db.commit()
        db.refresh(usuario)

        return RegistroResponse(
            id_usuario=usuario.id_usuario,
            nombre=f"{usuario.nombre} {usuario.apellido}",
            correo=usuario.correo
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="No fue posible completar el registro"
        )

# ─────────────────────────────────────────────────────────────
# POST /auth/login
# ─────────────────────────────────────────────────────────────
@router.post(
    "/login",
    response_model=LoginResponse,
    summary="Iniciar sesión"
)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
):
    # Buscar usuario por nombre completo
    nombre_completo = " ".join(payload.nombre.split())

    usuario = (
    db.query(Usuario)
    .filter(
        func.lower(
            func.concat(Usuario.nombre, " ", Usuario.apellido)
        ) == nombre_completo.lower()
    )
    .first()
)

    # Verificar usuario y contraseña
    if not usuario or not verify_password(
        payload.contrasena,
        usuario.clave
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nombre o contraseña incorrectos"
        )

    # Crear token
    token = create_token(
        usuario.id_usuario,
        f"{usuario.nombre} {usuario.apellido}"
    )

    return LoginResponse(
        access_token=token,
        id_usuario=usuario.id_usuario,
        nombre=f"{usuario.nombre} {usuario.apellido}"
    )