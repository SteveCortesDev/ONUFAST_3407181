import { useState } from "react";

import { COLOR_ESTADO, mensajeError } from "./datosBodega";

const normalizar = (texto) =>
  (texto || "").trim().toLowerCase();

export default function DespachosBodega({
  rutas,
  sinRuta,
  onAsignar,
  onQuitar,
  onDespachar
}) {
  const [seleccion, setSeleccion] = useState({});
  const [aviso, setAviso] = useState("");
  const [error, setError] = useState("");
  const [trabajando, setTrabajando] = useState(false);

  const disponibles = (ruta) =>
    sinRuta.filter(
      (p) => normalizar(p.destino) === normalizar(ruta.destino)
    );

  const agregar = async (ruta) => {
    const idPaquete = Number(seleccion[ruta.id_rutas]);

    setAviso("");
    setError("");

    if (!idPaquete) {
      setAviso(`Selecciona un paquete para la ruta ${ruta.codigo_ruta}.`);
      return;
    }

    setTrabajando(true);

    try {
      await onAsignar(ruta.id_rutas, idPaquete);
      setSeleccion((prev) => ({ ...prev, [ruta.id_rutas]: "" }));
      setAviso(`Paquete asignado a la ruta ${ruta.codigo_ruta}.`);
    } catch (err) {
      setError(mensajeError(err, "No se pudo asignar el paquete."));
    } finally {
      setTrabajando(false);
    }
  };

  const quitar = async (idPaquete) => {
    setError("");
    setAviso("");
    setTrabajando(true);

    try {
      await onQuitar(idPaquete);
      setAviso("Paquete retirado de la ruta.");
    } catch (err) {
      setError(mensajeError(err, "No se pudo quitar el paquete."));
    } finally {
      setTrabajando(false);
    }
  };

  const despachar = async (ruta) => {
    setError("");
    setAviso("");
    setTrabajando(true);

    try {
      const respuesta = await onDespachar(ruta.id_rutas);
      setAviso(
        respuesta?.mensaje || `Ruta ${ruta.codigo_ruta} despachada.`
      );
    } catch (err) {
      setError(mensajeError(err, "No se pudo despachar la ruta."));
    } finally {
      setTrabajando(false);
    }
  };

  const asignadosSinDespachar = rutas
    .filter((r) => r.estado === "Programada")
    .reduce((total, r) => total + r.paquetes.length, 0);

  const enTransito = rutas
    .filter((r) => r.estado === "Despachada")
    .reduce((total, r) => total + r.paquetes.length, 0);

  return (
    <div className="despachos-bodega">

      {aviso && <p className="formulario-exito">{aviso}</p>}
      {error && <p className="formulario-error">{error}</p>}

      <div className="rutas-grid">
        {rutas.map((ruta) => {
          const lista = ruta.paquetes;
          const opciones = disponibles(ruta);
          const despachada = ruta.estado === "Despachada";

          return (
            <div className="ruta-card" key={ruta.id_rutas}>

              <div className="ruta-card-header">
                <div>
                  <strong>{ruta.codigo_ruta}</strong>
                  <h3>{ruta.destino}</h3>
                </div>

                <span className={`badge ${COLOR_ESTADO[ruta.estado] || "gris"}`}>
                  {ruta.estado}
                </span>
              </div>

              <div className="ruta-datos">
                <p>🕒 {ruta.hora}</p>
                <p>👤 {ruta.conductor}</p>
                <p>🚛 {ruta.vehiculo}</p>
                <p>📦 {lista.length} paquetes en esta ruta</p>
              </div>

              <div className="ruta-barra">
                <span
                  style={{
                    width: `${Math.min(
                      100,
                      (lista.length / Math.max(ruta.capacidad, 1)) * 100
                    )}%`
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
                        onClick={() => quitar(p.id_paquete)}
                        title="Quitar de la ruta"
                        disabled={trabajando}
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
                    value={seleccion[ruta.id_rutas] || ""}
                    onChange={(e) =>
                      setSeleccion((prev) => ({
                        ...prev,
                        [ruta.id_rutas]: e.target.value
                      }))
                    }
                    disabled={opciones.length === 0 || trabajando}
                  >
                    <option value="">
                      {opciones.length === 0
                        ? "Sin paquetes para este destino"
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
                    disabled={opciones.length === 0 || trabajando}
                  >
                    Agregar
                  </button>
                </div>
              )}

              {!despachada ? (
                <button
                  className="btn-primario btn-despachar"
                  onClick={() => despachar(ruta)}
                  disabled={lista.length === 0 || trabajando}
                >
                  Despachar ruta
                </button>
              ) : (
                <p className="ruta-despachada">
                  ✅ Ruta despachada. Los paquetes están en camino.
                </p>
              )}

            </div>
          );
        })}

        {rutas.length === 0 && (
          <p className="tabla-vacia">
            No hay rutas registradas en la base de datos.
          </p>
        )}
      </div>

      {/* PAQUETES SIN RUTA */}
      <div className="bodega-card">
        <div className="bodega-card-header">
          <div>
            <h2>Paquetes en bodega sin ruta</h2>
            <p>Estos paquetes aún no se han asignado a ningún despacho.</p>
          </div>

          <span className="bodega-card-icono">📦</span>
        </div>

        <div className="tabla-scroll">
          <table className="tabla-bodega">
            <thead>
              <tr>
                <th>Guía</th>
                <th>Destinatario</th>
                <th>Destino</th>
                <th>Peso</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {sinRuta.map((p) => (
                <tr key={p.id_paquete}>
                  <td><strong>{p.guia}</strong></td>
                  <td>{p.destinatario}</td>
                  <td>{p.destino}</td>
                  <td>{p.peso} kg</td>
                  <td>
                    <span className={`badge ${COLOR_ESTADO[p.estado] || "gris"}`}>
                      {p.estado}
                    </span>
                  </td>
                </tr>
              ))}

              {sinRuta.length === 0 && (
                <tr>
                  <td colSpan="5" className="tabla-vacia">
                    Todos los paquetes en bodega ya tienen ruta.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
            <strong>{sinRuta.length}</strong>
            <span>Sin asignar</span>
          </div>

          <div>
            <strong>{asignadosSinDespachar}</strong>
            <span>Asignados, sin despachar</span>
          </div>

          <div>
            <strong>{enTransito}</strong>
            <span>En camino</span>
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
