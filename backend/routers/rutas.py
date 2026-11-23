
from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel

from core.database import get_db
from core.security import get_current_user, TokenData

from models.rutas import Ruta
from models.usuario import Usuario
from models.usuario_roles import UsuarioRol
from models.vehiculo import Vehiculo

from schemas.schemas import RutaRequest, RutaResponse


router = APIRouter(prefix="/rutas", tags=["Rutas"])


# ============================================================
# ESQUEMA PARA ASIGNAR VEHÍCULO
# ============================================================

class AsignarVehiculoRequest(BaseModel):
    id_vehiculo: int | None = None


# ============================================================
# VERIFICAR ADMINISTRADOR
# ============================================================

def verificar_administrador(current_user: TokenData, db: Session):
    usuario_rol = db.query(UsuarioRol).filter(
        UsuarioRol.id_usuario == current_user.id_usuario,
        UsuarioRol.id_rol == 1
    ).first()

    if not usuario_rol:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos de administrador"
        )

    return True


# ============================================================
# VALIDAR CONDUCTOR
# ============================================================

def obtener_conductor(id_conductor: int, db: Session):
    conductor = db.query(Usuario).filter(
        Usuario.id_usuario == id_conductor
    ).first()

    if not conductor:
        raise HTTPException(
            status_code=404,
            detail="El conductor no existe"
        )

    if not conductor.activo:
        raise HTTPException(
            status_code=400,
            detail="El conductor está inactivo"
        )

    tiene_rol_conductor = db.query(UsuarioRol).filter(
        UsuarioRol.id_usuario == id_conductor,
        UsuarioRol.id_rol.in_([3, 4])
    ).first()

    if not tiene_rol_conductor:
        raise HTTPException(
            status_code=400,
            detail="El usuario seleccionado no tiene un rol de conductor"
        )

    return conductor


# ============================================================
# VALIDAR VEHÍCULO
# ============================================================

def obtener_vehiculo(id_vehiculo: int, db: Session):
    vehiculo = db.query(Vehiculo).filter(
        Vehiculo.id_vehiculo == id_vehiculo
    ).first()

    if not vehiculo:
        raise HTTPException(
            status_code=404,
            detail="El vehículo no existe"
        )

    return vehiculo


# ============================================================
# LISTAR RUTAS
# ============================================================

@router.get("/", response_model=List[RutaResponse])
def listar_rutas(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Ruta).all()


# ============================================================
# OBTENER UNA RUTA
# ============================================================

@router.get("/{id_rutas}", response_model=RutaResponse)
def obtener_ruta(
    id_rutas: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ruta = db.query(Ruta).filter(
        Ruta.id_rutas == id_rutas
    ).first()

    if not ruta:
        raise HTTPException(
            status_code=404,
            detail="Ruta no encontrada"
        )

    return ruta


# ============================================================
# ASIGNAR O RETIRAR VEHÍCULO DE UNA RUTA
# PUT /rutas/{id_rutas}/vehiculo
# SOLO ADMINISTRADOR
# ============================================================

@router.put("/{id_rutas}/vehiculo")
def asignar_vehiculo_ruta(
    id_rutas: int,
    payload: AsignarVehiculoRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_administrador(current_user, db)

    ruta = db.query(Ruta).filter(
        Ruta.id_rutas == id_rutas
    ).first()

    if not ruta:
        raise HTTPException(
            status_code=404,
            detail="Ruta no encontrada"
        )

    if ruta.id_conductor is None:
        raise HTTPException(
            status_code=400,
            detail="Esta ruta no tiene un conductor asignado"
        )

    obtener_conductor(ruta.id_conductor, db)

    # Si el valor es null, retirar el vehículo
    if payload.id_vehiculo is None:
        ruta.id_vehiculo = None

        try:
            db.commit()
            db.refresh(ruta)

            return {
                "mensaje": "Vehículo retirado de la ruta correctamente",
                "id_rutas": ruta.id_rutas,
                "id_conductor": ruta.id_conductor,
                "id_vehiculo": None
            }

        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail="No fue posible retirar el vehículo"
            )

    # Consultar vehículo
    vehiculo = obtener_vehiculo(payload.id_vehiculo, db)

    # Verificar disponibilidad
    if vehiculo.estado != "Disponible":
        raise HTTPException(
            status_code=409,
            detail=f"El vehículo no está disponible. Estado actual: {vehiculo.estado}"
        )

    # Verificar que no esté asignado a otra ruta
    asignacion_existente = db.query(Ruta).filter(
        Ruta.id_vehiculo == payload.id_vehiculo,
        Ruta.id_rutas != id_rutas
    ).first()

    if asignacion_existente:
        raise HTTPException(
            status_code=409,
            detail="Este vehículo ya está asignado a otra ruta"
        )

    try:
        ruta.id_vehiculo = vehiculo.id_vehiculo
        ruta.tipo_vehiculo = vehiculo.tipo_vehiculo

        db.commit()
        db.refresh(ruta)

        return {
            "mensaje": "Vehículo asignado correctamente",
            "id_rutas": ruta.id_rutas,
            "codigo_ruta": ruta.codigo_ruta,
            "id_conductor": ruta.id_conductor,
            "nombre_conductor": ruta.nombre_conductor,
            "id_vehiculo": vehiculo.id_vehiculo,
            "placa": vehiculo.placa,
            "tipo_vehiculo": vehiculo.tipo_vehiculo
        }

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="No se pudo asignar el vehículo por un conflicto en la base de datos"
        )

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="No fue posible asignar el vehículo"
        )


