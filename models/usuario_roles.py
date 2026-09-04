from sqlalchemy import Column, Integer, ForeignKey
from core.database import Base


class UsuarioRol(Base):
    __tablename__ = "usuario_roles"

    id_usuario_rol = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuario.id_usuario"), nullable=False)
    id_rol = Column(Integer, ForeignKey("rol.id_rol"), nullable=False)