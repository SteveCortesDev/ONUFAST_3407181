
import { useEffect, useState } from "react";
import api from "../../api";
import "./CSS/PerfilConductor.css";

export default function PerfilConductor() {
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const respuesta = await api.get("/usuarios/perfil");
        setPerfil(respuesta.data);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        setError("No fue posible cargar tu información.");
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, []);

  if (cargando) {
    return (
      <div className="perfil-conductor">
        <p className="perfil-mensaje">Cargando información del perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="perfil-conductor">
        <p className="perfil-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="perfil-conductor">

      <div className="perfil-titulo">
        <h2>Mi perfil</h2>
        <p>Consulta tu información personal y datos de usuario.</p>
      </div>

      <div className="perfil-card">

        <div className="perfil-portada">
          <div className="perfil-avatar">
            <img
              src="/foto-perfil.avif"
              alt="Foto de perfil del conductor"
            />
          </div>

          <div className="perfil-nombre">
            <h2>{perfil.nombre}</h2>
            <span>Conductor ONUFAST</span>
          </div>
        </div>

        <div className="perfil-informacion">
          <h3>Información personal</h3>

          <div className="perfil-grid">

            <div className="perfil-dato">
              <span>Nombre completo</span>
              <strong>{perfil.nombre || "No disponible"}</strong>
            </div>

            <div className="perfil-dato">
              <span>Identificación de usuario</span>
              <strong>{perfil.id_usuario ?? "No disponible"}</strong>
            </div>

            <div className="perfil-dato">
              <span>Correo electrónico</span>
              <strong>{perfil.correo || "No disponible"}</strong>
            </div>

            <div className="perfil-dato">
              <span>Teléfono</span>
              <strong>{perfil.telefono || "No disponible"}</strong>
            </div>

            <div className="perfil-dato">
              <span>Tipo de documento</span>
              <strong>{perfil.tipo_documento || "No disponible"}</strong>
            </div>

            <div className="perfil-dato">
              <span>Número de documento</span>
              <strong>{perfil.num_documento || "No disponible"}</strong>
            </div>

            <div className="perfil-dato">
  <span>Jornada</span>
  <strong>{perfil.jornada || "No definida"}</strong>
</div>

<div className="perfil-dato">
  <span>Rol</span>
  <strong>
    {perfil.roles?.length > 0
      ? perfil.roles.join(", ")
      : "Sin rol asignado"}
  </strong>
</div>

          </div>
        </div>

        <div className="perfil-nota">
          <span>ℹ</span>
          <p>
            Esta información corresponde a los datos registrados
            en ONUFAST. Si encuentras algún dato incorrecto,
            comunícalo al administrador.
          </p>
        </div>

      </div>
    </div>
  );
}
