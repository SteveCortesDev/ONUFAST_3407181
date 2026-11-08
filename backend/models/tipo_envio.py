from sqlalchemy import Column, Integer, String
from core.database import Base


class TipoEnvio(Base):
    __tablename__ = "tipo_envio"

    id_tipenvio = Column(Integer, primary_key=True, index=True)
    descripcion = Column(String(100), nullable=False)