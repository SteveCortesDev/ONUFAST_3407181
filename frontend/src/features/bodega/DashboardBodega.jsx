import { COLOR_ESTADO, formatearFecha } from "./datosBodega";

export default function DashboardBodega({
  resumen,
  paquetes,
  rutas,
  onIrA
}) {
  const datos = resumen || {
    pendientes: 0,
    en_bodega: 0,
    en_camino: 0,
    entregados: 0,
    rutas: 0
  };

  const estadisticas = [
    {
      titulo: "Por recibir",
      valor: datos.pendientes,
      descripcion: "Pendientes de ingreso",
      icono: "📥"
    },
    {
      titulo: "En bodega",
      valor: datos.en_bodega,
      descripcion: "Listos para despacho",
      icono: "📦"
    },
    {
      titulo: "En camino",
      valor: datos.en_camino,
      descripcion: "Paquetes en tránsito",
      icono: "🚚"
    },
    {
      titulo: "Entregados",
      valor: datos.entregados,
      descripcion: "Entregas completadas",
      icono: "✅"
    }
  ];

  const recientes = paquetes.slice(0, 5);

  return (
    <div className="dashboard-bodega">

      {/* BIENVENIDA */}
      <div className="bodega-bienvenida">
        <div>
          <span className="bodega-etiqueta">PANEL DE CONTROL</span>

          <h1>¡Hola, encargado de bodega! 👋</h1>

          <p>
            Revisa lo que está por llegar, organiza los paquetes y
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

      {/* ÚLTIMOS PAQUETES */}
      <div className="bodega-card">
        <div className="bodega-card-header">
          <div>
            <h2>Últimos paquetes registrados</h2>
            <p>Los 5 ingresos más recientes de la base de datos.</p>
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
                    <span className={`badge ${COLOR_ESTADO[p.estado] || "gris"}`}>
                      {p.estado}
                    </span>
                  </td>
                </tr>
              ))}

              {recientes.length === 0 && (
                <tr>
                  <td colSpan="5" className="tabla-vacia">
                    Todavía no hay paquetes registrados en la base de datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RUTAS */}
      <div className="bodega-card">
        <div className="bodega-card-header">
          <div>
            <h2>Rutas registradas</h2>
            <p>Paquetes asignados a cada ruta de la base de datos.</p>
          </div>

          <span className="bodega-card-icono">🛣️</span>
        </div>

        <div className="rutas-grid">
          {rutas.map((r) => (
            <div className="ruta-resumen" key={r.id_rutas}>

              <div className="ruta-resumen-superior">
                <strong>{r.codigo_ruta}</strong>
                <span className={`badge ${COLOR_ESTADO[r.estado] || "gris"}`}>
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
                        (r.paquetes.length / Math.max(r.capacidad, 1)) * 100
                      )}%`
                    }}
                  ></span>
                </div>

                <small>
                  {r.paquetes.length} de {r.capacidad} paquetes
                </small>
              </div>

            </div>
          ))}

          {rutas.length === 0 && (
            <p className="tabla-vacia">
              No hay rutas registradas todavía.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
