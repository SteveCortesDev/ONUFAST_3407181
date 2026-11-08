from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from core.database import Base


class Paquete(Base):
    __tablename__ = "paquete"

    id_paquete = Column(Integer, primary_key=True, index=True)

    id_envio = Column(
        Integer,
        ForeignKey("envio.id_envio"),
        nullable=False
    )

    num_guia = Column(
        String(50),
        unique=True,
        nullable=True
    )

    cod_rastreo = Column(
        String(100),
        nullable=False
    )

    peso = Column(
        Numeric(8, 2),
        nullable=False
    )

    alto = Column(
        Numeric(8, 2),
        nullable=False
    )

    largo = Column(
        Numeric(8, 2),
        nullable=False
    )

    ancho = Column(
        Numeric(8, 2),
        nullable=False
    )

    descripcion = Column(
        String(200),
        nullable=True
    )

    origen = Column(
        String(100),
        nullable=True
    )

    destino = Column(
        String(100),
        nullable=True
    )