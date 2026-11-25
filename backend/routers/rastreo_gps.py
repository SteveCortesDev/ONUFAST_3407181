from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user, TokenData
from models.envio import Envio
from models.estado_envio import EstadoEnvio
from models.paquete import Paquete
from models.rutas import Ruta
from models.tipo_envio import TipoEnvio
from models.ubicacion_envio import UbicacionEnvio
from models.usuario import Usuario
from models.usuario_roles import UsuarioRol


router = APIRouter(
    prefix="/rastreo-gps",
    tags=["Rastreo GPS"]
)


# ============================================================
# ESQUEMAS DE ENTRADA
# ============================================================

class CoordenadaRequest(BaseModel):
    latitud: float = Field(..., ge=-90.0, le=90.0)
    longitud: float = Field(..., ge=-180.0, le=180.0)
    precision_m: Optional[float] = Field(default=None, ge=0)
    velocidad: Optional[float] = Field(default=None, ge=0)


class IniciarRutaEnvioRequest(BaseModel):
    latitud: Optional[float] = Field(default=None, ge=-90.0, le=90.0)
    longitud: Optional[float] = Field(default=None, ge=-180.0, le=180.0)
    precision_m: Optional[float] = Field(default=None, ge=0)
    velocidad: Optional[float] = Field(default=None, ge=0)


# ============================================================
# FUNCIONES AUXILIARES
# ============================================================

def _validar_conductor_asignado(db: Session, id_envio: int, id_usuario: int) -> Envio:
    tiene_rol = db.query(UsuarioRol).filter(
        UsuarioRol.id_usuario == id_usuario,
        UsuarioRol.id_rol.in_([3, 4])
    ).first()

    if not tiene_rol:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos de conductor"
        )

    envio = (
        db.query(Envio)
        .join(Ruta, Envio.id_rutas == Ruta.id_rutas)
        .filter(
            Envio.id_envio == id_envio,
            Ruta.id_conductor == id_usuario,
            Ruta.codigo_ruta != "SIN-ASIGNAR"
        )
        .first()
    )

    if not envio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Envío no encontrado o no asignado a una ruta de este conductor"
        )

    return envio


def _obtener_o_crear_estado(db: Session, nombre_estado: str) -> EstadoEnvio:
    estado_db = db.query(EstadoEnvio).filter(
        EstadoEnvio.estado == nombre_estado
    ).first()

    if not estado_db:
        estado_db = EstadoEnvio(estado=nombre_estado)
        db.add(estado_db)
        db.commit()
        db.refresh(estado_db)

    return estado_db


def _serializar_ubicacion(ub: Optional[UbicacionEnvio]):
    if not ub:
        return None
    return {
        "id_ubicacion": ub.id_ubicacion,
        "id_envio": ub.id_envio,
        "latitud": ub.latitud,
        "longitud": ub.longitud,
        "precision_m": ub.precision_m,
        "velocidad": ub.velocidad,
        "activo": ub.activo,
        "actualizado_en": ub.actualizado_en.isoformat() if ub.actualizado_en else None
    }


def _construir_respuesta_rastreo(db: Session, envio: Envio) -> dict:
    usuario = db.query(Usuario).filter(Usuario.id_usuario == envio.id_usuario).first()
    paquete = db.query(Paquete).filter(Paquete.id_envio == envio.id_envio).first()
    tipo = db.query(TipoEnvio).filter(TipoEnvio.id_tipenvio == envio.id_tipenvio).first()
    estado = db.query(EstadoEnvio).filter(EstadoEnvio.id_estadoenvio == envio.id_estadoenvio).first()
    ruta = db.query(Ruta).filter(Ruta.id_rutas == envio.id_rutas).first()

    registros = (
        db.query(UbicacionEnvio)
        .filter(UbicacionEnvio.id_envio == envio.id_envio)
        .order_by(UbicacionEnvio.id_ubicacion.desc())
        .limit(30)
        .all()
    )

    ultima_ubicacion = registros[0] if registros else None
    historial = [_serializar_ubicacion(item) for item in reversed(registros)]

    estado_texto = estado.estado if estado else envio.estado_paquete

    return {
        "id_envio": envio.id_envio,
        "id_usuario": envio.id_usuario,
        "codigo_rastreo": envio.codigo_rastreo,
        "fecha_creacion": envio.fecha_creacion.isoformat() if envio.fecha_creacion else None,
        "remitente": f"{usuario.nombre} {usuario.apellido}".strip() if usuario else "No especificado",
        "nombre_destinatario": envio.nombre_destinatario,
        "documento_destinatario": envio.documento_destinatario,
        "origen": paquete.origen if paquete and paquete.origen else (ruta.ciudad_origen if ruta else "No especificado"),
        "destino": paquete.destino if paquete and paquete.destino else (ruta.ciudad_destino if ruta else "No especificado"),
        "direccion": paquete.direccion if paquete and paquete.direccion else None,
        "barrio": paquete.barrio if paquete and paquete.barrio else None,
        "descripcion": paquete.descripcion if paquete else None,
        "tipo_envio": tipo.descripcion if tipo else "No especificado",
        "estado": estado_texto,
        "estado_paquete": estado_texto,
        "ruta": {
            "id_rutas": ruta.id_rutas,
            "codigo_ruta": ruta.codigo_ruta,
            "estado": ruta.estado,
            "ciudad_origen": ruta.ciudad_origen,
            "ciudad_destino": ruta.ciudad_destino,
            "nombre_conductor": ruta.nombre_conductor,
            "tipo_vehiculo": ruta.tipo_vehiculo
        } if ruta else None,
        "viaje_activo": bool(ultima_ubicacion and ultima_ubicacion.activo and estado_texto != "Entregado"),
        "ubicacion_actual": _serializar_ubicacion(ultima_ubicacion),
        "historial_ubicaciones": historial
    }


