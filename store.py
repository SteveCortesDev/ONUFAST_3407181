# ─────────────────────────────────────────────────────────────
#  Almacenamiento en memoria — reemplaza la base de datos
#  Todos los datos se pierden al reiniciar el servidor
# ─────────────────────────────────────────────────────────────

from typing import Dict, List

# Contadores auto-increment
_counters = {
    "usuario": 1,
    "pedido": 1,
    "paquete": 1,
}

def next_id(entidad: str) -> int:
    val = _counters[entidad]
    _counters[entidad] += 1
    return val


# Tablas en memoria
usuarios: Dict[int, dict] = {}
# { id_usuario: { id_usuario, nombre, clave, correo, telefono, tipo_documento,
#                 num_documento, direccion } }

pedidos: Dict[int, dict] = {}
# { id_pedido: { id_pedido, id_cliente, id_tipenvio, codigo_rastreo,
#                fecha_creacion, cantidad, estado } }

paquetes: Dict[int, dict] = {}
# { id_paquete: { id_paquete, id_pedido, cod_rastreo, tipo_producto,
#                 peso, alto, largo, ancho, es_fragil, descripcion } }

# Tipos de envío precargados (equivale al seed_data.sql)
tipos_envio: Dict[int, dict] = {
    1: {"id_tipenvio": 1, "descripcion": "Envío Express — entrega en 24 horas",  "espress": True},
    2: {"id_tipenvio": 2, "descripcion": "Envío Normal — entrega en 3 a 5 días hábiles", "espress": False},
}
