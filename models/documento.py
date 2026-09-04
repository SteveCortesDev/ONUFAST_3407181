from sqlalchemy import Column, Integer, String, ForeignKey
from core.database import Base


class Documento(Base):
    __tablename__ = "documento"

    id_documento = Column(Integer, primary_key=True, index=True)

    tipo_documento = Column(String(30), nullable=False)
    num_documento = Column(String(50), unique=True, nullable=False)

    id_usuario = Column(
        Integer,
        ForeignKey("usuario.id_usuario"),
        nullable=False
    )