# ============================================================
# POST /rastreo-gps/envios/{id_envio}/iniciar
# CONDUCTOR INICIA RUTA / VIAJE DEL ENVÍO
# ============================================================

@router.post("/envios/{id_envio}/iniciar")
def iniciar_ruta_envio(
    id_envio: int,
    payload: Optional[IniciarRutaEnvioRequest] = None,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    envio = _validar_conductor_asignado(db, id_envio, current_user.id_usuario)
    estado_camino = _obtener_o_crear_estado(db, "En camino")

    envio.id_estadoenvio = estado_camino.id_estadoenvio
    envio.estado_paquete = "En camino"

    ruta = db.query(Ruta).filter(Ruta.id_rutas == envio.id_rutas).first()
    if ruta and ruta.estado == "Pendiente":
        ruta.estado = "En proceso"

    db.query(UbicacionEnvio).filter(
        UbicacionEnvio.id_envio == envio.id_envio,
        UbicacionEnvio.activo == True
    ).update({"activo": False})

    lat = payload.latitud if payload and payload.latitud is not None else 4.7110
    lng = payload.longitud if payload and payload.longitud is not None else -74.0721

    nueva_ubicacion = UbicacionEnvio(
        id_envio=envio.id_envio,
        latitud=lat,
        longitud=lng,
        precision_m=payload.precision_m if payload else None,
        velocidad=payload.velocidad if payload else None,
        activo=True,
        actualizado_en=datetime.now()
    )

    db.add(nueva_ubicacion)
    db.commit()
    db.refresh(nueva_ubicacion)

    return {
        "mensaje": "Ruta iniciada. Transmisión de coordenadas activa.",
        "id_envio": envio.id_envio,
        "codigo_rastreo": envio.codigo_rastreo,
        "estado": "En camino",
        "viaje_activo": True,
        "ubicacion_actual": _serializar_ubicacion(nueva_ubicacion)
    }


# ============================================================
# POST /rastreo-gps/envios/{id_envio}/ubicacion
# CONDUCTOR ENVÍA COORDENADAS PERIÓDICAS (CADA 5-10 SEG)
# ============================================================

@router.post("/envios/{id_envio}/ubicacion")
def registrar_ubicacion_envio(
    id_envio: int,
    payload: CoordenadaRequest,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    envio = _validar_conductor_asignado(db, id_envio, current_user.id_usuario)

    nueva_ubicacion = UbicacionEnvio(
        id_envio=envio.id_envio,
        latitud=payload.latitud,
        longitud=payload.longitud,
        precision_m=payload.precision_m,
        velocidad=payload.velocidad,
        activo=True,
        actualizado_en=datetime.now()
    )

    db.add(nueva_ubicacion)
    db.commit()
    db.refresh(nueva_ubicacion)

    return {
        "mensaje": "Coordenada actualizada",
        "id_envio": envio.id_envio,
        "viaje_activo": True,
        "ubicacion_actual": _serializar_ubicacion(nueva_ubicacion)
    }


# ============================================================
# POST /rastreo-gps/envios/{id_envio}/finalizar
# DETENER TRANSMISIÓN GPS DEL ENVÍO
# ============================================================

@router.post("/envios/{id_envio}/finalizar")
def finalizar_ruta_envio(
    id_envio: int,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    envio = _validar_conductor_asignado(db, id_envio, current_user.id_usuario)

    db.query(UbicacionEnvio).filter(
        UbicacionEnvio.id_envio == envio.id_envio
    ).update({"activo": False})

    db.commit()

    return {
        "mensaje": "Transmisión GPS detenida",
        "id_envio": envio.id_envio,
        "viaje_activo": False
    }


# ============================================================
# GET /rastreo-gps/codigo/{codigo_rastreo}
# CONSULTA PÚBLICA DE UBICACIÓN Y ESTADO POR CÓDIGO
# ============================================================

@router.get("/codigo/{codigo_rastreo}")
def obtener_rastreo_por_codigo(
    codigo_rastreo: str,
    db: Session = Depends(get_db)
):
    codigo_limpio = codigo_rastreo.strip().upper()
    envio = db.query(Envio).filter(
        Envio.codigo_rastreo == codigo_limpio
    ).first()

    if not envio:
        envio = db.query(Envio).filter(
            Envio.codigo_rastreo == codigo_rastreo.strip()
        ).first()

    if not envio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Envío no encontrado"
        )

    return _construir_respuesta_rastreo(db, envio)


# ============================================================
# GET /rastreo-gps/envios/{id_envio}
# CONSULTAR RASTREO POR ID DE ENVÍO
# ============================================================

@router.get("/envios/{id_envio}")
def obtener_rastreo_por_id(
    id_envio: int,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    envio = db.query(Envio).filter(Envio.id_envio == id_envio).first()

    if not envio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Envío no encontrado"
        )

    return _construir_respuesta_rastreo(db, envio)