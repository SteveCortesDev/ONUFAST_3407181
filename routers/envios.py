import uuid
from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.envio import Envio
from schemas.schemas import EnvioRequest, EnvioResponse


router = APIRouter(
    prefix="/envios",
    tags=["Envíos"]
)
from core.security import get_current_user
from schemas.schemas import TokenData
from models.paquete import Paquete
from models.tipo_envio import TipoEnvio


@router.get(
    "/mis-pedidos",
    summary="Ver mis pedidos (usuario autenticado)"
)
def mis_pedidos(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    envios = (
        db.query(Envio)
        .filter(Envio.id_usuario == current_user.id_usuario)
        .all()
    )

    resultado = []

    for envio in envios:
        tipo = db.query(TipoEnvio).filter(
            TipoEnvio.id_tipenvio == envio.id_tipenvio
        ).first()

        cantidad_paquetes = db.query(Paquete).filter(
            Paquete.id_envio == envio.id_envio
        ).count()

        resultado.append({
            "id_pedido": envio.id_envio,
            "codigo_rastreo": envio.codigo_rastreo,
            "tipo_envio": tipo.descripcion if tipo else "Desconocido",
            "cantidad": cantidad_paquetes,
            "paquetes_registrados": cantidad_paquetes,
            "estado": envio.estado_paquete,
        })

    return {"pedidos": resultado}


def generar_codigo_rastreo() -> str:
    return f"ONU-{uuid.uuid4().hex[:10].upper()}"


# ─────────────────────────────────────────────
# GET /envios/
# ─────────────────────────────────────────────

@router.get(
    "/",
    response_model=List[EnvioResponse],
    summary="Ver todos los envíos"
)
def listar_envios(db: Session = Depends(get_db)):
    return db.query(Envio).all()



from models.estado_envio import EstadoEnvio
from models.rutas import Ruta
from models.paquete import Paquete
from schemas.schemas import RegistrarPaqueteRequest, RegistrarPaqueteResponse


def obtener_o_crear_estado_pendiente(db: Session) -> int:
    estado = db.query(EstadoEnvio).filter(
        EstadoEnvio.estado == "Pendiente"
    ).first()

    if not estado:
        estado = EstadoEnvio(estado="Pendiente")
        db.add(estado)
        db.commit()
        db.refresh(estado)

    return estado.id_estadoenvio


def obtener_o_crear_ruta_sin_asignar(db: Session) -> int:
    ruta = db.query(Ruta).filter(
        Ruta.codigo_ruta == "SIN-ASIGNAR"
    ).first()

    if not ruta:
        ruta = Ruta(
            fecha_creacion=datetime.now(),
            tiempo_estimado="Por definir",
            distancia_ruta=0.01,
            ciudad_origen="Por definir",
            ciudad_destino="Por definir",
            cantidad_paquetes=0,
            codigo_ruta="SIN-ASIGNAR",
            tipo_vehiculo="Por definir",
            nombre_conductor="Por definir"
        )
        db.add(ruta)
        db.commit()
        db.refresh(ruta)

    return ruta.id_rutas


@router.post(
    "/registrar-paquete",
    response_model=RegistrarPaqueteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar un nuevo paquete (crea envío + paquete)"
)
def registrar_paquete(
    payload: RegistrarPaqueteRequest,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    codigo = generar_codigo_rastreo()
    id_estado = obtener_o_crear_estado_pendiente(db)
    id_ruta = obtener_o_crear_ruta_sin_asignar(db)

    envio = Envio(
        id_usuario=current_user.id_usuario,
        id_tipenvio=payload.id_tipenvio,
        id_estadoenvio=id_estado,
        id_rutas=id_ruta,
        codigo_rastreo=codigo,
        fecha_creacion=datetime.now(),
        nombre_destinatario=payload.nombre_destinatario,
        documento_destinatario=payload.documento_destinatario,
        estado_paquete="Pendiente"
    )
    db.add(envio)
    db.commit()
    db.refresh(envio)

    paquete = Paquete(
        id_envio=envio.id_envio,
        cod_rastreo=codigo,
        peso=payload.peso,
        alto=payload.alto,
        largo=payload.largo,
        ancho=payload.ancho,
        descripcion=payload.descripcion,
        origen=payload.origen,
        destino=payload.destino
    )
    db.add(paquete)
    db.commit()
    db.refresh(paquete)

    return RegistrarPaqueteResponse(
        id_envio=envio.id_envio,
        id_paquete=paquete.id_paquete,
        codigo_rastreo=codigo
    )
# ─────────────────────────────────────────────
# GET /envios/{id_envio}
# ─────────────────────────────────────────────

@router.get(
    "/{id_envio}",
    response_model=EnvioResponse,
    summary="Ver un envío"
)
def obtener_envio(
    id_envio: int,
    db: Session = Depends(get_db)
):
    envio = db.query(Envio).filter(
        Envio.id_envio == id_envio
    ).first()

    if not envio:
        raise HTTPException(
            status_code=404,
            detail="Envío no encontrado"
        )

    return envio


# ─────────────────────────────────────────────
# POST /envios/
# ─────────────────────────────────────────────

@router.post(
    "/",
    response_model=EnvioResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un envío"
)
def crear_envio(
    payload: EnvioRequest,
    db: Session = Depends(get_db)
):
    envio = Envio(
        id_usuario=payload.id_usuario,
        id_tipenvio=payload.id_tipenvio,
        id_estadoenvio=payload.id_estadoenvio,
        id_rutas=payload.id_rutas,
        codigo_rastreo=generar_codigo_rastreo(),
        fecha_creacion=datetime.now(),
        nombre_destinatario=payload.nombre_destinatario,
        documento_destinatario=payload.documento_destinatario,
        estado_paquete=payload.estado_paquete
    )

    db.add(envio)
    db.commit()
    db.refresh(envio)

    return envio


# ─────────────────────────────────────────────
# PUT /envios/{id_envio}
# ─────────────────────────────────────────────

@router.put(
    "/{id_envio}",
    response_model=EnvioResponse,
    summary="Actualizar un envío"
)
def actualizar_envio(
    id_envio: int,
    payload: EnvioRequest,
    db: Session = Depends(get_db)
):
    envio = db.query(Envio).filter(
        Envio.id_envio == id_envio
    ).first()

    if not envio:
        raise HTTPException(
            status_code=404,
            detail="Envío no encontrado"
        )

    envio.id_usuario = payload.id_usuario
    envio.id_tipenvio = payload.id_tipenvio
    envio.id_estadoenvio = payload.id_estadoenvio
    envio.id_rutas = payload.id_rutas
    envio.nombre_destinatario = payload.nombre_destinatario
    envio.documento_destinatario = payload.documento_destinatario
    envio.estado_paquete = payload.estado_paquete

    db.commit()
    db.refresh(envio)

    return envio


# ─────────────────────────────────────────────
# DELETE /envios/{id_envio}
# ─────────────────────────────────────────────

@router.delete(
    "/{id_envio}",
    summary="Eliminar un envío"
)
def eliminar_envio(
    id_envio: int,
    db: Session = Depends(get_db)
):
    envio = db.query(Envio).filter(
        Envio.id_envio == id_envio
    ).first()

    if not envio:
        raise HTTPException(
            status_code=404,
            detail="Envío no encontrado"
        )

    db.delete(envio)
    db.commit()

    return {
        "mensaje": "Envío eliminado correctamente"
    }