from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from core.database import Base


class Envio(Base):
    __tablename__ = "envio"

    id_envio = Column(Integer, primary_key=True, index=True)

    id_usuario = Column(
        Integer,
        ForeignKey("usuario.id_usuario"),
        nullable=False
    )

    id_tipenvio = Column(
        Integer,
        ForeignKey("tipo_envio.id_tipenvio"),
        nullable=False
    )

    id_estadoenvio = Column(
        Integer,
        ForeignKey("estado_envio.id_estadoenvio"),
        nullable=False
    )

    id_rutas = Column(
        Integer,
        ForeignKey("rutas.id_rutas"),
        nullable=False
    )

    codigo_rastreo = Column(String(100), nullable=False)
    fecha_creacion = Column(DateTime, nullable=False)

    nombre_destinatario = Column(
        String(100),
        nullable=False
    )

    documento_destinatario = Column(
        String(50),
        nullable=False
    )

    estado_paquete = Column(
        String(30),
        nullable=False
    )