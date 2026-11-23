export default function PerfilBodega() {
  const nombre =
    localStorage.getItem("nombre_usuario") ||
    localStorage.getItem("nombre") ||
    "Encargado de bodega";

  const idUsuario =
    localStorage.getItem("id_usuario") || "No disponible";

  return (
    <div className="perfil-bodega">

      <div className="perfil-titulo">
        <h2>Mi perfil</h2>
        <p>Consulta tu información personal y datos de la bodega.</p>
      </div>

      <div className="perfil-card">

        <div className="perfil-portada">
          <div className="perfil-avatar">B</div>

          <div className="perfil-nombre">
            <h2>{nombre}</h2>
            <span>Encargado de bodega · ONUFAST</span>
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
              <span>Rol</span>
              <strong>Encargado de bodega</strong>
            </div>

            <div className="perfil-dato">
              <span>Bodega asignada</span>
              <strong>Bodega principal · Bogotá</strong>
            </div>
          </div>
        </div>

        <div className="perfil-nota">
          <span>ℹ</span>
          <p>
            Tu información personal se mostrará aquí cuando el sistema
            entregue los datos completos del usuario.
          </p>
        </div>

      </div>
    </div>
  );
}
