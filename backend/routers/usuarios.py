
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user

from models.usuario import Usuario
from models.documento import Documento
from models.usuario_roles import UsuarioRol
from models.rol import Rol
from models.rutas import Ruta
from models.vehiculo import Vehiculo


router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


# ============================================================
# PERFIL DEL USUARIO AUTENTICADO
# ============================================================

@router.get("/perfil")
def obtener_perfil(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    usuario = db.query(Usuario).filter(
        Usuario.id_usuario == current_user.id_usuario
    ).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    resultado_rol = (
        db.query(UsuarioRol, Rol)
        .join(
            Rol,
            UsuarioRol.id_rol == Rol.id_rol
        )
        .filter(
            UsuarioRol.id_usuario == usuario.id_usuario
        )
        .order_by(
            UsuarioRol.id_usuario_rol.asc()
        )
        .first()
    )

    if not resultado_rol:
        raise HTTPException(
            status_code=403,
            detail="El usuario no tiene un rol asignado"
        )

    usuario_rol, rol = resultado_rol

    return {
        "id_usuario": usuario.id_usuario,
        "nombre": f"{usuario.nombre} {usuario.apellido}",
        "correo": usuario.correo,
        "telefono": usuario.telefono,
        "jornada": usuario.jornada,
        "activo": usuario.activo,
        "id_rol": rol.id_rol,
        "nombre_rol": rol.nombre_rol
    }


# ============================================================
# LISTAR CONDUCTORES CON SUS RUTAS Y VEHÍCULOS
# ============================================================

@router.get("/conductores")
def obtener_conductores(
    db: Session = Depends(get_db)
):

    conductores = (
        db.query(Usuario)
        .join(
            UsuarioRol,
            Usuario.id_usuario == UsuarioRol.id_usuario
        )
        .filter(
            UsuarioRol.id_rol.in_([3, 4])
        )
        .distinct()
        .all()
    )

    resultado = []

    for conductor in conductores:

        rutas = (
            db.query(Ruta)
            .filter(
                Ruta.id_conductor == conductor.id_usuario
            )
            .order_by(
                Ruta.fecha_creacion.desc()
            )
            .all()
        )

        rutas_lista = []

        for ruta in rutas:

            vehiculo = None

            if ruta.id_vehiculo is not None:
                vehiculo = (
                    db.query(Vehiculo)
                    .filter(
                        Vehiculo.id_vehiculo == ruta.id_vehiculo
                    )
                    .first()
                )

            rutas_lista.append({
                "id_rutas": ruta.id_rutas,
                "codigo_ruta": ruta.codigo_ruta,
                "ciudad_origen": ruta.ciudad_origen,
                "ciudad_destino": ruta.ciudad_destino,
                "tiempo_estimado": ruta.tiempo_estimado,

                "tipo_vehiculo": (
                    vehiculo.tipo_vehiculo
                    if vehiculo
                    else ruta.tipo_vehiculo
                ),

                "id_vehiculo": (
                    vehiculo.id_vehiculo
                    if vehiculo
                    else None
                ),

                "placa": (
                    vehiculo.placa
                    if vehiculo
                    else "Sin vehículo asignado"
                ),

                "estado_vehiculo": (
                    vehiculo.estado
                    if vehiculo
                    else None
                )
            })

        ruta_principal = next(
            (
                ruta for ruta in rutas
                if ruta.id_vehiculo is not None
            ),
            rutas[0] if rutas else None
        )

        ruta_principal_detalle = next(
            (
                item for item in rutas_lista
                if ruta_principal
                and item["id_rutas"] == ruta_principal.id_rutas
            ),
            None
        )

        documento = (
            db.query(Documento)
            .filter(
                Documento.id_usuario == conductor.id_usuario
            )
            .first()
        )

        resultado_rol = (
            db.query(UsuarioRol, Rol)
            .join(
                Rol,
                UsuarioRol.id_rol == Rol.id_rol
            )
            .filter(
                UsuarioRol.id_usuario == conductor.id_usuario
            )
            .order_by(
                UsuarioRol.id_usuario_rol.asc()
            )
            .first()
        )

        rol = resultado_rol[1] if resultado_rol else None

        resultado.append({

            "id_usuario": conductor.id_usuario,

            "nombre": (
                f"{conductor.nombre} {conductor.apellido}"
            ),

            "correo": conductor.correo,
            "telefono": conductor.telefono,

            "num_documento": (
                documento.num_documento
                if documento
                else None
            ),

            "id_rol": (
                rol.id_rol
                if rol
                else None
            ),

            "nombre_rol": (
                rol.nombre_rol
                if rol
                else None
            ),

            "activo": conductor.activo,

            "id_rutas": (
                ruta_principal.id_rutas
                if ruta_principal
                else None
            ),

            "codigo_ruta": (
                ruta_principal.codigo_ruta
                if ruta_principal
                else None
            ),

            "id_vehiculo": (
                ruta_principal_detalle["id_vehiculo"]
                if ruta_principal_detalle
                else None
            ),

            "placa": (
                ruta_principal_detalle["placa"]
                if ruta_principal_detalle
                else "Sin vehículo asignado"
            ),

            "tipo_vehiculo": (
                ruta_principal_detalle["tipo_vehiculo"]
                if ruta_principal_detalle
                else None
            ),

            "estado_vehiculo": (
                ruta_principal_detalle["estado_vehiculo"]
                if ruta_principal_detalle
                else None
            ),

            "rutas": rutas_lista
        })

    return resultado


# ============================================================
# LISTAR TODOS LOS USUARIOS CON DOCUMENTO Y ROL
# ============================================================

@router.get("/")
def listar_usuarios(
    db: Session = Depends(get_db)
):

    usuarios = db.query(Usuario).all()

    resultado = []

    for usuario in usuarios:

        # Consultar documento
        documento = (
            db.query(Documento)
            .filter(
                Documento.id_usuario == usuario.id_usuario
            )
            .first()
        )

        # Consultar rol
        resultado_rol = (
            db.query(UsuarioRol, Rol)
            .join(
                Rol,
                UsuarioRol.id_rol == Rol.id_rol
            )
            .filter(
                UsuarioRol.id_usuario == usuario.id_usuario
            )
            .order_by(
                UsuarioRol.id_usuario_rol.asc()
            )
            .first()
        )

        rol = resultado_rol[1] if resultado_rol else None

        resultado.append({

            "id_usuario": usuario.id_usuario,
            "nombre": usuario.nombre,
            "apellido": usuario.apellido,
            "correo": usuario.correo,
            "telefono": usuario.telefono,
            "jornada": usuario.jornada,
            "activo": usuario.activo,

            "num_documento": (
                documento.num_documento
                if documento
                else None
            ),

            "tipo_documento": (
                documento.tipo_documento
                if documento
                else None
            ),

            "id_rol": (
                rol.id_rol
                if rol
                else None
            ),

            "nombre_rol": (
                rol.nombre_rol
                if rol
                else "Sin rol asignado"
            )
        })

    return resultado


# ============================================================
# ACTUALIZAR ROL DE USUARIO
# ============================================================

@router.put("/{id_usuario}/rol")
def actualizar_rol_usuario(
    id_usuario: int,
    id_rol: int,
    db: Session = Depends(get_db)
):

    usuario = db.query(Usuario).filter(
        Usuario.id_usuario == id_usuario
    ).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    rol = db.query(Rol).filter(
        Rol.id_rol == id_rol
    ).first()

    if not rol:
        raise HTTPException(
            status_code=404,
            detail="Rol no encontrado"
        )

    usuario_rol = db.query(UsuarioRol).filter(
        UsuarioRol.id_usuario == id_usuario
    ).order_by(
        UsuarioRol.id_usuario_rol.asc()
    ).first()

    if usuario_rol:
        usuario_rol.id_rol = id_rol
    else:
        nuevo_usuario_rol = UsuarioRol(
            id_usuario=id_usuario,
            id_rol=id_rol
        )

        db.add(nuevo_usuario_rol)

    db.commit()

    return {
        "mensaje": "Rol actualizado correctamente",
        "id_usuario": id_usuario,
        "id_rol": id_rol,
        "nombre_rol": rol.nombre_rol
    }
    

# ============================================================
# ACTIVAR O DESACTIVAR USUARIO
# ============================================================

@router.put("/{id_usuario}/estado")
def cambiar_estado_usuario(
    id_usuario: int,
    activo: bool,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Verificar que quien realiza la acción sea administrador
    administrador = db.query(UsuarioRol).filter(
        UsuarioRol.id_usuario == current_user.id_usuario,
        UsuarioRol.id_rol == 1
    ).first()

    if not administrador:
        raise HTTPException(
            status_code=403,
            detail="No tienes permisos para modificar usuarios"
        )

    # Buscar el usuario que se desea modificar
    usuario = db.query(Usuario).filter(
        Usuario.id_usuario == id_usuario
    ).first()

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    # Evitar que el administrador desactive su propia cuenta
    if id_usuario == current_user.id_usuario and activo is False:
        raise HTTPException(
            status_code=400,
            detail="No puedes desactivar tu propia cuenta"
        )

    # Actualizar estado
    usuario.activo = activo

    db.commit()
    db.refresh(usuario)

    return {
        "mensaje": "Estado del usuario actualizado correctamente",
        "id_usuario": usuario.id_usuario,
        "activo": usuario.activo
    }

