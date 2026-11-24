import { useState } from "react";

import {
  CIUDADES,
  COLOR_ESTADO,
  formatearFecha,
  mensajeError
} from "./datosBodega";

const FORMULARIO_VACIO = {
  guia: "",
  destinatario: "",
  documento: "",
  origen: "Bogotá",
  destino: "Tunja",
  descripcion: "",
  peso: "",
  alto: "",
  largo: "",
  ancho: ""
};

export default function RecepcionPaquetes({
  pendientes,
  onRegistrar,
  onRecibir
}) {
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [recibiendo, setRecibiendo] = useState(null);

  const cambiar = (campo, valor) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
    setError("");
    setMensaje("");
  };

  const enviar = async (evento) => {
    evento.preventDefault();

    setError("");
    setMensaje("");

    const destinatario = formulario.destinatario.trim();
    const documento = formulario.documento.trim();
    const peso = Number(formulario.peso);
    const alto = Number(formulario.alto);
    const largo = Number(formulario.largo);
    const ancho = Number(formulario.ancho);

    if (!destinatario || !documento) {
      setError("Completa el destinatario y su documento.");
      return;
    }

    if (!peso || peso <= 0) {
      setError("El peso debe ser un número mayor que cero.");
      return;
    }

    if (!alto || !largo || !ancho || alto <= 0 || largo <= 0 || ancho <= 0) {
      setError("Escribe el alto, el largo y el ancho en centímetros.");
      return;
    }

    setEnviando(true);

    try {
      const respuesta = await onRegistrar({
        guia: formulario.guia.trim() || null,
        destinatario,
        documento_destinatario: documento,
        origen: formulario.origen,
        destino: formulario.destino,
        descripcion: formulario.descripcion.trim() || null,
        peso,
        alto,
        largo,
        ancho
      });

      setFormulario(FORMULARIO_VACIO);
      setMensaje(
        `Paquete ${respuesta?.paquete?.guia || ""} registrado en bodega.`
      );
    } catch (err) {
      setError(mensajeError(err, "No se pudo registrar el paquete."));
    } finally {
      setEnviando(false);
    }
  };

  const recibir = async (paquete) => {
    setError("");
    setMensaje("");
    setRecibiendo(paquete.id_paquete);

    try {
      await onRecibir(paquete.id_paquete);
      setMensaje(`Paquete ${paquete.guia} recibido en bodega.`);
    } catch (err) {
      setError(mensajeError(err, "No se pudo recibir el paquete."));
    } finally {
      setRecibiendo(null);
    }
  };

  return (
    <div className="recepcion-bodega">

      <div className="bodega-card">
        <div className="bodega-card-header">
          <div>
            <h2>Nuevo ingreso a bodega</h2>
            <p>Diligencia los datos del paquete que acaba de llegar.</p>
          </div>

          <span className="bodega-card-icono">📥</span>
        </div>

        <form className="formulario-bodega" onSubmit={enviar}>

          <div className="campo">
            <label htmlFor="guia">Número de guía</label>
            <input
              id="guia"
              type="text"
              placeholder="Si la dejas vacía se genera sola"
              value={formulario.guia}
              onChange={(e) => cambiar("guia", e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="documento">Documento del destinatario *</label>
            <input
              id="documento"
              type="text"
              placeholder="Ej. 1029384756"
              value={formulario.documento}
              onChange={(e) => cambiar("documento", e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="destinatario">Destinatario *</label>
            <input
              id="destinatario"
              type="text"
              placeholder="Nombre de quien recibe"
              value={formulario.destinatario}
              onChange={(e) => cambiar("destinatario", e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="origen">Ciudad de origen</label>
            <select
              id="origen"
              value={formulario.origen}
              onChange={(e) => cambiar("origen", e.target.value)}
            >
              {CIUDADES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="destino">Ciudad de destino</label>
            <select
              id="destino"
              value={formulario.destino}
              onChange={(e) => cambiar("destino", e.target.value)}
            >
              {CIUDADES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="campo campo-completo">
            <label htmlFor="descripcion">Descripción del contenido</label>
            <input
              id="descripcion"
              type="text"
              placeholder="Ej. Caja con documentos"
              value={formulario.descripcion}
              onChange={(e) => cambiar("descripcion", e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="peso">Peso (kg) *</label>
            <input
              id="peso"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="Ej. 2.5"
              value={formulario.peso}
              onChange={(e) => cambiar("peso", e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="alto">Alto (cm) *</label>
            <input
              id="alto"
              type="number"
              min="1"
              step="1"
              placeholder="Ej. 30"
              value={formulario.alto}
              onChange={(e) => cambiar("alto", e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="largo">Largo (cm) *</label>
            <input
              id="largo"
              type="number"
              min="1"
              step="1"
              placeholder="Ej. 40"
              value={formulario.largo}
              onChange={(e) => cambiar("largo", e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="ancho">Ancho (cm) *</label>
            <input
              id="ancho"
              type="number"
              min="1"
              step="1"
              placeholder="Ej. 20"
              value={formulario.ancho}
              onChange={(e) => cambiar("ancho", e.target.value)}
            />
          </div>

          {error && <p className="formulario-error">{error}</p>}
          {mensaje && <p className="formulario-exito">{mensaje}</p>}

          <div className="formulario-acciones campo-completo">
            <button
              type="submit"
              className="btn-primario"
              disabled={enviando}
            >
              {enviando ? "Guardando…" : "Registrar en bodega"}
            </button>

            <button
              type="button"
              className="btn-secundario"
              onClick={() => {
                setFormulario(FORMULARIO_VACIO);
                setError("");
                setMensaje("");
              }}
            >
              Limpiar
            </button>
          </div>

        </form>
      </div>

      {/* PAQUETES POR RECIBIR */}
      <div className="bodega-card">
        <div className="bodega-card-header">
          <div>
            <h2>Por recibir en bodega</h2>
            <p>
              {pendientes.length} paquete(s) registrados por los clientes que
              todavía no ingresan a bodega.
            </p>
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
                <th>Peso</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {pendientes.map((p) => (
                <tr key={p.id_paquete}>
                  <td><strong>{p.guia}</strong></td>
                  <td>{p.destinatario}</td>
                  <td>{p.destino}</td>
                  <td>{p.peso} kg</td>
                  <td>{formatearFecha(p.fecha)}</td>
                  <td>
                    <span className={`badge ${COLOR_ESTADO[p.estado] || "gris"}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-mini"
                      onClick={() => recibir(p)}
                      disabled={recibiendo === p.id_paquete}
                    >
                      {recibiendo === p.id_paquete ? "…" : "Recibir"}
                    </button>
                  </td>
                </tr>
              ))}

              {pendientes.length === 0 && (
                <tr>
                  <td colSpan="7" className="tabla-vacia">
                    No hay paquetes pendientes de recibir.
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
