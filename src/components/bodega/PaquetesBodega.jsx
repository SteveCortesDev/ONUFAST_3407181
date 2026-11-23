import { useState } from "react";

import {
  COLOR_ESTADO,
  ESTADOS,
  formatearFecha
} from "./datosBodega";

const FILTROS = ["Todos", ...ESTADOS];

export default function PaquetesBodega({
  paquetes,
  rutas,
  onCambiarEstado
}) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  const texto = busqueda.trim().toLowerCase();

  const filtrados = paquetes.filter((p) => {
    const coincideFiltro = filtro === "Todos" || p.estado === filtro;

    const coincideBusqueda =
      !texto ||
      p.guia.toLowerCase().includes(texto) ||
      p.remitente.toLowerCase().includes(texto) ||
      p.destinatario.toLowerCase().includes(texto) ||
      p.destino.toLowerCase().includes(texto);

    return coincideFiltro && coincideBusqueda;
  });

  const contar = (estado) =>
    estado === "Todos"
      ? paquetes.length
      : paquetes.filter((p) => p.estado === estado).length;

  const nombreRuta = (rutaId) => {
    const ruta = rutas.find((r) => r.id === rutaId);
    return ruta ? `${ruta.id} · ${ruta.destino}` : "Sin asignar";
  };

  return (
    <div className="paquetes-bodega">

      <div className="bodega-card">

        <div className="bodega-card-header">
          <div>
            <h2>Inventario de paquetes</h2>
            <p>Busca un paquete y actualiza su estado cuando corresponda.</p>
          </div>

          <span className="bodega-card-icono">📦</span>
        </div>

        <div className="filtros-bodega">
          <input
            type="text"
            className="buscador-bodega"
            placeholder="Buscar por guía, remitente, destinatario o destino..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <div className="chips-filtro">
            {FILTROS.map((f) => (
              <button
                key={f}
                className={filtro === f ? "chip activo" : "chip"}
                onClick={() => setFiltro(f)}
              >
                {f} ({contar(f)})
              </button>
            ))}
          </div>
        </div>

        <div className="tabla-scroll">
          <table className="tabla-bodega">
            <thead>
              <tr>
                <th>Guía</th>
                <th>Remitente</th>
                <th>Destinatario</th>
                <th>Destino</th>
                <th>Ruta</th>
                <th>Peso</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Cambiar estado</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map((p) => (
                <tr key={p.id_paquete}>
                  <td><strong>{p.guia}</strong></td>
                  <td>{p.remitente}</td>
                  <td>{p.destinatario}</td>
                  <td>{p.destino}</td>
                  <td>{nombreRuta(p.rutaId)}</td>
                  <td>{p.peso} kg</td>
                  <td>{formatearFecha(p.fecha)}</td>
                  <td>
                    <span className={`badge ${COLOR_ESTADO[p.estado]}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td>
                    <select
                      className="select-estado"
                      value={p.estado}
                      onChange={(e) =>
                        onCambiarEstado(p.id_paquete, e.target.value)
                      }
                    >
                      {ESTADOS.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}

              {filtrados.length === 0 && (
                <tr>
                  <td colSpan="9" className="tabla-vacia">
                    No se encontraron paquetes con esos criterios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
