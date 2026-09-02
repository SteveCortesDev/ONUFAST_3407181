from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, paquetes, envios

app = FastAPI(
    title="ONUFAST API",
    description="""
## Sistema de Gestión de Paquetes y Rutas de Envío
> ⚠️ Modo memoria — los datos se reinician al apagar el servidor.

### Flujo de uso:
1. `POST /auth/registro` — Crear cuenta
2. `POST /auth/login` — Iniciar sesión → copia el `access_token`
3. `GET /envios/tipos` — Ver tipos de envío disponibles
4. `POST /envios/pedido/iniciar` — Crear pedido (Express o Normal)
5. `POST /paquetes/registrar/{id_pedido}` — Registrar datos del paquete
6. `GET /envios/mis-pedidos` — Consultar mis pedidos y paquetes
    """,
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(paquetes.router)
app.include_router(envios.router)


@app.get("/", tags=["Root"])
def root():
    return {
        "sistema": "ONUFAST",
        "version": "1.0.0",
        "modo":    "memoria (sin base de datos)",
        "docs":    "/docs",
    }
