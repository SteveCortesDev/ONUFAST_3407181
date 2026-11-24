"""Endpoints del panel de bodega (versión plana del proyecto).

Todas las consultas van contra las tablas reales del sistema
(usuario, envio, paquete, estado_envio, rutas, rol, ...), sin
necesidad de agregar columnas nuevas.

Los esquemas de entrada viven aquí mismo para que este router sea
autocontenido: solo hay que agregarlo a main.py.
"""

import uuid
from collections import defaultdict
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user

from models.documento import Documento
from models.envio import Envio
from models.estado_envio import EstadoEnvio
from models.paquete import Paquete
from models.rol import Rol
from models.rutas import Ruta
from models.tipo_envio import TipoEnvio
from models.usuario import Usuario
from models.usuario_roles import UsuarioRol

from schemas.schemas import TokenData


router = APIRouter(prefix="/bodega", tags=["Bodega"])


# ─────────────────────────────────────────────
# ESQUEMAS DE ENTRADA
# ─────────────────────────────────────────────

class BodegaPaqueteRequest(BaseModel):
    """Ingreso manual de un paquete a bodega."""

    guia: Optional[str] = Field(None, max_length=50)
    destinatario: str = Field(..., min_length=2, max_length=100)
    documento_destinatario: str = Field(..., min_length=4, max_length=50)

    origen: str = Field(..., min_length=2, max_length=100)
    destino: str = Field(..., min_length=2, max_length=100)

    peso: float = Field(..., gt=0)
    alto: float = Field(..., gt=0)
    largo: float = Field(..., gt=0)
    ancho: float = Field(..., gt=0)

    descripcion: Optional[str] = Field(None, max_length=200)
    id_tipenvio: Optional[int] = None


class BodegaEstadoRequest(BaseModel):
    estado: str = Field(..., min_length=2, max_length=50)


class BodegaAsignarRequest(BaseModel):
    id_paquete: int
    id_rutas: Optional[int] = None


# ─────────────────────────────────────────────
# CONSTANTES
# ─────────────────────────────────────────────

ESTADOS_VALIDOS = [
    "Pendiente",
    "Confirmado",
    "En bodega",
    "En camino",
    "Entregado",
    "Devuelto",
    "Cancelado",
]

ESTADOS_POR_RECIBIR = ("Pendiente", "Confirmado")
ESTADOS_POR_DESPACHAR = ("Pendiente", "Confirmado", "En bodega")

RUTA_SIN_ASIGNAR = "SIN-ASIGNAR"


# ─────────────────────────────────────────────
# UTILIDADES
# ─────────────────────────────────────────────

def _numero(valor) -> float:
    """Convierte Decimal/None a float para poder enviarlo como JSON."""
    try:
        return float(valor or 0)
    except (TypeError, ValueError):
        return 0.0


def _obtener_o_crear_estado(db: Session, nombre: str) -> EstadoEnvio:
    estado = db.query(EstadoEnvio).filter(
        EstadoEnvio.estado == nombre
    ).first()

    if not estado:
        estado = EstadoEnvio(estado=nombre)
        db.add(estado)
        db.commit()
        db.refresh(estado)

    return estado


def _obtener_o_crear_tipo_envio(
    db: Session,
    id_tipenvio: Optional[int]
) -> int:
    if id_tipenvio:
        tipo = db.query(TipoEnvio).filter(
            TipoEnvio.id_tipenvio == id_tipenvio
        ).first()

        if not tipo:
            raise HTTPException(
                status_code=404,
                detail="El tipo de envío indicado no existe"
            )

        return tipo.id_tipenvio

    tipo = db.query(TipoEnvio).order_by(TipoEnvio.id_tipenvio).first()

    if not tipo:
        tipo = TipoEnvio(descripcion="Normal")
        db.add(tipo)
        db.commit()
        db.refresh(tipo)

    return tipo.id_tipenvio


