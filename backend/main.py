from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from core.database import engine, SessionLocal, Base
from core.security import hash_password
import models
from models.rol import Rol
from models.usuario import Usuario
from models.usuario_roles import UsuarioRol
from models.tipo_envio import TipoEnvio
from models.estado_envio import EstadoEnvio
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


def seed_initial_data():
    roles_base = [
        {"id_rol": 1, "nombre_rol": "Administrador"},
        {"id_rol": 2, "nombre_rol": "Cliente"},
        {"id_rol": 3, "nombre_rol": "Conductor"},
        {"id_rol": 4, "nombre_rol": "Conductor Auxiliar"},
        {"id_rol": 5, "nombre_rol": "Encargado de Bodega"},
        {"id_rol": 6, "nombre_rol": "Despachador"},
        {"id_rol": 7, "nombre_rol": "Atención al Cliente"},
    ]
    tipos_base = [
        {"descripcion": "Express"},
        {"descripcion": "Normal"},
    ]
    estados_base = [
        {"estado": "Cancelado"},
        {"estado": "Confirmado"},
        {"estado": "En bodega"},
        {"estado": "En camino"},
        {"estado": "Entregado"},
        {"estado": "Devuelto"},
    ]
    admin_correo = "admin@onufast.com"
    admin_clave = "Admin123*"

    db = SessionLocal()
    try:
        for r in roles_base:
            if not db.query(Rol).filter(Rol.id_rol == r["id_rol"]).first():
                db.add(Rol(id_rol=r["id_rol"], nombre_rol=r["nombre_rol"]))

        if db.query(TipoEnvio).count() == 0:
            for t in tipos_base:
                db.add(TipoEnvio(descripcion=t["descripcion"]))

        if db.query(EstadoEnvio).count() == 0:
            for est in estados_base:
                db.add(EstadoEnvio(estado=est["estado"]))

        admin_user = db.query(Usuario).filter(Usuario.correo == admin_correo).first()
        if not admin_user:
            admin_user = Usuario(
                nombre="Admin",
                apellido="ONUFAST",
                clave=hash_password(admin_clave),
                correo=admin_correo,
                telefono="3000000000",
                jornada="Mañana",
                activo=True,
            )
            db.add(admin_user)
            db.flush()

        rol_admin = db.query(Rol).filter(Rol.id_rol == 1).first()
        if rol_admin:
            tiene_rol = (
                db.query(UsuarioRol)
                .filter(
                    UsuarioRol.id_usuario == admin_user.id_usuario,
                    UsuarioRol.id_rol == rol_admin.id_rol,
                )
                .first()
            )
            if not tiene_rol:
                db.add(
                    UsuarioRol(
                        id_usuario=admin_user.id_usuario,
                        id_rol=rol_admin.id_rol,
                    )
                )

        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Advertencia al sembrar datos iniciales: {e}")
    finally:
        db.close()


seed_initial_data()

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