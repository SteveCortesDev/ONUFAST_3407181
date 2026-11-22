
import { useState } from "react";
import "./CSS/DashboardConductor.css";

export default function DashboardConductor() {
  const nombre =
    localStorage.getItem("nombre_usuario") ||
    localStorage.getItem("nombre") ||
    "Conductor";

  const [estadisticas] = useState([
    {
      titulo: "Rutas asignadas",
      valor: "08",
      descripcion: "Rutas programadas",
      icono: "🛣️",
      color: "rojo",
    },
    {
      titulo: "Entregas pendientes",
      valor: "12",
      descripcion: "Paquetes por entregar",
      icono: "📦",
      color: "amarillo",
    },
    {
      titulo: "Entregas completadas",
      valor: "25",
      descripcion: "Entregas realizadas",
      icono: "✓",
      color: "verde",
    },
    {
      titulo: "Rutas finalizadas",
      valor: "06",
      descripcion: "Recorridos completados",
      icono: "🚚",
      color: "azul",
    },
  ]);

  const rutas = [
    {
      codigo: "RUT-001",
      origen: "Bogotá",
      destino: "Soacha",
      hora: "08:00 a. m.",
      estado: "En proceso",
    },
    {
      codigo: "RUT-002",
      origen: "Bogotá",
      destino: "Chía",
      hora: "10:30 a. m.",
      estado: "Pendiente",
    },
    {
      codigo: "RUT-003",
      origen: "Bogotá",
      destino: "Mosquera",
      hora: "02:00 p. m.",
      estado: "Pendiente",
    },
  ];

  const fecha = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="dashboard-conductor">

      {/* ENCABEZADO DE BIENVENIDA */}
      <section className="dashboard-bienvenida">
        <div className="dashboard-bienvenida-texto">
          

          <h1>¡Hola, {nombre}! 👋</h1>

          <p>
            Este es el resumen de tu actividad. Consulta tus rutas
            y mantente al día con tus entregas.
          </p>

          <div className="dashboard-fecha">
            <span>📅</span>
            {fecha}
          </div>
        </div>

        <div className="bienvenida-ilustracion">
          <div className="bienvenida-circulo">
            🚚
          </div>
          <span className="bienvenida-decoracion decoracion-1">📦</span>
          <span className="bienvenida-decoracion decoracion-2">📍</span>
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="dashboard-seccion">
        <div className="dashboard-titulo-seccion">
          <div>
            <h2>Resumen de actividad</h2>
            <p>Estado general de tus operaciones</p>
          </div>
        </div>

        <div className="estadisticas-conductor">
          {estadisticas.map((item, index) => (
            <article
              className="estadistica-card"
              key={index}
            >
              <div className="estadistica-superior">
                <span className="estadistica-titulo">
                  {item.titulo}
                </span>

                <div className={`estadistica-icono ${item.color}`}>
                  {item.icono}
                </div>
              </div>

              <h3>{item.valor}</h3>

              <p>{item.descripcion}</p>
            </article>
          ))}
        </div>
      </section>

      {/* JORNADA */}
      <section className="jornada-conductor">
        <div className="jornada-icono">
          🕒
        </div>

        <div className="jornada-info">
          <h3>Tu jornada de trabajo</h3>
          <p>
            Recuerda consultar tus rutas asignadas y mantener
            actualizada la información de tus entregas.
          </p>
        </div>

        <div className="jornada-estado">
          <span className="jornada-punto"></span>
          Panel disponible
        </div>
      </section>

      {/* RUTAS */}
      <section className="rutas-conductor-card">
        <div className="rutas-card-header">
          <div>
            <h2>Mis próximas rutas</h2>
            <p>Resumen de tus recorridos programados.</p>
          </div>

          <div className="rutas-icono-header">
            📍
          </div>
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
                <small
                  className={
                    ruta.estado === "En proceso"
                      ? "estado-proceso"
                      : "estado-pendiente"
                  }
                >
                  {ruta.estado}
                </small>
              </span>
            </div>
          ))}
        </div>
      </section>

    

    </div>
  );
}
