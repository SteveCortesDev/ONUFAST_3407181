
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from core.database import get_db
from core.security import get_current_user
from schemas.schemas import VehiculoRequest, VehiculoResponse
from models.vehiculo import Vehiculo
from models.usuario_roles import UsuarioRol


router = APIRouter(
    prefix="/vehiculos",
    tags=["Vehículos"]
)


# ============================================================
# VERIFICAR PERMISOS DE ADMINISTRADOR
# ============================================================

def verificar_administrador(current_user, db: Session):
    rol = (
        db.query(UsuarioRol)
        .filter(
            UsuarioRol.id_usuario == current_user.id_usuario,
            UsuarioRol.id_rol == 1
        )
        .first()
    )

    if not rol:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos de administrador"
        )


# ============================================================
# LISTAR VEHÍCULOS
# GET /vehiculos/
# ============================================================

@router.get("/", response_model=list[VehiculoResponse])
def listar_vehiculos(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(Vehiculo).order_by(Vehiculo.id_vehiculo).all()


# ============================================================
# CONSULTAR VEHÍCULO POR ID
# GET /vehiculos/{id_vehiculo}
# ============================================================

@router.get("/{id_vehiculo}", response_model=VehiculoResponse)
def obtener_vehiculo(
    id_vehiculo: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    vehiculo = (
        db.query(Vehiculo)
        .filter(Vehiculo.id_vehiculo == id_vehiculo)
        .first()
    )

    if not vehiculo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehículo no encontrado"
        )

    return vehiculo


# ============================================================
# REGISTRAR VEHÍCULO
# POST /vehiculos/
# SOLO ADMINISTRADOR
# ============================================================

@router.post(
    "/",
    response_model=VehiculoResponse,
    status_code=status.HTTP_201_CREATED
)
def registrar_vehiculo(
    datos: VehiculoRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    verificar_administrador(current_user, db)

    estados_validos = ["Disponible", "En ruta", "Mantenimiento"]

    if datos.estado not in estados_validos:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Estado no válido. Usa: Disponible, En ruta o Mantenimiento"
        )

    placa = datos.placa.strip().upper()

    existente = (
        db.query(Vehiculo)
        .filter(Vehiculo.placa == placa)
        .first()
    )

    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un vehículo con esa placa"
        )

    vehiculo = Vehiculo(
        placa=placa,
        tipo_vehiculo=datos.tipo_vehiculo.strip(),
        marca=datos.marca.strip(),
        modelo=datos.modelo.strip(),
        capacidad_kg=datos.capacidad_kg,
        estado=datos.estado
    )

    try:
        db.add(vehiculo)
        db.commit()
        db.refresh(vehiculo)

        return vehiculo

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No se pudo registrar el vehículo. Verifica que la placa no esté repetida"
        )

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al registrar el vehículo"
        )


# ============================================================
# ACTUALIZAR VEHÍCULO
# PUT /vehiculos/{id_vehiculo}
# SOLO ADMINISTRADOR
# ============================================================

@router.put("/{id_vehiculo}", response_model=VehiculoResponse)
def actualizar_vehiculo(
    id_vehiculo: int,
    datos: VehiculoRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    verificar_administrador(current_user, db)

    vehiculo = (
        db.query(Vehiculo)
        .filter(Vehiculo.id_vehiculo == id_vehiculo)
        .first()
    )

    if not vehiculo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehículo no encontrado"
        )

    estados_validos = ["Disponible", "En ruta", "Mantenimiento"]

    if datos.estado not in estados_validos:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Estado no válido. Usa: Disponible, En ruta o Mantenimiento"
        )

    placa = datos.placa.strip().upper()

    placa_existente = (
        db.query(Vehiculo)
        .filter(
            Vehiculo.placa == placa,
            Vehiculo.id_vehiculo != id_vehiculo
        )
        .first()
    )

    if placa_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Esa placa ya está registrada en otro vehículo"
        )

    try:
        vehiculo.placa = placa
        vehiculo.tipo_vehiculo = datos.tipo_vehiculo.strip()
        vehiculo.marca = datos.marca.strip()
        vehiculo.modelo = datos.modelo.strip()
        vehiculo.capacidad_kg = datos.capacidad_kg
        vehiculo.estado = datos.estado

        db.commit()
        db.refresh(vehiculo)

        return vehiculo

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No se pudo actualizar el vehículo. Verifica los datos"
        )

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al actualizar el vehículo"
        )


# ============================================================
# ELIMINAR VEHÍCULO
# DELETE /vehiculos/{id_vehiculo}
# SOLO ADMINISTRADOR
# ============================================================

@router.delete("/{id_vehiculo}")
def eliminar_vehiculo(
    id_vehiculo: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    verificar_administrador(current_user, db)

    vehiculo = (
        db.query(Vehiculo)
        .filter(Vehiculo.id_vehiculo == id_vehiculo)
        .first()
    )

    if not vehiculo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehículo no encontrado"
        )

    try:
        db.delete(vehiculo)
        db.commit()

        return {
            "mensaje": "Vehículo eliminado correctamente",
            "id_vehiculo": id_vehiculo
        }

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo eliminar el vehículo"
        )
