
import "./DashboardConductor.css";

export default function DashboardConductor() {

  const estadisticas = [
    {
      titulo: "Rutas asignadas",
      valor: "08",
      descripcion: "Rutas programadas",
      icono: "🛣️"
    },
    {
      titulo: "Entregas pendientes",
      valor: "12",
      descripcion: "Paquetes por entregar",
      icono: "📦"
    },
    {
      titulo: "Entregas completadas",
      valor: "25",
      descripcion: "Entregas realizadas",
      icono: "✅"
    },
    {
      titulo: "Rutas finalizadas",
      valor: "06",
      descripcion: "Recorridos completados",
      icono: "🚚"
    }
  ];

  const rutas = [
    {
      codigo: "RUT-001",
      origen: "Bogotá",
      destino: "Soacha",
      hora: "08:00 AM",
      estado: "En proceso"
    },
    {
      codigo: "RUT-002",
      origen: "Bogotá",
      destino: "Chía",
      hora: "10:30 AM",
      estado: "Pendiente"
    },
    {
      codigo: "RUT-003",
      origen: "Bogotá",
      destino: "Mosquera",
      hora: "02:00 PM",
      estado: "Pendiente"
    }
  ];

  return (
    <div className="dashboard-conductor">

      {/* BIENVENIDA */}
      <div className="dashboard-bienvenida">
        <div>
          <span className="dashboard-etiqueta">
            PANEL DE CONTROL
          </span>

          <h1>¡Hola, conductor! 👋</h1>

          <p>
            Aquí puedes consultar tus rutas y gestionar
            las entregas asignadas.
          </p>
        </div>

        <div className="bienvenida-icono">
          🚚
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="estadisticas-conductor">

        {estadisticas.map((item, index) => (
          <div className="estadistica-card" key={index}>

            <div className="estadistica-superior">
              <span>{item.titulo}</span>
              <div className="estadistica-icono">
                {item.icono}
              </div>
            </div>

            <h2>{item.valor}</h2>

            <p>{item.descripcion}</p>

          </div>
        ))}

      </div>

      {/* RUTAS */}
      <div className="rutas-conductor-card">

        <div className="rutas-card-header">
          <div>
            <h2>Mis próximas rutas</h2>
            <p>Resumen de tus recorridos programados.</p>
          </div>

          <span className="rutas-icono">📍</span>
        </div>

        <div className="tabla-rutas">

          <div className="tabla-rutas-encabezado">
            <span>Código</span>
            <span>Origen</span>
            <span>Destino</span>
            <span>Hora</span>
            <span>Estado</span>
          </div>

          {rutas.map((ruta, index) => (
            <div className="tabla-rutas-fila" key={index}>
              <strong>{ruta.codigo}</strong>
              <span>{ruta.origen}</span>
              <span>{ruta.destino}</span>
              <span>{ruta.hora}</span>

              <span>
                <small className={
                  ruta.estado === "En proceso"
                    ? "estado-proceso"
                    : "estado-pendiente"
                }>
                  {ruta.estado}
                </small>
              </span>
            </div>
          ))}

        </div>

      </div>

      {/* MENSAJE INFORMATIVO */}
      <div className="conductor-aviso">
        <span>ℹ️</span>

        <div>
          <strong>Recuerda mantener tus entregas actualizadas</strong>
          <p>
            Registra cada cambio de estado para mantener
            informado al equipo de ONUFAST.
          </p>
        </div>
      </div>

    </div>
  );
}
