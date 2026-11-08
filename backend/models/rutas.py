from sqlalchemy import Column, Integer, String, Numeric, DateTime
from core.database import Base


class Ruta(Base):
    __tablename__ = "rutas"

    id_rutas = Column(Integer, primary_key=True, index=True)
    fecha_creacion = Column(DateTime, nullable=False)
    tiempo_estimado = Column(String(50), nullable=False)
    distancia_ruta = Column(Numeric(10, 2), nullable=False)
    ciudad_origen = Column(String(100), nullable=False)
    ciudad_destino = Column(String(100), nullable=False)
    cantidad_paquetes = Column(Integer, nullable=False)
    codigo_ruta = Column(String(100), unique=True, nullable=False)
    tipo_vehiculo = Column(String(30), nullable=False)
    nombre_conductor = Column(String(50), nullable=False)