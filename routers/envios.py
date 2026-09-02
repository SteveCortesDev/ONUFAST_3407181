import uuid
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from schemas.schemas import PedidoRequest, PedidoResponse, TipoEnvioResponse
from core.security import get_current_user, TokenData
import store

router = APIRouter(prefix="/envios", tags=["Envíos y Pedidos"])


def _cod_pedido() -> str:
    return f"ONU-ORD-{uuid.uuid4().hex[:8].upper()}"


# ─────────────────────────────────────────────────────────────
#  GET /envios/tipos
# ─────────────────────────────────────────────────────────────
@router.get(
    "/tipos",
    response_model=List[TipoEnvioResponse],
    summary="Ver tipos de envío disponibles"
)
def listar_tipos():
    return list(store.tipos_envio.values())


# ─────────────────────────────────────────────────────────────
#  POST /envios/pedido/iniciar
# ─────────────────────────────────────────────────────────────
@router.post(
    "/pedido/iniciar",
    response_model=PedidoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un nuevo pedido"
)
def iniciar_pedido(
    payload: PedidoRequest,
    current_user: TokenData = Depends(get_current_user)
):
    tipo = store.tipos_envio.get(payload.id_tipenvio)
    if not tipo:
        raise HTTPException(status_code=404, detail="Tipo de envío no encontrado")

    pid = store.next_id("pedido")
    pedido = {
        "id_pedido":      pid,
        "id_cliente":     current_user.id_usuario,
        "id_tipenvio":    payload.id_tipenvio,
        "codigo_rastreo": _cod_pedido(),
        "cantidad":       payload.cantidad,
        "estado":         "PENDIENTE",
    }
    store.pedidos[pid] = pedido

    return PedidoResponse(
        id_pedido=pid,
        codigo_rastreo=pedido["codigo_rastreo"],
        cantidad=pedido["cantidad"],
        tipo_envio=tipo["descripcion"],
        es_express=tipo["espress"],
        estado="PENDIENTE",
    )


# ─────────────────────────────────────────────────────────────
#  GET /envios/mis-pedidos
# ─────────────────────────────────────────────────────────────
@router.get(
    "/mis-pedidos",
    summary="Ver todos mis pedidos"
)
def mis_pedidos(current_user: TokenData = Depends(get_current_user)):
    lista = [p for p in store.pedidos.values() if p["id_cliente"] == current_user.id_usuario]

    resultado = []
    for p in lista:
        tipo = store.tipos_envio.get(p["id_tipenvio"], {})
        paquetes = [pk for pk in store.paquetes.values() if pk["id_pedido"] == p["id_pedido"]]
        resultado.append({
            **p,
            "tipo_envio":      tipo.get("descripcion", ""),
            "es_express":      tipo.get("espress", False),
            "paquetes_registrados": len(paquetes),
        })

    return {
        "usuario":       current_user.nombre,
        "total_pedidos": len(resultado),
        "pedidos":       resultado,
    }
