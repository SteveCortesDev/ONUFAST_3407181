import { useState } from "react";

import {
  COLOR_ESTADO,
  ESTADOS,
  TODOS_LOS_ESTADOS,
  formatearFecha,
  mensajeError
} from "./datosBodega";

const FILTROS = ["Todos", ...TODOS_LOS_ESTADOS];

export default function PaquetesBodega({ paquetes, onCambiarEstado }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [guardando, setGuardando] = useState(null);
  const [error, setError] = useState("");

  const texto = busqueda.trim().toLowerCase();

  const filtrados = paquetes.filter((p) => {
    const coincideFiltro = filtro === "Todos" || p.estado === filtro;

    const coincideBusqueda =
      !texto ||
      (p.guia || "").toLowerCase().includes(texto) ||
      (p.destinatario || "").toLowerCase().includes(texto) ||
      (p.destino || "").toLowerCase().includes(texto) ||
      (p.registrado_por || "").toLowerCase().includes(texto);

    return coincideFiltro && coincideBusqueda;
  });

  const contar = (estado) =>
    estado === "Todos"
      ? paquetes.length
      : paquetes.filter((p) => p.estado === estado).length;

  const cambiar = async (idPaquete, estado) => {
    setError("");
    setGuardando(idPaquete);

    try {
      await onCambiarEstado(idPaquete, estado);
    } catch (err) {
      setError(mensajeError(err, "No se pudo cambiar el estado."));
    } finally {
      setGuardando(null);
    }
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

        {error && <p className="formulario-error">{error}</p>}

        <div className="filtros-bodega">
          <input
            type="text"
            className="buscador-bodega"
            placeholder="Buscar por guía, destinatario o destino..."
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
                <th>Destinatario</th>
                <th>Destino</th>
                <th>Ruta</th>
                <th>Peso</th>
                <th>Medidas</th>
                <th>Fecha</th>
                <th>Registrado por</th>
                <th>Estado</th>
                <th>Cambiar estado</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map((p) => (
                <tr key={p.id_paquete}>
                  <td><strong>{p.guia}</strong></td>
                  <td>{p.destinatario}</td>
                  <td>{p.destino}</td>
                  <td>
                    {p.codigo_ruta === "SIN-ASIGNAR"
                      ? "Sin asignar"
                      : p.codigo_ruta}
                  </td>
                  <td>{p.peso} kg</td>
                  <td>{p.dimensiones || "—"}</td>
                  <td>{formatearFecha(p.fecha)}</td>
                  <td>{p.registrado_por}</td>
                  <td>
                    <span className={`badge ${COLOR_ESTADO[p.estado] || "gris"}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td>
                    <select
                      className="select-estado"
                      value={ESTADOS.includes(p.estado) ? p.estado : ""}
                      disabled={guardando === p.id_paquete}
                      onChange={(e) =>
                        e.target.value &&
                        cambiar(p.id_paquete, e.target.value)
                      }
                    >
                      <option value="">
                        {ESTADOS.includes(p.estado) ? "Elegir…" : p.estado}
                      </option>

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
                  <td colSpan="10" className="tabla-vacia">
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
