from datetime import datetime, timedelta

from jose import JWTError, jwt
from passlib.context import CryptContext

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from schemas.schemas import TokenData


SECRET_KEY = "onufast-secret-2024"  # cámbialo en producción

ALGORITHM = "HS256"

TOKEN_EXPIRE_HOURS = 8


# Configuración para las contraseñas
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# Configuración para recibir el token Bearer
security = HTTPBearer()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_token(id_usuario: int, nombre: str) -> str:
    expire = datetime.utcnow() + timedelta(
        hours=TOKEN_EXPIRE_HOURS
    )

    return jwt.encode(
        {
            "id_usuario": id_usuario,
            "nombre": nombre,
            "exp": expire
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> TokenData:

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        id_usuario = payload.get("id_usuario")
        nombre = payload.get("nombre")

        if id_usuario is None:
            raise ValueError

        return TokenData(
            id_usuario=id_usuario,
            nombre=nombre
        )

    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )