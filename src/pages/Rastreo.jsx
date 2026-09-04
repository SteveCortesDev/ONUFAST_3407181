import { useState } from 'react';
import api from '../api';
import './Pages.css';


export default function Rastreo() {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const extraerMensajeError = (error) => {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail.map((d) => d.msg).join(", ");
    }
    return "Ocurrió un error inesperado.";
  };

  const handleRastrear = async (e) => {
    e.preventDefault();
    if (!codigo.trim()) return;

    setCargando(true);
    setError('');
    setResultado(null);

    try {
      const response = await api.get(`/envios/rastreo/${codigo.trim()}`);
      setResultado(response.data);
    } catch (err) {
      setError(extraerMensajeError(err));
    } finally {
      setCargando(false);
    }
  };

  // Determina qué pasos del timeline ya se completaron según el estado real
  const estadoActual = resultado?.estado?.toUpperCase() || "";
  const pasoRecoleccion = true; // si existe el envío, ya fue recolectado
  const pasoTransito = ["EN CAMINO", "EN_CAMINO", "ENTREGADO"].includes(estadoActual);
  const pasoEntrega = estadoActual === "ENTREGADO";

  return (
    <div className="page-container">
      <section className="page-hero">
        <h1>Rastrear Envío</h1>
        <p>Ingresa tu código de seguimiento para conocer el estado de tu paquete</p>
      </section>

      <section className="page-content">
        <div className="rastreo-form-container">
          <form onSubmit={handleRastrear} className="rastreo-form">
            <div className="input-group">
              <label htmlFor="codigo-seguimiento">Código de seguimiento:</label>
              <input
                id="codigo-seguimiento"
                type="text"
                placeholder="Ej: ONU-XXXXXXXXXX"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                required
              />
              <small className="input-help">Formato: ONU-XXXXXXXXXX</small>
            </div>
            <button type="submit" className="btn-rastrear-full" disabled={cargando}>
              {cargando ? '🔍 Buscando...' : '🔍 Rastrear'}
            </button>
          </form>

          {error && (
            <div className="rastreo-resultado">
              <p style={{ color: "#f87171" }}>{error}</p>
            </div>
          )}

          {resultado && (
            <div className="rastreo-resultado">
              <div className="rastreo-header">
                <h3>📦 Estado del envío</h3>
                <span className="rastreo-codigo">Código: {resultado.codigo_rastreo}</span>
              </div>

              <div className="rastreo-estado">
                <span className="estado-badge">{resultado.estado}</span>
              </div>

              <p><strong>📦 Tipo de envío:</strong> {resultado.tipo_envio}</p>
              <p><strong>👤 Destinatario:</strong> {resultado.nombre_destinatario}</p>
              <p><strong>📍 Origen:</strong> {resultado.origen || "No especificado"}</p>
              <p><strong>📍 Destino:</strong> {resultado.destino || "No especificado"}</p>
              <p><strong>📅 Fecha de creación:</strong> {new Date(resultado.fecha_creacion).toLocaleDateString('es-CO')}</p>

              <div className="rastreo-timeline">
                <div className={`timeline-item ${pasoRecoleccion ? "completado" : "pendiente"}`}>
                  <span className="timeline-icon">✅</span>
                  <div>
                    <strong>Recolección</strong>
                    <p>Paquete recogido en origen</p>
                  </div>
                </div>
                <div className={`timeline-item ${pasoTransito ? "completado" : "pendiente"}`}>
                  <span className="timeline-icon">🚚</span>
                  <div>
                    <strong>En tránsito</strong>
                    <p>Tu paquete está en camino</p>
                  </div>
                </div>
                <div className={`timeline-item ${pasoEntrega ? "completado" : "pendiente"}`}>
                  <span className="timeline-icon">⏳</span>
                  <div>
                    <strong>Entrega</strong>
                    <p>{pasoEntrega ? "Entregado con éxito" : "Próximamente en tu puerta"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}