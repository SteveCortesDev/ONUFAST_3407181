
import { useState } from "react";
import "./MisRutas.css";

export default function MisRutas() {
  const [filtro, setFiltro] = useState("Todas");

  // Datos temporales para visualizar las rutas
  const rutas = [
    {
      codigo: "RUT-001",
      origen: "Bogotá",
      destino: "Soacha",
      hora: "08:00 AM",
      fecha: "14 Nov 2026",
      vehiculo: "Motocicleta",
      paquetes: 5,
      estado: "En proceso"
    },
    {
      codigo: "RUT-002",
      origen: "Bogotá",
      destino: "Chía",
      hora: "10:30 AM",
      fecha: "14 Nov 2026",
      vehiculo: "Camioneta",
      paquetes: 8,
      estado: "Pendiente"
    },
    {
      codigo: "RUT-003",
      origen: "Bogotá",
      destino: "Mosquera",
      hora: "02:00 PM",
      fecha: "14 Nov 2026",
      vehiculo: "Motocicleta",
      paquetes: 4,
      estado: "Finalizada"
    },
    {
      codigo: "RUT-004",
      origen: "Bogotá",
      destino: "Funza",
      hora: "03:30 PM",
      fecha: "14 Nov 2026",
      vehiculo: "Camioneta",
      paquetes: 6,
      estado: "Pendiente"
    }
  ];

  const rutasFiltradas =
    filtro === "Todas"
      ? rutas
      : rutas.filter((ruta) => ruta.estado === filtro);

  return (
    <div className="mis-rutas">

      <div className="mis-rutas-titulo">
        <div>
          <span className="rutas-etiqueta">GESTIÓN DE RECORRIDOS</span>
          <h1>Mis rutas</h1>
          <p>Consulta y organiza los recorridos que tienes asignados.</p>
        </div>

        <div className="rutas-total">
          <span>Rutas asignadas</span>
          <strong>{rutas.length}</strong>
        </div>
      </div>

      {/* RESUMEN */}
      <div className="rutas-resumen">

        <div className="ruta-resumen-card">
          <span className="ruta-resumen-icono">🛣️</span>
          <div>
            <p>Total de rutas</p>
            <strong>{rutas.length}</strong>
          </div>
        </div>

        <div className="ruta-resumen-card">
          <span className="ruta-resumen-icono">🟡</span>
          <div>
            <p>Pendientes</p>
            <strong>
              {rutas.filter(r => r.estado === "Pendiente").length}
            </strong>
          </div>
        </div>

        <div className="ruta-resumen-card">
          <span className="ruta-resumen-icono">🔵</span>
          <div>
            <p>En proceso</p>
            <strong>
              {rutas.filter(r => r.estado === "En proceso").length}
            </strong>
          </div>
        </div>

        <div className="ruta-resumen-card">
          <span className="ruta-resumen-icono">🟢</span>
          <div>
            <p>Finalizadas</p>
            <strong>
              {rutas.filter(r => r.estado === "Finalizada").length}
            </strong>
          </div>
        </div>

      </div>

      {/* FILTROS */}
      <div className="rutas-listado">

        <div className="rutas-listado-header">
          <div>
            <h2>Recorridos asignados</h2>
            <p>Selecciona un estado para filtrar tus rutas.</p>
          </div>

          <div className="rutas-filtros">
            {["Todas", "Pendiente", "En proceso", "Finalizada"].map(
              (estado) => (
                <button
                  key={estado}
                  className={filtro === estado ? "filtro-activo" : ""}
                  onClick={() => setFiltro(estado)}
                >
                  {estado}
                </button>
              )
            )}
          </div>
        </div>

        {/* TARJETAS DE RUTAS */}
        <div className="rutas-tarjetas">

          {rutasFiltradas.length > 0 ? (
            rutasFiltradas.map((ruta) => (
              <article className="ruta-card" key={ruta.codigo}>

                <div className="ruta-card-superior">
                  <strong>{ruta.codigo}</strong>

                  <span className={`ruta-estado ${
                    ruta.estado === "Pendiente"
                      ? "pendiente"
                      : ruta.estado === "En proceso"
                      ? "proceso"
                      : "finalizada"
                  }`}>
                    {ruta.estado}
                  </span>
                </div>

                <div className="ruta-recorrido">

                  <div className="ruta-punto">
                    <span className="punto-origen"></span>
                    <div>
                      <small>Origen</small>
                      <strong>{ruta.origen}</strong>
                    </div>
                  </div>

                  <div className="ruta-linea"></div>

                  <div className="ruta-punto">
                    <span className="punto-destino"></span>
                    <div>
                      <small>Destino</small>
                      <strong>{ruta.destino}</strong>
                    </div>
                  </div>

                </div>

                <div className="ruta-detalles">

                  <div>
                    <small>Fecha</small>
                    <strong>{ruta.fecha}</strong>
                  </div>

                  <div>
                    <small>Hora</small>
                    <strong>{ruta.hora}</strong>
                  </div>

                  <div>
                    <small>Vehículo</small>
                    <strong>{ruta.vehiculo}</strong>
                  </div>

                  <div>
                    <small>Paquetes</small>
                    <strong>{ruta.paquetes}</strong>
                  </div>

                </div>

              </article>
            ))
          ) : (
            <div className="rutas-vacio">
              <span>📭</span>
              <h3>No hay rutas en este estado</h3>
              <p>Prueba seleccionando otro filtro.</p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
