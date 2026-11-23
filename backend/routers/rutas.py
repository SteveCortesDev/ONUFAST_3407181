from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session


from core.database import get_db
from models.rutas import Ruta
from schemas.schemas import RutaRequest, RutaResponse

from models.usuario import Usuario
from models.usuario_roles import UsuarioRol
from core.security import get_current_user
from schemas.schemas import RutaRequest, RutaResponse, RutaEstadoRequest, TokenData


router = APIRouter(prefix="/rutas", tags=["Rutas"])

def obtener_conductor(db: Session, id_usuario: int):
    usuario = db.query(Usuario).filter(
        Usuario.id_usuario == id_usuario
    ).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    rol_conductor = db.query(UsuarioRol).filter(
        UsuarioRol.id_usuario == id_usuario,
        UsuarioRol.id_rol == 3
    ).first()

    if not rol_conductor:
        raise HTTPException(
            status_code=400,
            detail="El usuario seleccionado no tiene el rol de conductor"
        )

    return usuario

# ─────────────────────────────────────────────
# GET /rutas/
# Listar todas las rutas
# ─────────────────────────────────────────────

@router.get(
    "/",
    response_model=List[RutaResponse],
    summary="Ver todas las rutas"
)
def listar_rutas(db: Session = Depends(get_db)):

    rutas = db.query(Ruta).all()

    return rutas


@router.get(
    "/mis-rutas",
    response_model=List[RutaResponse],
    summary="Ver las rutas asignadas al conductor"
)
def mis_rutas(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rol_conductor = db.query(UsuarioRol).filter(
        UsuarioRol.id_usuario == current_user.id_usuario,
        UsuarioRol.id_rol == 3
    ).first()

    if not rol_conductor:
        raise HTTPException(
            status_code=403,
            detail="No tienes permisos de conductor"
        )

    rutas = db.query(Ruta).filter(
        Ruta.id_usuario_conductor == current_user.id_usuario
    ).all()

    return rutas


# ─────────────────────────────────────────────
# GET /rutas/{id_rutas}
# Obtener una ruta
# ─────────────────────────────────────────────

@router.get(
    "/{id_rutas}",
    response_model=RutaResponse,
    summary="Ver el detalle de una ruta"
)
def obtener_ruta(
    id_rutas: int,
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


# ─────────────────────────────────────────────
# POST /rutas/
# Crear una nueva ruta
# ─────────────────────────────────────────────

@router.post(
    "/",
    response_model=RutaResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar una nueva ruta"
)
def crear_ruta(
    payload: RutaRequest,
    db: Session = Depends(get_db)
):

    ruta = Ruta(
        fecha_creacion=datetime.now(),
        tiempo_estimado=payload.tiempo_estimado,
        distancia_ruta=payload.distancia_ruta,
        ciudad_origen=payload.ciudad_origen,
        ciudad_destino=payload.ciudad_destino,
        cantidad_paquetes=payload.cantidad_paquetes,
        codigo_ruta=payload.codigo_ruta,
        tipo_vehiculo=payload.tipo_vehiculo,
        nombre_conductor=payload.nombre_conductor
    )

    db.add(ruta)
    db.commit()
    db.refresh(ruta)

    return ruta


# ─────────────────────────────────────────────
# PUT /rutas/{id_rutas}
# Actualizar una ruta
# ─────────────────────────────────────────────

@router.put(
    "/{id_rutas}",
    response_model=RutaResponse,
    summary="Actualizar una ruta"
)
def actualizar_ruta(
    id_rutas: int,
    payload: RutaRequest,
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

    ruta.tiempo_estimado = payload.tiempo_estimado
    ruta.distancia_ruta = payload.distancia_ruta
    ruta.ciudad_origen = payload.ciudad_origen
    ruta.ciudad_destino = payload.ciudad_destino
    ruta.cantidad_paquetes = payload.cantidad_paquetes
    ruta.codigo_ruta = payload.codigo_ruta
    ruta.tipo_vehiculo = payload.tipo_vehiculo
    ruta.nombre_conductor = payload.nombre_conductor

    db.commit()
    db.refresh(ruta)

    return ruta



# ─────────────────────────────────────────────
# PATCH /rutas/{id_rutas}/estado
# Cambiar el estado de una ruta
# ─────────────────────────────────────────────

@router.patch(
    "/{id_rutas}/estado",
    summary="Cambiar el estado de una ruta"
)
def cambiar_estado_ruta(
    id_rutas: int,
    payload: RutaEstadoRequest,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Verificar que el usuario tenga rol de conductor
    rol_conductor = db.query(UsuarioRol).filter(
        UsuarioRol.id_usuario == current_user.id_usuario,
        UsuarioRol.id_rol == 3
    ).first()

    if not rol_conductor:
        raise HTTPException(
            status_code=403,
            detail="No tienes permisos de conductor"
        )

    # Buscar la ruta asignada al conductor
    ruta = db.query(Ruta).filter(
        Ruta.id_rutas == id_rutas,
        Ruta.id_usuario_conductor == current_user.id_usuario
    ).first()

    if not ruta:
        raise HTTPException(
            status_code=404,
            detail="Ruta no encontrada o no está asignada a este conductor"
        )

    # Validar las transiciones permitidas
    transiciones = {
        "Pendiente": "En proceso",
        "En proceso": "Finalizada"
    }

    siguiente_estado = transiciones.get(ruta.estado)

    if siguiente_estado != payload.estado:
        raise HTTPException(
            status_code=400,
            detail=f"No se puede cambiar de {ruta.estado} a {payload.estado}"
        )

    ruta.estado = payload.estado

    db.commit()
    db.refresh(ruta)

    return {
        "mensaje": "Estado de la ruta actualizado correctamente",
        "id_rutas": ruta.id_rutas,
        "estado": ruta.estado
    }


# ─────────────────────────────────────────────
# DELETE /rutas/{id_rutas}
# Eliminar una ruta
# ─────────────────────────────────────────────

@router.delete(
    "/{id_rutas}",
    summary="Eliminar una ruta"
)
def eliminar_ruta(
    id_rutas: int,
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

    db.delete(ruta)
    db.commit()

    return {
        "mensaje": "Ruta eliminada correctamente"
    }