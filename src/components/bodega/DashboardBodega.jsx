import {
  COLOR_ESTADO,
  formatearFecha,
  hoyISO
} from "./datosBodega";

export default function DashboardBodega({ paquetes, rutas, onIrA }) {
  const hoy = hoyISO();

  const recibidosHoy = paquetes.filter((p) => p.fecha === hoy).length;
  const enBodega = paquetes.filter((p) => p.estado === "En bodega").length;
  const enTransito = paquetes.filter((p) => p.estado === "En tránsito").length;
  const entregados = paquetes.filter((p) => p.estado === "Entregado").length;

  const estadisticas = [
    {
      titulo: "Recibidos hoy",
      valor: recibidosHoy,
      descripcion: "Paquetes que ingresaron",
      icono: "📥"
    },
    {
      titulo: "En bodega",
      valor: enBodega,
      descripcion: "Listos para despacho",
      icono: "📦"
    },
    {
      titulo: "En tránsito",
      valor: enTransito,
      descripcion: "Paquetes en camino",
      icono: "🚚"
    },
    {
      titulo: "Entregados",
      valor: entregados,
      descripcion: "Entregas completadas",
      icono: "✅"
    }
  ];

  const recientes = [...paquetes]
    .sort((a, b) => b.id_paquete - a.id_paquete)
    .slice(0, 5);

  const paquetesDeRuta = (rutaId) =>
    paquetes.filter((p) => p.rutaId === rutaId).length;

  return (
    <div className="dashboard-bodega">

      {/* BIENVENIDA */}
      <div className="bodega-bienvenida">
        <div>
          <span className="bodega-etiqueta">PANEL DE CONTROL</span>

          <h1>¡Hola, encargado de bodega! 👋</h1>

          <p>
            Revisa lo que llegó hoy, organiza los paquetes y
            prepara los despachos del día.
          </p>

          <div className="bodega-acciones">
            <button
              className="btn-primario"
              onClick={() => onIrA("recepcion")}
            >
              + Registrar paquete
            </button>

            <button
              className="btn-secundario"
              onClick={() => onIrA("despachos")}
            >
              Ver despachos
            </button>
          </div>
        </div>

        <div className="bienvenida-icono">🏭</div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="estadisticas-bodega">
        {estadisticas.map((e) => (
          <div className="estadistica-card" key={e.titulo}>
            <div className="estadistica-superior">
              <span>{e.titulo}</span>
              <span className="estadistica-icono">{e.icono}</span>
            </div>

            <h2>{e.valor}</h2>
            <p>{e.descripcion}</p>
          </div>
        ))}
      </div>

      {/* RECEPCIONES RECIENTES */}
      <div className="bodega-card">
        <div className="bodega-card-header">
          <div>
            <h2>Últimos paquetes recibidos</h2>
            <p>Los 5 ingresos más recientes a la bodega.</p>
          </div>

          <span className="bodega-card-icono">📋</span>
        </div>

        <div className="tabla-scroll">
          <table className="tabla-bodega">
            <thead>
              <tr>
                <th>Guía</th>
                <th>Destinatario</th>
                <th>Destino</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {recientes.map((p) => (
                <tr key={p.id_paquete}>
                  <td><strong>{p.guia}</strong></td>
                  <td>{p.destinatario}</td>
                  <td>{p.destino}</td>
                  <td>{formatearFecha(p.fecha)}</td>
                  <td>
                    <span className={`badge ${COLOR_ESTADO[p.estado]}`}>
                      {p.estado}
                    </span>
                  </td>
                </tr>
              ))}

              {recientes.length === 0 && (
                <tr>
                  <td colSpan="5" className="tabla-vacia">
                    Todavía no hay paquetes registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RUTAS DEL DÍA */}
      <div className="bodega-card">
        <div className="bodega-card-header">
          <div>
            <h2>Rutas del día</h2>
            <p>Paquetes asignados a cada ruta programada.</p>
          </div>

          <span className="bodega-card-icono">🛣️</span>
        </div>

        <div className="rutas-grid">
          {rutas.map((r) => (
            <div className="ruta-resumen" key={r.id}>

              <div className="ruta-resumen-superior">
                <strong>{r.id}</strong>
                <span className={`badge ${COLOR_ESTADO[r.estado]}`}>
                  {r.estado}
                </span>
              </div>

              <h3>{r.destino}</h3>

              <p className="ruta-dato">
                🕒 {r.hora} · 🚛 {r.vehiculo}
              </p>
              <p className="ruta-dato">
                👤 {r.conductor}
              </p>

              <div className="ruta-progreso">
                <div className="ruta-barra">
                  <span
                    style={{
                      width: `${Math.min(
                        100,
                        (paquetesDeRuta(r.id) / r.capacidad) * 100
                      )}%`
                    }}
                  ></span>
                </div>

                <small>
                  {paquetesDeRuta(r.id)} de {r.capacidad} paquetes
                </small>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
