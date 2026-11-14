
import "./CSS/PerfilConductor.css";

export default function PerfilConductor() {
  const nombre =
    localStorage.getItem("nombre_usuario") ||
    localStorage.getItem("nombre") ||
    "Conductor";

  const idUsuario =
    localStorage.getItem("id_usuario") || "No disponible";

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
              src="/public/foto-perfil.avif"
              alt="Foto de perfil del conductor"
            />
          </div>

          <div className="perfil-nombre">
            <h2>{nombre}</h2>
            <span>Conductor ONUFAST</span>
          </div>

        </div>

        <div className="perfil-informacion">
          <h3>Información personal</h3>

          <div className="perfil-grid">

            <div className="perfil-dato">
              <span>Nombre completo</span>
              <strong>{nombre}</strong>
            </div>

            <div className="perfil-dato">
              <span>Identificación de usuario</span>
              <strong>{idUsuario}</strong>
            </div>

            <div className="perfil-dato">
              <span>Correo electrónico</span>
              <strong>No disponible</strong>
            </div>

            <div className="perfil-dato">
              <span>Teléfono</span>
              <strong>No disponible</strong>
            </div>

            <div className="perfil-dato">
              <span>Jornada</span>
              <strong>No disponible</strong>
            </div>

            <div className="perfil-dato">
              <span>Rol</span>
              <strong>Conductor</strong>
            </div>

          </div>
        </div>

        <div className="perfil-nota">
          <span>ℹ</span>
          <p>
            Tu información personal se mostrará aquí.
            Próximamente podrás consultar tus datos actualizados
            desde el sistema.
          </p>
        </div>

      </div>
    </div>
  );
}
