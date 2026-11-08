from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from core.database import Base


class Factura(Base):
    __tablename__ = "factura"

    id_factura = Column(
        Integer,
        primary_key=True,
        index=True
    )

    id_envio = Column(
        Integer,
        ForeignKey("envio.id_envio"),
        nullable=False
    )

    num_factura = Column(
        String(50),
        nullable=False
    )

    fecha_emision = Column(
        DateTime,
        nullable=True
    )

    subtotal = Column(
        Numeric(12, 2),
        nullable=False
    )

    iva = Column(
        Numeric(12, 2),
        nullable=False
    )

    total_pago = Column(
        Numeric(12, 2),
        nullable=False
    )

    metodo_pago = Column(
        String(50),
        nullable=False
    )