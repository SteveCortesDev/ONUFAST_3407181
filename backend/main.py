from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from core.database import engine, SessionLocal, Base
import models
from models.rol import Rol
from routers import (
    auth,
    usuarios,
    envios,
    paquetes,
    rutas,
    tipo_envio,
    estado_envio,
    factura,
    vehiculos,
    bodega,
    rastreo_gps,
)

try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Advertencia al crear tablas automáticamente: {e}")


def seed_roles():
    roles_base = [
        {"id_rol": 1, "nombre_rol": "Administrador"},
        {"id_rol": 2, "nombre_rol": "Cliente"},
        {"id_rol": 3, "nombre_rol": "Conductor"},
        {"id_rol": 5, "nombre_rol": "Bodega"},
    ]
    db = SessionLocal()
    try:
        for r in roles_base:
            existente = db.query(Rol).filter(Rol.id_rol == r["id_rol"]).first()
            if not existente:
                db.add(Rol(id_rol=r["id_rol"], nombre_rol=r["nombre_rol"]))
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Advertencia al crear roles iniciales: {e}")
    finally:
        db.close()


seed_roles()

app = FastAPI(
    title="ONUFAST API",
    description="API del sistema logístico ONUFAST",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://onufast-3407181-1.onrender.com",
    ],
    allow_origin_regex=r"https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(envios.router)
app.include_router(paquetes.router)
app.include_router(rutas.router)
app.include_router(tipo_envio.router)
app.include_router(estado_envio.router)
app.include_router(factura.router)
app.include_router(vehiculos.router)
app.include_router(bodega.router)
app.include_router(rastreo_gps.router)


@app.get("/")
def root():
    return {"mensaje": "API de ONUFAST funcionando correctamente"}


@app.get("/test-db")
def test_db():
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return {"conexion": "exitosa"}
    except Exception as e:
        return {"conexion": "error", "detalle": str(e)}
    finally:
        db.close()