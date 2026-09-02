import uuid
from fastapi import APIRouter, HTTPException, status, Depends
from schemas.schemas import PaqueteRequest, PaqueteResponse
from core.security import get_current_user, TokenData
import store

router = APIRouter(prefix="/paquetes", tags=["Paquetes"])


def _cod_paquete() -> str:
    return f"ONU-PKG-{uuid.uuid4().hex[:10].upper()}"


# ─────────────────────────────────────────────────────────────
#  POST /paquetes/registrar/{id_pedido}
# ─────────────────────────────────────────────────────────────
@router.post(
    "/registrar/{id_pedido}",
    response_model=PaqueteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar datos del paquete en un pedido"
)
def registrar_paquete(
    id_pedido: int,
    payload: PaqueteRequest,
    current_user: TokenData = Depends(get_current_user)
):
    pedido = store.pedidos.get(id_pedido)
    if not pedido or pedido["id_cliente"] != current_user.id_usuario:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    pid = store.next_id("paquete")
    paquete = {
        "id_paquete":    pid,
        "id_pedido":     id_pedido,
        "cod_rastreo":   _cod_paquete(),
        "tipo_producto": payload.tipo_producto,
        "peso":          payload.peso,
        "alto":          payload.alto,
        "largo":         payload.largo,
        "ancho":         payload.ancho,
        "es_fragil":     payload.es_fragil,
        "descripcion":   payload.descripcion,
    }
    store.paquetes[pid] = paquete

    return PaqueteResponse(**paquete)


# ─────────────────────────────────────────────────────────────
#  GET /paquetes/{id_pedido}
# ─────────────────────────────────────────────────────────────
@router.get(
    "/{id_pedido}",
    summary="Listar paquetes de un pedido"
)
def listar_paquetes(
    id_pedido: int,
    current_user: TokenData = Depends(get_current_user)
):
    pedido = store.pedidos.get(id_pedido)
    if not pedido or pedido["id_cliente"] != current_user.id_usuario:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    lista = [p for p in store.paquetes.values() if p["id_pedido"] == id_pedido]

    return {
        "id_pedido":       id_pedido,
        "total_paquetes":  len(lista),
        "paquetes":        lista,
    }
