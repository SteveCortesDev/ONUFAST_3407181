from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from core.security import get_current_user, TokenData
from core.database import get_db

from models.usuario import Usuario
from models.documento import Documento
from models.usuario_roles import UsuarioRol # <-- Asegúrate de tener este import

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.get("/perfil")
def obtener_perfil(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    usuario = (
        db.query(Usuario)
        .filter(Usuario.id_usuario == current_user.id_usuario)
        .first()
    )

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    documento = (
        db.query(Documento)
        .filter(Documento.id_usuario == usuario.id_usuario)
        .first()
    )

    # --- ESTO ES LO NUEVO ---
    rol_asignado = (
        db.query(UsuarioRol)
        .filter(UsuarioRol.id_usuario == usuario.id_usuario)
        .first()
    )
    
    id_rol = rol_asignado.id_rol if rol_asignado else 2
    # ------------------------

    return {
        "id_usuario": usuario.id_usuario,
        "nombre": f"{usuario.nombre} {usuario.apellido}",
        "correo": usuario.correo,
        "telefono": usuario.telefono,
        "tipo_documento": documento.tipo_documento if documento else None,
        "num_documento": documento.num_documento if documento else None,
        "id_rol": id_rol # <-- ESTO ES LO QUE FALTABA ENVIAR
    }