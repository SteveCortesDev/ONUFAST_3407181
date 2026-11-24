
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime


# ============================================================
# USUARIO / AUTH
# ============================================================

class RegistroRequest(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    apellido: str = Field(..., min_length=2, max_length=100)
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
    correo: EmailStr = Field(..., description="Correo del usuario")
    contrasena: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    id_usuario: int
    nombre: str
    correo: str
    id_rol: int
    nombre_rol: str


# ============================================================
# ROL
# ============================================================

class RolRequest(BaseModel):
    nombre_rol: str = Field(..., min_length=2, max_length=50)


class RolResponse(BaseModel):
    id_rol: int
    nombre_rol: str


# ============================================================
# USUARIO_ROLES
# ============================================================

class UsuarioRolRequest(BaseModel):
    id_usuario: int
    id_rol: int


class UsuarioRolResponse(BaseModel):
    id_usuario_rol: int
    id_usuario: int
    id_rol: int


# ============================================================
# DOCUMENTO
# ============================================================

class DocumentoRequest(BaseModel):
    tipo_documento: str = Field(..., min_length=2, max_length=30)
    num_documento: str = Field(..., min_length=4, max_length=50)
    id_usuario: int


class DocumentoResponse(BaseModel):
    id_documento: int
    tipo_documento: str
    num_documento: str
    id_usuario: int


# ============================================================
# TIPO_ENVIO
# ============================================================

class TipoEnvioRequest(BaseModel):
    descripcion: str = Field(..., min_length=2, max_length=100)


class TipoEnvioResponse(BaseModel):
    id_tipenvio: int
    descripcion: str


# ============================================================
# PAQUETE
# ============================================================

class PaqueteRequest(BaseModel):
    id_envio: int
    peso: float = Field(..., gt=0)
    alto: float = Field(..., gt=0)
    largo: float = Field(..., gt=0)
    ancho: float = Field(..., gt=0)
    descripcion: Optional[str] = Field(None, max_length=200)
    origen: Optional[str] = Field(None, max_length=100)
    destino: Optional[str] = Field(None, max_length=100)


class PaqueteResponse(BaseModel):
    id_paquete: int
    id_envio: int
    num_guia: Optional[str] = None
    cod_rastreo: str
    peso: float
    alto: float
    largo: float
    ancho: float
    descripcion: Optional[str] = None
    origen: Optional[str] = None
    destino: Optional[str] = None


# ============================================================
# ENVIO
# ============================================================

class EnvioRequest(BaseModel):
    id_usuario: int
    id_tipenvio: int = Field(..., description="ID del tipo de envío")
    id_estadoenvio: int = Field(..., description="ID del estado del envío")
    id_rutas: int = Field(..., description="ID de la ruta")
    nombre_destinatario: str = Field(..., max_length=100)
    documento_destinatario: str = Field(..., max_length=50)
    estado_paquete: str = Field(..., max_length=30)


class EnvioResponse(BaseModel):
    id_envio: int
    id_usuario: int
    id_tipenvio: int
    id_estadoenvio: int
    id_rutas: int
    codigo_rastreo: str
    fecha_creacion: datetime
    nombre_destinatario: str
    documento_destinatario: str
    estado_paquete: str


class RastreoResponse(BaseModel):
    id_envio: int
    id_usuario: int
    codigo_rastreo: str
    fecha_creacion: datetime
    remitente: str
    nombre_destinatario: str
    documento_destinatario: str
    origen: Optional[str] = None
    destino: Optional[str] = None
    tipo_envio: str
    estado_paquete: str


# ============================================================
# TOKEN
# ============================================================

class TokenData(BaseModel):
    id_usuario: Optional[int] = None
    nombre: Optional[str] = None


# ============================================================
# RUTAS
# ============================================================

class RutaRequest(BaseModel):
    ciudad_origen: str = Field(..., max_length=100)
    ciudad_destino: str = Field(..., max_length=100)
    tiempo_estimado: str = Field(..., max_length=50)
    distancia_ruta: float = Field(..., gt=0)
    tipo_vehiculo: str = Field(..., max_length=30)
    nombre_conductor: Optional[str] = Field(None, max_length=50)
    cantidad_paquetes: int = Field(..., ge=0)
    codigo_ruta: str = Field(..., max_length=100)

    # Conductor y vehículo asignados
    id_conductor: Optional[int] = None
    id_vehiculo: Optional[int] = None


class RutaResponse(BaseModel):
    id_rutas: int
    fecha_creacion: datetime
    tiempo_estimado: str
    distancia_ruta: float
    ciudad_origen: str
    ciudad_destino: str
    cantidad_paquetes: int
    codigo_ruta: Optional[str] = None
    tipo_vehiculo: str
    nombre_conductor: str
    estado: str
    id_conductor: Optional[int] = None
    id_vehiculo: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class RutaEstadoRequest(BaseModel):
    estado: str = Field(..., min_length=2, max_length=30)


class RutaAsignacionRequest(BaseModel):
    id_conductor: int = Field(..., gt=0)


# ============================================================
# ESTADO_ENVIO
# ============================================================

class EstadoEnvioRequest(BaseModel):
    estado: str = Field(..., min_length=2, max_length=50)


class EstadoEnvioResponse(BaseModel):
    id_estadoenvio: int
    estado: str


# ============================================================
# FACTURA
# ============================================================

class FacturaRequest(BaseModel):
    id_envio: int = Field(..., description="ID del envío relacionado")
    num_factura: str = Field(..., max_length=50)
    subtotal: float = Field(..., ge=0)
    iva: float = Field(..., ge=0)
    total_pago: float = Field(..., ge=0)
    metodo_pago: str = Field(..., max_length=50)


class FacturaResponse(BaseModel):
    id_factura: int
    id_envio: int
    num_factura: str
    fecha_emision: Optional[datetime] = None
    subtotal: float
    iva: float
    total_pago: float
    metodo_pago: str


# ============================================================
# REGISTRAR PAQUETE
# ============================================================

class RegistrarPaqueteRequest(BaseModel):
    id_tipenvio: int
    nombre_destinatario: str = Field(..., max_length=100)
    documento_destinatario: str = Field(..., max_length=50)
    peso: float = Field(..., gt=0)
    alto: float = Field(..., gt=0)
    largo: float = Field(..., gt=0)
    ancho: float = Field(..., gt=0)
    descripcion: Optional[str] = Field(None, max_length=200)
    origen: str = Field(..., max_length=100)
    destino: str = Field(..., max_length=100)
    direccion: str = Field(..., max_length=200)
    barrio: str = Field(..., max_length=100)
    telefono_destinatario: str = Field(..., max_length=20)
    referencias: Optional[str] = Field(None, max_length=200)
    precio_envio: float = Field(..., ge=0)
    metodo_pago: str = Field(..., max_length=50)


class RegistrarPaqueteResponse(BaseModel):
    id_envio: int
    id_paquete: int
    codigo_rastreo: str
    mensaje: str = "Paquete registrado exitosamente"


# ============================================================
# VEHÍCULOS
# ============================================================

class VehiculoRequest(BaseModel):
    placa: str = Field(..., min_length=5, max_length=10)
    tipo_vehiculo: str = Field(..., min_length=2, max_length=30)
    marca: str = Field(..., min_length=2, max_length=50)
    modelo: str = Field(..., min_length=1, max_length=50)
    capacidad_kg: float = Field(..., gt=0)
    estado: str = Field(default="Disponible", max_length=20)


class VehiculoResponse(BaseModel):
    id_vehiculo: int
    placa: str
    tipo_vehiculo: str
    marca: str
    modelo: str
    capacidad_kg: float
    estado: str

    model_config = ConfigDict(from_attributes=True)
