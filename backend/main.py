from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, usuarios, paquetes, envios, rutas, rol, usuario_roles, documento, tipo_envio, estado_envio, factura
from core.database import engine
from models.usuario import Usuario
import webbrowser
import threading


app = FastAPI(
    title="ONUFAST API",
    description="""
## Sistema de Gestión de Paquetes y Rutas de Envío

### Flujo de uso:
1. `POST /auth/registro` — Crear cuenta
2. `POST /auth/login` — Iniciar sesión
3. `GET /envios/tipos` — Ver tipos de envío disponibles
4. `POST /envios/pedido/iniciar` — Crear envío
5. `POST /paquetes/registrar` — Registrar paquete
6. `GET /paquetes/envio/{id_envio}` — Consultar paquetes de un envío
7. `GET /envios/mis-pedidos` — Consultar envíos del usuario
    """,
    version="1.0.0",
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ─────────────────────────────────────────────
# ROUTERS
# ─────────────────────────────────────────────

app.include_router(rol.router)

app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(paquetes.router)
app.include_router(envios.router)
app.include_router(rutas.router)
app.include_router(usuario_roles.router)
app.include_router(documento.router)
app.include_router(tipo_envio.router)
app.include_router(estado_envio.router)
app.include_router(factura.router)

# ─────────────────────────────────────────────
# CORS
# ─────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# ROOT
# ─────────────────────────────────────────────

@app.get("/", tags=["Root"])
def root():
    return {
        "sistema": "ONUFAST",
        "version": "1.0.0",
        "modo": "PostgreSQL",
        "docs": "/docs",
    }


# ─────────────────────────────────────────────
# PRUEBA DE BASE DE DATOS
# ─────────────────────────────────────────────

@app.get("/test-db", tags=["Root"])
def test_db():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "conexion": "exitosa ✅"
        }

    except Exception as e:
        return {
            "conexion": "fallida ",
            "error": str(e)
        }


# ─────────────────────────────────────────────
# ABRIR SWAGGER AUTOMÁTICAMENTE
# ─────────────────────────────────────────────

@app.on_event("startup")
def abrir_navegador():
    threading.Timer(
        1.5,
        lambda: webbrowser.open("http://127.0.0.1:8000/docs")
    ).start()