def _obtener_o_crear_ruta_sin_asignar(db: Session) -> Ruta:
    ruta = db.query(Ruta).filter(
        Ruta.codigo_ruta == RUTA_SIN_ASIGNAR
    ).first()

    if not ruta:
        ruta = Ruta(
            fecha_creacion=datetime.now(),
            tiempo_estimado="Por definir",
            distancia_ruta=0,
            ciudad_origen="Por definir",
            ciudad_destino="Por definir",
            cantidad_paquetes=0,
            codigo_ruta=RUTA_SIN_ASIGNAR,
            tipo_vehiculo="Por definir",
            nombre_conductor="Por definir",
        )
        db.add(ruta)
        db.commit()
        db.refresh(ruta)

    return ruta


def _generar_codigo(db: Session) -> str:
    while True:
        codigo = f"ONU-{uuid.uuid4().hex[:10].upper()}"

        existe = db.query(Envio).filter(
            Envio.codigo_rastreo == codigo
        ).first()

        if not existe:
            return codigo


def _generar_guia(db: Session) -> str:
    """GUIA-0006, GUIA-0007... según las guías que ya existen."""
    numero = db.query(Paquete).count() + 1

    while True:
        guia = f"GUIA-{numero:04d}"

        existe = db.query(Paquete).filter(
            Paquete.num_guia == guia
        ).first()

        if not existe:
            return guia

        numero += 1


def _filas(db: Session):
    """Paquete + envío + estado + ruta + usuario que lo registró."""
    return (
        db.query(Paquete, Envio, EstadoEnvio, Ruta, Usuario)
        .join(Envio, Paquete.id_envio == Envio.id_envio)
        .join(EstadoEnvio, Envio.id_estadoenvio == EstadoEnvio.id_estadoenvio)
        .join(Ruta, Envio.id_rutas == Ruta.id_rutas)
        .join(Usuario, Envio.id_usuario == Usuario.id_usuario)
    )


def _paquete_json(paquete, envio, estado, ruta, usuario) -> dict:
    dimensiones = None

    if paquete.alto and paquete.largo and paquete.ancho:
        dimensiones = (
            f"{_numero(paquete.alto):g} x "
            f"{_numero(paquete.largo):g} x "
            f"{_numero(paquete.ancho):g} cm"
        )

    return {
        "id_paquete": paquete.id_paquete,
        "id_envio": envio.id_envio,
        "guia": paquete.num_guia or paquete.cod_rastreo,
        "codigo_rastreo": paquete.cod_rastreo,
        "destinatario": envio.nombre_destinatario,
        "documento_destinatario": envio.documento_destinatario,
        "origen": paquete.origen,
        "destino": paquete.destino,
        "peso": _numero(paquete.peso),
        "alto": _numero(paquete.alto),
        "largo": _numero(paquete.largo),
        "ancho": _numero(paquete.ancho),
        "dimensiones": dimensiones,
        "descripcion": paquete.descripcion,
        "estado_paquete": envio.estado_paquete,
        "estado": estado.estado,
        "id_estadoenvio": estado.id_estadoenvio,
        "fecha": (
            envio.fecha_creacion.isoformat()
            if envio.fecha_creacion else None
        ),
        "id_rutas": ruta.id_rutas if ruta else None,
        "codigo_ruta": ruta.codigo_ruta if ruta else RUTA_SIN_ASIGNAR,
        "registrado_por": f"{usuario.nombre} {usuario.apellido}".strip(),
    }


def _paquete_por_id(db: Session, id_paquete: int) -> dict:
    fila = _filas(db).filter(Paquete.id_paquete == id_paquete).first()

    if not fila:
        raise HTTPException(
            status_code=404,
            detail="Paquete no encontrado"
        )

    return _paquete_json(*fila)


def _envio_del_paquete(db: Session, id_paquete: int) -> Envio:
    paquete = db.query(Paquete).filter(
        Paquete.id_paquete == id_paquete
    ).first()

    if not paquete:
        raise HTTPException(
            status_code=404,
            detail="Paquete no encontrado"
        )

    envio = db.query(Envio).filter(
        Envio.id_envio == paquete.id_envio
    ).first()

    if not envio:
        raise HTTPException(
            status_code=404,
            detail="El paquete no tiene un envío asociado"
        )

    return envio


