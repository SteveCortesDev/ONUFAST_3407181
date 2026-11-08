from sqlalchemy import Column, Integer, String
from core.database import Base


class Usuario(Base):
    __tablename__ = "usuario"

    id_usuario = Column(Integer, primary_key=True, index=True)

    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)

    clave = Column(String(100), nullable=False)
    correo = Column(String(100), nullable=False)
    telefono = Column(String(20), nullable=False)
    jornada = Column(String(20), nullable=False)