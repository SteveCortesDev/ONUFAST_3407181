from sqlalchemy import Column, Integer, String
from core.database import Base


class EstadoEnvio(Base):
    __tablename__ = "estado_envio"

    id_estadoenvio = Column(Integer, primary_key=True, index=True)
    estado = Column(String(50), nullable=False)