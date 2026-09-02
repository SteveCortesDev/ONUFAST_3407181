from pydantic import BaseModel, EmailStr, Field
from typing import Optional


# ─────────────────────────────────────────────
#  USUARIO / AUTH
# ─────────────────────────────────────────────

class RegistroRequest(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100, description="Nombre")
    apellido: str = Field(..., min_length=2, max_length=100, description="Apellido")
    tipo_documento: str = Field(..., description="Ej: CC, TI, Pasaporte")
    num_documento: str = Field(..., min_length=4, max_length=50)
    correo: EmailStr
    contrasena: str = Field(..., min_length=6, max_length=100)
    telefono: Optional[str] = Field(None, max_length=20)

class RegistroResponse(BaseModel):
    id_usuario: int
    nombre: str
    correo: str
    mensaje: str = "Cuenta creada exitosamente"


class LoginRequest(BaseModel):
    nombre: str = Field(..., description="Nombre completo (nombre + apellido)")
    contrasena: str
    direccion: str = Field(..., description="Dirección de entrega o residencia")

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    id_usuario: int
    nombre: str


# ─────────────────────────────────────────────
#  PAQUETE
# ─────────────────────────────────────────────

class PaqueteRequest(BaseModel):
    tipo_producto: str = Field(..., max_length=100, description="Ej: Electrónico, Ropa, Documentos")
    peso: float = Field(..., gt=0, description="Peso en kg")
    alto: float = Field(..., gt=0, description="Alto en cm")
    largo: float = Field(..., gt=0, description="Largo en cm")
    ancho: float = Field(..., gt=0, description="Ancho en cm")
    es_fragil: bool = Field(False, description="¿El paquete es frágil?")
    descripcion: Optional[str] = Field(None, max_length=200)

class PaqueteResponse(BaseModel):
    id_paquete: int
    cod_rastreo: str
    tipo_producto: str
    peso: float
    alto: float
    largo: float
    ancho: float
    es_fragil: bool
    descripcion: Optional[str]
    mensaje: str = "Paquete registrado exitosamente"


# ─────────────────────────────────────────────
#  PEDIDO / ENVÍO
# ─────────────────────────────────────────────

class PedidoRequest(BaseModel):
    id_tipenvio: int = Field(..., description="1 = Express, 2 = Normal")
    cantidad: int = Field(1, ge=1, description="Cantidad de paquetes")

class PedidoResponse(BaseModel):
    id_pedido: int
    codigo_rastreo: str
    cantidad: int
    tipo_envio: str
    es_express: bool
    estado: str
    mensaje: str = "Pedido creado exitosamente"


class TipoEnvioResponse(BaseModel):
    id_tipenvio: int
    descripcion: str
    espress: bool


# ─────────────────────────────────────────────
#  TOKEN
# ─────────────────────────────────────────────

class TokenData(BaseModel):
    id_usuario: Optional[int] = None
    nombre: Optional[str] = None
