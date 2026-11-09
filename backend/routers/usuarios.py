from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from core.security import get_current_user, TokenData
from core.database import get_db

from models.usuario import Usuario
from models.documento import Documento
from models.usuario_roles import UsuarioRol
from models.rol import Rol

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

class ActualizarRolRequest(BaseModel):
    id_rol: int

@router.get("/perfil")
def obtener_perfil(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == current_user.id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    documento = db.query(Documento).filter(Documento.id_usuario == usuario.id_usuario).first()
    rol_asignado = db.query(UsuarioRol).filter(UsuarioRol.id_usuario == usuario.id_usuario).first()
    id_rol = rol_asignado.id_rol if rol_asignado else 2

    return {
        "id_usuario": usuario.id_usuario,
        "nombre": f"{usuario.nombre} {usuario.apellido}",
        "correo": usuario.correo,
        "telefono": usuario.telefono,
        "tipo_documento": documento.tipo_documento if documento else None,
        "num_documento": documento.num_documento if documento else None,
        "id_rol": id_rol
    }

@router.get("/")
def listar_todos_los_usuarios(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Cruzamos Usuario, UsuarioRol, Rol y Documento
    resultados = db.query(Usuario, UsuarioRol, Rol, Documento).outerjoin(
        UsuarioRol, Usuario.id_usuario == UsuarioRol.id_usuario
    ).outerjoin(
        Rol, UsuarioRol.id_rol == Rol.id_rol
    ).outerjoin(
        Documento, Usuario.id_usuario == Documento.id_usuario
    ).all()

    usuarios_lista = []
    for usuario, usuario_rol, rol, documento in resultados:
        usuarios_lista.append({
            "id_usuario": usuario.id_usuario,
            "nombre": f"{usuario.nombre} {usuario.apellido}",
            "correo": usuario.correo,
            "telefono": usuario.telefono,
            "num_documento": documento.num_documento if documento else "N/A", # <-- Agregamos el documento
            "id_rol": usuario_rol.id_rol if usuario_rol else 2,
            "nombre_rol": rol.nombre_rol if rol else "Cliente"
        })

    return usuarios_lista

@router.put("/{id_usuario}/rol")
def actualizar_rol_usuario(
    id_usuario: int,
    payload: ActualizarRolRequest,
    db: Session = Depends(get_db)
):
    # PROTECCIÓN: Evitar que el admin se cambie su propio rol (ID 1 es admin)
    if payload.id_rol != 1 and id_usuario in [6, 7]: # Ajusta estos IDs si es necesario
         raise HTTPException(status_code=400, detail="No puedes cambiar el rol de un administrador principal")

    usuario_rol = db.query(UsuarioRol).filter(UsuarioRol.id_usuario == id_usuario).first()

    if usuario_rol:
        usuario_rol.id_rol = payload.id_rol
    else:
        nuevo_rol = UsuarioRol(id_usuario=id_usuario, id_rol=payload.id_rol)
        db.add(nuevo_rol)

    db.commit()
    return {"mensaje": "Rol actualizado correctamente"}