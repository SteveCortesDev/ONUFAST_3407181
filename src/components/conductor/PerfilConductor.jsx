
import "./CSS/PerfilConductor.css";

export default function PerfilConductor() {
  const obtenerDato = (...claves) => {
    for (const clave of claves) {
      const valor = localStorage.getItem(clave);
      if (valor) return valor;
    }
    return "No disponible";
  };

  const nombre =
    obtenerDato("nombre_usuario", "nombre") !== "No disponible"
      ? obtenerDato("nombre_usuario", "nombre")
      : "Conductor";

  const idUsuario = obtenerDato("id_usuario");
  const correo = obtenerDato("correo_usuario", "correo", "email");
  const telefono = obtenerDato("telefono_usuario", "telefono");
  const jornada = obtenerDato("jornada_usuario", "jornada");

  const datos = [
    { icono: "🪪", titulo: "Identificación", valor: idUsuario },
    { icono: "✉️", titulo: "Correo electrónico", valor: correo },
    { icono: "📱", titulo: "Teléfono", valor: telefono },
    { icono: "🕒", titulo: "Jornada de trabajo", valor: jornada },
    { icono: "🚚", titulo: "Rol asignado", valor: "Conductor" },
    { icono: "🏢", titulo: "Empresa", valor: "ONUFAST" },
  ];

  return (
    <div className="perfil-conductor">

      <div className="perfil-titulo">
        <span className="perfil-etiqueta">CUENTA Y DATOS PERSONALES</span>
        <h2>Mi perfil</h2>
        <p>Consulta tu información personal y datos de usuario.</p>
      </div>

      <div className="perfil-card">

        {/* ENCABEZADO DEL PERFIL */}
        <div className="perfil-portada">

          <div className="perfil-avatar">
            <img
              src="/foto-perfil.avif"
              alt="Foto de perfil del conductor"
            />
          </div>

          <div className="perfil-nombre">
            <span className="perfil-rol">PERFIL DE CONDUCTOR</span>
            <h2>{nombre}</h2>
            <p>Conductor ONUFAST</p>

            <span className="perfil-estado">
              <span className="perfil-punto-activo"></span>
              Cuenta activa
            </span>
          </div>

          <div className="perfil-portada-icono">
            🚚
          </div>

        </div>

        {/* INFORMACIÓN */}
        <div className="perfil-informacion">

          <div className="perfil-informacion-header">
            <div>
              <h3>Información personal</h3>
              <p>Datos asociados a tu cuenta de conductor.</p>
            </div>
            <span className="perfil-icono-info">👤</span>
          </div>

          <div className="perfil-grid">

            {datos.map((dato, index) => (
              <div className="perfil-dato" key={index}>

                <div className="perfil-dato-icono">
                  {dato.icono}
                </div>

                <div className="perfil-dato-texto">
                  <span>{dato.titulo}</span>
                  <strong>{dato.valor}</strong>
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* NOTA */}
        <div className="perfil-nota">
          <span className="perfil-nota-icono">ℹ️</span>
          <div>
            <strong>Información de tu cuenta</strong>
            <p>
              Estos datos corresponden a tu perfil dentro de ONUFAST.
              Si necesitas actualizar tu información, comunícate con el
              administrador del sistema.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
