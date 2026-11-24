
from sqlalchemy import Column, Integer, String, Numeric
from core.database import Base


class Vehiculo(Base):
    __tablename__ = "vehiculo"

    id_vehiculo = Column(Integer, primary_key=True, index=True)
    placa = Column(String(10), nullable=False, unique=True)
    tipo_vehiculo = Column(String(30), nullable=False)
    marca = Column(String(50), nullable=False)
    modelo = Column(String(50), nullable=False)
    capacidad_kg = Column(Numeric(10, 2), nullable=False)
    estado = Column(String(20), nullable=False, default="Disponible")
