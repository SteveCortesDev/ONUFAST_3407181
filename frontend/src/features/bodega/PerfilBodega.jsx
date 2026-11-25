export default function PerfilBodega({ perfil }) {
  const nombre = perfil?.nombre_completo || "Encargado de bodega";

  const documento = perfil?.documento
    ? `${perfil.documento.tipo_documento} ${perfil.documento.num_documento}`
    : "No registrado";

  const roles =
    perfil?.roles && perfil.roles.length > 0
      ? perfil.roles.join(", ")
      : "Sin rol asignado";

  return (
    <div className="perfil-bodega">

      <div className="perfil-titulo">
        <h2>Mi perfil</h2>
        <p>Información real de tu cuenta en la base de datos.</p>
      </div>

      <div className="perfil-card">

        <div className="perfil-portada">
          <div className="perfil-avatar">B</div>

          <div className="perfil-nombre">
            <h2>{nombre}</h2>
            <span>{perfil?.correo || "Sin correo"} · ONUFAST</span>
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
              <strong>{perfil?.id_usuario ?? "—"}</strong>
            </div>

            <div className="perfil-dato">
              <span>Correo electrónico</span>
              <strong>{perfil?.correo || "—"}</strong>
            </div>

            <div className="perfil-dato">
              <span>Teléfono</span>
              <strong>{perfil?.telefono || "—"}</strong>
            </div>

            <div className="perfil-dato">
              <span>Documento</span>
              <strong>{documento}</strong>
            </div>

            <div className="perfil-dato">
              <span>Jornada</span>
              <strong>{perfil?.jornada || "—"}</strong>
            </div>

            <div className="perfil-dato">
              <span>Rol</span>
              <strong>{roles}</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
