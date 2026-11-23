import { useState } from "react";

import {
  CIUDADES,
  COLOR_ESTADO,
  formatearFecha,
  hoyISO
} from "./datosBodega";

const FORMULARIO_VACIO = {
  guia: "",
  remitente: "",
  destinatario: "",
  origen: "Bogotá",
  destino: "Medellín",
  peso: "",
  dimensiones: ""
};

export default function RecepcionPaquetes({ paquetes, onRegistrar }) {
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const hoy = hoyISO();

  const recibidosHoy = paquetes.filter((p) => p.fecha === hoy);

  const cambiar = (campo, valor) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
    setError("");
    setMensaje("");
  };

  const enviar = (evento) => {
    evento.preventDefault();

    const guia = formulario.guia.trim().toUpperCase();
    const remitente = formulario.remitente.trim();
    const destinatario = formulario.destinatario.trim();
    const peso = Number(formulario.peso);

    if (!guia || !remitente || !destinatario) {
      setError("Completa la guía, el remitente y el destinatario.");
      return;
    }

    if (!peso || peso <= 0) {
      setError("El peso debe ser un número mayor que cero.");
      return;
    }

    const guiaRepetida = paquetes.some(
      (p) => p.guia.toUpperCase() === guia
    );

    if (guiaRepetida) {
      setError(`Ya existe un paquete con la guía ${guia}.`);
      return;
    }

    onRegistrar({
      guia,
      remitente,
      destinatario,
      origen: formulario.origen,
      destino: formulario.destino,
      peso,
      dimensiones: formulario.dimensiones.trim() || "No registradas",
      fecha: hoy
    });

    setFormulario(FORMULARIO_VACIO);
    setMensaje(`Paquete ${guia} registrado correctamente en bodega.`);
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
            <label htmlFor="guia">Número de guía *</label>
            <input
              id="guia"
              type="text"
              placeholder="Ej. ONU-2411"
              value={formulario.guia}
              onChange={(e) => cambiar("guia", e.target.value)}
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
            <label htmlFor="remitente">Remitente *</label>
            <input
              id="remitente"
              type="text"
              placeholder="Nombre o empresa que envía"
              value={formulario.remitente}
              onChange={(e) => cambiar("remitente", e.target.value)}
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
            <label htmlFor="dimensiones">Dimensiones</label>
            <input
              id="dimensiones"
              type="text"
              placeholder="Ej. 30x20x15 cm"
              value={formulario.dimensiones}
              onChange={(e) => cambiar("dimensiones", e.target.value)}
            />
          </div>

          {error && <p className="formulario-error">{error}</p>}
          {mensaje && <p className="formulario-exito">{mensaje}</p>}

          <div className="formulario-acciones campo-completo">
            <button type="submit" className="btn-primario">
              Registrar en bodega
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

      {/* INGRESOS DEL DÍA */}
      <div className="bodega-card">
        <div className="bodega-card-header">
          <div>
            <h2>Ingresos de hoy</h2>
            <p>{recibidosHoy.length} paquete(s) recibido(s) el {formatearFecha(hoy)}.</p>
          </div>

          <span className="bodega-card-icono">📋</span>
        </div>

        <div className="tabla-scroll">
          <table className="tabla-bodega">
            <thead>
              <tr>
                <th>Guía</th>
                <th>Remitente</th>
                <th>Destinatario</th>
                <th>Destino</th>
                <th>Peso</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {recibidosHoy.map((p) => (
                <tr key={p.id_paquete}>
                  <td><strong>{p.guia}</strong></td>
                  <td>{p.remitente}</td>
                  <td>{p.destinatario}</td>
                  <td>{p.destino}</td>
                  <td>{p.peso} kg</td>
                  <td>
                    <span className={`badge ${COLOR_ESTADO[p.estado]}`}>
                      {p.estado}
                    </span>
                  </td>
                </tr>
              ))}

              {recibidosHoy.length === 0 && (
                <tr>
                  <td colSpan="6" className="tabla-vacia">
                    Aún no se han registrado paquetes hoy.
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
