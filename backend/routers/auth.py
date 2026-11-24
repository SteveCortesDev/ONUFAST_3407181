
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

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
from models.usuario_roles import UsuarioRol
from models.rol import Rol


router = APIRouter(prefix="/auth", tags=["Autenticación"])


# ============================================================
# POST /auth/registro
# ============================================================

@router.post(
    "/registro",
    response_model=RegistroResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear cuenta de usuario"
)
def registro(
    payload: RegistroRequest,
    db: Session = Depends(get_db)
):
    # Verificar si el correo ya existe
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

    # Buscar el rol Cliente (ID 2)
    rol_cliente = (
        db.query(Rol)
        .filter(Rol.id_rol == 2)
        .first()
    )

    if not rol_cliente:
        raise HTTPException(
            status_code=500,
            detail="No se encontró el rol Cliente en la base de datos"
        )

    try:
        # Crear usuario
        usuario = Usuario(
            nombre=payload.nombre,
            apellido=payload.apellido,
            clave=hash_password(payload.contrasena),
            correo=payload.correo,
            telefono=payload.telefono or "",
            jornada="No definida",
            activo=True
        )

        db.add(usuario)
        db.flush()

        # Crear documento relacionado
        documento = Documento(
            tipo_documento=payload.tipo_documento,
            num_documento=payload.num_documento,
            id_usuario=usuario.id_usuario
        )

        db.add(documento)

        # Asignar rol Cliente
        usuario_rol = UsuarioRol(
            id_usuario=usuario.id_usuario,
            id_rol=rol_cliente.id_rol
        )

        db.add(usuario_rol)

        # Guardar todos los registros en una sola transacción
        db.commit()
        db.refresh(usuario)

        return RegistroResponse(
            id_usuario=usuario.id_usuario,
            nombre=f"{usuario.nombre} {usuario.apellido}",
            correo=usuario.correo
        )

    except Exception:
        db.rollback()
        raise


# ============================================================
# POST /auth/login
# ============================================================

@router.post(
    "/login",
    response_model=LoginResponse,
    summary="Iniciar sesión"
)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
):
    # Buscar usuario por correo
    usuario = (
        db.query(Usuario)
        .filter(Usuario.correo == payload.correo)
        .first()
    )

    # Verificar usuario y contraseña
    if not usuario or not verify_password(
        payload.contrasena,
        usuario.clave
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos"
        )

    # Comprobar si la cuenta está activa
    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tu cuenta está inactiva. Comunícate con el administrador."
        )

    # Consultar el rol real del usuario
    resultado_rol = (
        db.query(UsuarioRol, Rol)
        .join(Rol, UsuarioRol.id_rol == Rol.id_rol)
        .filter(UsuarioRol.id_usuario == usuario.id_usuario)
        .order_by(UsuarioRol.id_usuario_rol.asc())
        .first()
    )

    if not resultado_rol:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="El usuario no tiene un rol asignado"
        )

    usuario_rol, rol = resultado_rol

    # Crear token
    token = create_token(
        usuario.id_usuario,
        f"{usuario.nombre} {usuario.apellido}"
    )

    return LoginResponse(
        access_token=token,
        id_usuario=usuario.id_usuario,
        nombre=f"{usuario.nombre} {usuario.apellido}",
        correo=usuario.correo,
        id_rol=rol.id_rol,
        nombre_rol=rol.nombre_rol
    )