# ============================================================
# CREAR RUTA
# ============================================================

@router.post(
    "/",
    response_model=RutaResponse,
    status_code=status.HTTP_201_CREATED
)
def crear_ruta(
    payload: RutaRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_administrador(current_user, db)

    nombre_conductor = payload.nombre_conductor
    tipo_vehiculo = payload.tipo_vehiculo

    if payload.id_conductor is not None:
        conductor = obtener_conductor(payload.id_conductor, db)
        nombre_conductor = (
            f"{conductor.nombre} {conductor.apellido}"
        )

    if payload.id_vehiculo is not None:
        vehiculo = obtener_vehiculo(payload.id_vehiculo, db)
        tipo_vehiculo = vehiculo.tipo_vehiculo

        asignacion_existente = db.query(Ruta).filter(
            Ruta.id_vehiculo == payload.id_vehiculo
        ).first()

        if asignacion_existente:
            raise HTTPException(
                status_code=409,
                detail="Este vehículo ya está asignado a otra ruta"
            )

    ruta = Ruta(
        fecha_creacion=datetime.now(),
        tiempo_estimado=payload.tiempo_estimado,
        distancia_ruta=payload.distancia_ruta,
        ciudad_origen=payload.ciudad_origen,
        ciudad_destino=payload.ciudad_destino,
        cantidad_paquetes=payload.cantidad_paquetes,
        codigo_ruta=payload.codigo_ruta,
        tipo_vehiculo=tipo_vehiculo,
        nombre_conductor=nombre_conductor,
        id_conductor=payload.id_conductor,
        id_vehiculo=payload.id_vehiculo
    )

    try:
        db.add(ruta)
        db.commit()
        db.refresh(ruta)
        return ruta

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="No fue posible registrar la ruta"
        )


# ============================================================
# ACTUALIZAR RUTA
# ============================================================

@router.put("/{id_rutas}", response_model=RutaResponse)
def actualizar_ruta(
    id_rutas: int,
    payload: RutaRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_administrador(current_user, db)

    ruta = db.query(Ruta).filter(
        Ruta.id_rutas == id_rutas
    ).first()

    if not ruta:
        raise HTTPException(
            status_code=404,
            detail="Ruta no encontrada"
        )

    nombre_conductor = payload.nombre_conductor
    tipo_vehiculo = payload.tipo_vehiculo

    if payload.id_conductor is not None:
        conductor = obtener_conductor(payload.id_conductor, db)
        nombre_conductor = (
            f"{conductor.nombre} {conductor.apellido}"
        )

    if payload.id_vehiculo is not None:
        vehiculo = obtener_vehiculo(payload.id_vehiculo, db)
        tipo_vehiculo = vehiculo.tipo_vehiculo

        asignacion_existente = db.query(Ruta).filter(
            Ruta.id_vehiculo == payload.id_vehiculo,
            Ruta.id_rutas != id_rutas
        ).first()

        if asignacion_existente:
            raise HTTPException(
                status_code=409,
                detail="Este vehículo ya está asignado a otra ruta"
            )

    ruta.tiempo_estimado = payload.tiempo_estimado
    ruta.distancia_ruta = payload.distancia_ruta
    ruta.ciudad_origen = payload.ciudad_origen
    ruta.ciudad_destino = payload.ciudad_destino
    ruta.cantidad_paquetes = payload.cantidad_paquetes
    ruta.codigo_ruta = payload.codigo_ruta
    ruta.nombre_conductor = nombre_conductor
    ruta.tipo_vehiculo = tipo_vehiculo
    ruta.id_conductor = payload.id_conductor
    ruta.id_vehiculo = payload.id_vehiculo

    try:
        db.commit()
        db.refresh(ruta)
        return ruta

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="No fue posible actualizar la ruta"
        )


# ============================================================
# ELIMINAR RUTA
# ============================================================

@router.delete("/{id_rutas}")
def eliminar_ruta(
    id_rutas: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_administrador(current_user, db)

    ruta = db.query(Ruta).filter(
        Ruta.id_rutas == id_rutas
    ).first()

    if not ruta:
        raise HTTPException(
            status_code=404,
            detail="Ruta no encontrada"
        )

    try:
        db.delete(ruta)
        db.commit()

        return {
            "mensaje": "Ruta eliminada correctamente",
            "id_rutas": id_rutas
        }

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="No fue posible eliminar la ruta"
        )
