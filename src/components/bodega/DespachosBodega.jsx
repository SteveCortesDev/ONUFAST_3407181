import { useState } from "react";

import { COLOR_ESTADO } from "./datosBodega";

export default function DespachosBodega({
  paquetes,
  rutas,
  onAsignar,
  onQuitar,
  onDespachar
}) {
  const [seleccion, setSeleccion] = useState({});
  const [aviso, setAviso] = useState("");

  const asignados = (rutaId) =>
    paquetes.filter((p) => p.rutaId === rutaId);

  const disponibles = (ruta) =>
    paquetes.filter(
      (p) =>
        p.estado === "En bodega" &&
        !p.rutaId &&
        p.destino === ruta.destino
    );

  const agregar = (ruta) => {
    const idPaquete = Number(seleccion[ruta.id]);
    const lista = asignados(ruta.id);

    if (!idPaquete) {
      setAviso(`Selecciona un paquete para la ruta ${ruta.id}.`);
      return;
    }

    if (lista.length >= ruta.capacidad) {
      setAviso(
        `La ruta ${ruta.id} ya alcanzó su capacidad de ${ruta.capacidad} paquetes.`
      );
      return;
    }

    onAsignar(ruta.id, idPaquete);

    setSeleccion((prev) => ({ ...prev, [ruta.id]: "" }));
    setAviso("");
  };

  return (
    <div className="despachos-bodega">

      {aviso && <p className="aviso-bodega">{aviso}</p>}

      <div className="rutas-grid">
        {rutas.map((ruta) => {
          const lista = asignados(ruta.id);
          const opciones = disponibles(ruta);
          const despachada = ruta.estado === "Despachada";
          const llena = lista.length >= ruta.capacidad;

          return (
            <div className="ruta-card" key={ruta.id}>

              <div className="ruta-card-header">
                <div>
                  <strong>{ruta.id}</strong>
                  <h3>{ruta.destino}</h3>
                </div>

                <span className={`badge ${COLOR_ESTADO[ruta.estado]}`}>
                  {ruta.estado}
                </span>
              </div>

              <div className="ruta-datos">
                <p>🕒 {ruta.hora}</p>
                <p>👤 {ruta.conductor}</p>
                <p>🚛 {ruta.vehiculo}</p>
                <p>📦 {lista.length} de {ruta.capacidad} paquetes</p>
              </div>

              <div className="ruta-barra">
                <span
                  style={{
                    width: `${Math.min(100, (lista.length / ruta.capacidad) * 100)}%`
                  }}
                ></span>
              </div>

              {/* PAQUETES ASIGNADOS */}
              <div className="ruta-lista">
                <h4>Paquetes asignados</h4>

                {lista.length === 0 && (
                  <p className="ruta-vacia">
                    Aún no hay paquetes en esta ruta.
                  </p>
                )}

                {lista.map((p) => (
                  <div className="ruta-paquete" key={p.id_paquete}>
                    <div>
                      <strong>{p.guia}</strong>
                      <span>{p.destinatario}</span>
                    </div>

                    {!despachada && (
                      <button
                        className="btn-quitar"
                        onClick={() => onQuitar(p.id_paquete)}
                        title="Quitar de la ruta"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* AGREGAR PAQUETES */}
              {!despachada && (
                <div className="ruta-agregar">
                  <select
                    value={seleccion[ruta.id] || ""}
                    onChange={(e) =>
                      setSeleccion((prev) => ({
                        ...prev,
                        [ruta.id]: e.target.value
                      }))
                    }
                    disabled={opciones.length === 0 || llena}
                  >
                    <option value="">
                      {opciones.length === 0
                        ? "Sin paquetes disponibles"
                        : "Seleccionar paquete..."}
                    </option>

                    {opciones.map((p) => (
                      <option key={p.id_paquete} value={p.id_paquete}>
                        {p.guia} · {p.destinatario}
                      </option>
                    ))}
                  </select>

                  <button
                    className="btn-secundario"
                    onClick={() => agregar(ruta)}
                    disabled={opciones.length === 0 || llena}
                  >
                    Agregar
                  </button>
                </div>
              )}

              {llena && !despachada && (
                <p className="ruta-nota">Ruta completa, no admite más paquetes.</p>
              )}

              {!despachada ? (
                <button
                  className="btn-primario btn-despachar"
                  onClick={() => {
                    onDespachar(ruta.id);
                    setAviso(
                      `Ruta ${ruta.id} despachada con ${lista.length} paquete(s).`
                    );
                  }}
                  disabled={lista.length === 0}
                >
                  Despachar ruta
                </button>
              ) : (
                <p className="ruta-despachada">
                  ✅ Ruta despachada. Los paquetes están en tránsito.
                </p>
              )}

            </div>
          );
        })}
      </div>

      {/* RESUMEN */}
      <div className="bodega-card">
        <div className="bodega-card-header">
          <div>
            <h2>Resumen de despacho</h2>
            <p>Situación actual de los paquetes según su ruta.</p>
          </div>

          <span className="bodega-card-icono">⇥</span>
        </div>

        <div className="despacho-resumen">
          <div>
            <strong>
              {paquetes.filter((p) => !p.rutaId && p.estado === "En bodega").length}
            </strong>
            <span>Sin asignar</span>
          </div>

          <div>
            <strong>
              {paquetes.filter((p) => p.rutaId && p.estado === "En bodega").length}
            </strong>
            <span>Asignados, sin despachar</span>
          </div>

          <div>
            <strong>
              {paquetes.filter((p) => p.estado === "En tránsito").length}
            </strong>
            <span>En tránsito</span>
          </div>

          <div>
            <strong>
              {rutas.filter((r) => r.estado === "Despachada").length}
            </strong>
            <span>Rutas despachadas</span>
          </div>
        </div>
      </div>

    </div>
  );
}
