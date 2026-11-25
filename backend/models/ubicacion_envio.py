from datetime import datetime
from sqlalchemy import Column, Integer, Float, Boolean, DateTime, ForeignKey
from core.database import Base


class UbicacionEnvio(Base):
    __tablename__ = "ubicacion_envio"

    id_ubicacion = Column(Integer, primary_key=True, index=True)
    id_envio = Column(
        Integer,
        ForeignKey("envio.id_envio", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    latitud = Column(Float, nullable=False)
    longitud = Column(Float, nullable=False)
    precision_m = Column(Float, nullable=True)
    velocidad = Column(Float, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    actualizado_en = Column(DateTime, nullable=False, default=datetime.now)