# ─────────────────────────────────────────────
# GET /bodega/resumen
# ─────────────────────────────────────────────

@router.get(
    "/resumen",
    summary="Totales reales del panel de bodega"
)
def resumen(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    filas = _filas(db).all()

    conteo = defaultdict(int)

    for _, _, estado, _, _ in filas:
        conteo[estado.estado] += 1

    rutas_reales = db.query(Ruta).filter(
        Ruta.codigo_ruta != RUTA_SIN_ASIGNAR
    ).count()

    return {
        "total_paquetes": len(filas),
        "pendientes": conteo["Pendiente"] + conteo["Confirmado"],
        "en_bodega": conteo["En bodega"],
        "en_camino": conteo["En camino"],
        "entregados": conteo["Entregado"],
        "devueltos": conteo["Devuelto"] + conteo["Cancelado"],
        "rutas": rutas_reales,
    }


# ─────────────────────────────────────────────
# GET /bodega/paquetes
# ─────────────────────────────────────────────

@router.get(
    "/paquetes",
    summary="Inventario real de paquetes"
)
def listar_paquetes(
    estado: Optional[str] = None,
    buscar: Optional[str] = None,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = _filas(db)

    if estado:
        query = query.filter(EstadoEnvio.estado == estado)

    if buscar:
        texto = f"%{buscar.strip().lower()}%"
        query = query.filter(
            Paquete.num_guia.ilike(texto)
            | Paquete.cod_rastreo.ilike(texto)
            | Paquete.destino.ilike(texto)
            | Envio.nombre_destinatario.ilike(texto)
        )

    filas = query.order_by(Paquete.id_paquete.desc()).all()

    return {
        "paquetes": [_paquete_json(*fila) for fila in filas]
    }


# ─────────────────────────────────────────────
# GET /bodega/recepciones
# Envíos registrados que aún no ingresan a bodega
# ─────────────────────────────────────────────

@router.get(
    "/recepciones",
    summary="Paquetes pendientes de recibir en bodega"
)
def recepciones(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    filas = (
        _filas(db)
        .filter(EstadoEnvio.estado.in_(ESTADOS_POR_RECIBIR))
        .order_by(Paquete.id_paquete.desc())
        .all()
    )

    return {
        "pendientes": [_paquete_json(*fila) for fila in filas]
    }


# ─────────────────────────────────────────────
# POST /bodega/paquetes
# Registrar el ingreso manual de un paquete
# ─────────────────────────────────────────────

@router.post(
    "/paquetes",
    status_code=status.HTTP_201_CREATED,
    summary="Registrar el ingreso de un paquete a bodega"
)
def registrar_paquete(
    payload: BodegaPaqueteRequest,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    guia = (payload.guia or "").strip().upper() or None

    if guia:
        repetida = db.query(Paquete).filter(
            Paquete.num_guia == guia
        ).first()

        if repetida:
            raise HTTPException(
                status_code=400,
                detail=f"Ya existe un paquete con la guía {guia}"
            )

    codigo = _generar_codigo(db)
    estado = _obtener_o_crear_estado(db, "En bodega")
    ruta = _obtener_o_crear_ruta_sin_asignar(db)
    id_tipenvio = _obtener_o_crear_tipo_envio(db, payload.id_tipenvio)

    envio = Envio(
        id_usuario=current_user.id_usuario,
        id_tipenvio=id_tipenvio,
        id_estadoenvio=estado.id_estadoenvio,
        id_rutas=ruta.id_rutas,
        codigo_rastreo=codigo,
        fecha_creacion=datetime.now(),
        nombre_destinatario=payload.destinatario.strip(),
        documento_destinatario=payload.documento_destinatario.strip(),
        estado_paquete="Intacto",
    )

    db.add(envio)
    db.commit()
    db.refresh(envio)

    paquete = Paquete(
        id_envio=envio.id_envio,
        num_guia=guia or _generar_guia(db),
        cod_rastreo=codigo,
        peso=payload.peso,
        alto=payload.alto,
        largo=payload.largo,
        ancho=payload.ancho,
        descripcion=payload.descripcion,
        origen=payload.origen.strip(),
        destino=payload.destino.strip(),
    )

    db.add(paquete)
    db.commit()
    db.refresh(paquete)

    return {
        "paquete": _paquete_por_id(db, paquete.id_paquete),
        "mensaje": f"Paquete {paquete.num_guia} registrado en bodega",
    }


# ─────────────────────────────────────────────
# PATCH /bodega/paquetes/{id_paquete}/estado
# ─────────────────────────────────────────────

@router.patch(
    "/paquetes/{id_paquete}/estado",
    summary="Cambiar el estado real de un paquete"
)
def cambiar_estado(
    id_paquete: int,
    payload: BodegaEstadoRequest,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if payload.estado not in ESTADOS_VALIDOS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Estado no válido. Usa uno de: "
                + ", ".join(ESTADOS_VALIDOS)
            )
        )

    envio = _envio_del_paquete(db, id_paquete)
    estado = _obtener_o_crear_estado(db, payload.estado)

    envio.id_estadoenvio = estado.id_estadoenvio

    db.commit()

    return {
        "paquete": _paquete_por_id(db, id_paquete),
        "mensaje": f"Estado actualizado a {payload.estado}",
    }


# ─────────────────────────────────────────────
# POST /bodega/recepciones/{id_paquete}/recibir
# ─────────────────────────────────────────────

@router.post(
    "/recepciones/{id_paquete}/recibir",
    summary="Marcar un paquete como recibido en bodega"
)
def recibir_paquete(
    id_paquete: int,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    envio = _envio_del_paquete(db, id_paquete)
    estado = _obtener_o_crear_estado(db, "En bodega")

    envio.id_estadoenvio = estado.id_estadoenvio

    db.commit()

    return {
        "paquete": _paquete_por_id(db, id_paquete),
        "mensaje": "Paquete recibido en bodega",
    }


# ─────────────────────────────────────────────
# GET /bodega/despachos
# ─────────────────────────────────────────────

@router.get(
    "/despachos",
    summary="Rutas reales con sus paquetes asignados"
)
def listar_despachos(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    paquetes = [
        _paquete_json(*fila) for fila in _filas(db).all()
    ]

    rutas = []

    for ruta in db.query(Ruta).order_by(Ruta.id_rutas).all():
        if ruta.codigo_ruta == RUTA_SIN_ASIGNAR:
            continue

        asignados = [
            p for p in paquetes if p["id_rutas"] == ruta.id_rutas
        ]

        despachada = any(
            p["estado"] == "En camino" for p in asignados
        )

        rutas.append({
            "id_rutas": ruta.id_rutas,
            "codigo_ruta": ruta.codigo_ruta,
            "origen": ruta.ciudad_origen,
            "destino": ruta.ciudad_destino,
            "conductor": ruta.nombre_conductor,
            "vehiculo": ruta.tipo_vehiculo,
            "hora": ruta.tiempo_estimado,
            "distancia": _numero(ruta.distancia_ruta),
            "capacidad": max(ruta.cantidad_paquetes or 0, len(asignados)),
            "estado": "Despachada" if despachada else "Programada",
            "paquetes": asignados,
        })

    sin_ruta = [
        p for p in paquetes
        if p["codigo_ruta"] == RUTA_SIN_ASIGNAR
        and p["estado"] == "En bodega"
    ]

    return {
        "rutas": rutas,
        "sin_ruta": sin_ruta,
    }


# ─────────────────────────────────────────────
# POST /bodega/despachos/asignar
# ─────────────────────────────────────────────

@router.post(
    "/despachos/asignar",
    summary="Asignar un paquete a una ruta"
)
def asignar_paquete(
    payload: BodegaAsignarRequest,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ruta = db.query(Ruta).filter(
        Ruta.id_rutas == payload.id_rutas
    ).first()

    if not ruta:
        raise HTTPException(
            status_code=404,
            detail="La ruta indicada no existe"
        )

    if ruta.codigo_ruta == RUTA_SIN_ASIGNAR:
        raise HTTPException(
            status_code=400,
            detail="No puedes asignar paquetes a la ruta SIN-ASIGNAR"
        )

    envio = _envio_del_paquete(db, payload.id_paquete)

    envio.id_rutas = ruta.id_rutas

    db.commit()

    return {
        "paquete": _paquete_por_id(db, payload.id_paquete),
        "mensaje": f"Paquete asignado a la ruta {ruta.codigo_ruta}",
    }


# ─────────────────────────────────────────────
# POST /bodega/despachos/quitar
# ─────────────────────────────────────────────

@router.post(
    "/despachos/quitar",
    summary="Quitar un paquete de su ruta"
)
def quitar_paquete(
    payload: BodegaAsignarRequest,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ruta = _obtener_o_crear_ruta_sin_asignar(db)
    envio = _envio_del_paquete(db, payload.id_paquete)

    envio.id_rutas = ruta.id_rutas

    db.commit()

    return {
        "paquete": _paquete_por_id(db, payload.id_paquete),
        "mensaje": "Paquete retirado de la ruta",
    }


# ─────────────────────────────────────────────
# POST /bodega/despachos/{id_rutas}/despachar
# ─────────────────────────────────────────────

@router.post(
    "/despachos/{id_rutas}/despachar",
    summary="Despachar todos los paquetes de una ruta"
)
def despachar_ruta(
    id_rutas: int,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ruta = db.query(Ruta).filter(Ruta.id_rutas == id_rutas).first()

    if not ruta:
        raise HTTPException(
            status_code=404,
            detail="La ruta indicada no existe"
        )

    envios = db.query(Envio).filter(
        Envio.id_rutas == id_rutas
    ).all()

    estado_camino = _obtener_o_crear_estado(db, "En camino")
    estados = {
        e.id_estadoenvio: e.estado
        for e in db.query(EstadoEnvio).all()
    }

    despachados = 0

    for envio in envios:
        if estados.get(envio.id_estadoenvio) in ESTADOS_POR_DESPACHAR:
            envio.id_estadoenvio = estado_camino.id_estadoenvio
            despachados += 1

    if despachados == 0:
        raise HTTPException(
            status_code=400,
            detail="La ruta no tiene paquetes por despachar"
        )

    ruta.cantidad_paquetes = len(envios)

    db.commit()

    return {
        "despachados": despachados,
        "codigo_ruta": ruta.codigo_ruta,
        "mensaje": (
            f"Ruta {ruta.codigo_ruta} despachada con "
            f"{despachados} paquete(s)"
        ),
    }


# ─────────────────────────────────────────────
# GET /bodega/perfil
# ─────────────────────────────────────────────

@router.get(
    "/perfil",
    summary="Datos reales del encargado de bodega"
)
def perfil(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    usuario = db.query(Usuario).filter(
        Usuario.id_usuario == current_user.id_usuario
    ).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    documento = db.query(Documento).filter(
        Documento.id_usuario == usuario.id_usuario
    ).first()

    roles = (
        db.query(Rol)
        .join(UsuarioRol, UsuarioRol.id_rol == Rol.id_rol)
        .filter(UsuarioRol.id_usuario == usuario.id_usuario)
        .all()
    )

    return {
        "id_usuario": usuario.id_usuario,
        "nombre": usuario.nombre,
        "apellido": usuario.apellido,
        "nombre_completo": f"{usuario.nombre} {usuario.apellido}".strip(),
        "correo": usuario.correo,
        "telefono": usuario.telefono,
        "jornada": usuario.jornada,
        "documento": (
            {
                "tipo_documento": documento.tipo_documento,
                "num_documento": documento.num_documento,
            }
            if documento else None
        ),
        "roles": [rol.nombre_rol for rol in roles],
    }
