import { useState } from 'react';
import './Pages.css';

export default function Rastreo() {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleRastrear = (e) => {
    e.preventDefault();
    if (!codigo.trim()) return;
    
    setCargando(true);
    
    // Simulación de búsqueda (conectar con backend después)
    setTimeout(() => {
      setResultado({
        estado: 'En tránsito',
        ubicacion: 'Bogotá - Centro de Distribución',
        fecha: new Date().toLocaleDateString('es-CO'),
        mensaje: 'Tu paquete está en camino y llegará en las próximas 24-48 horas.',
        codigo: codigo
      });
      setCargando(false);
    }, 1000);
  };

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
                placeholder="Ej: ONF-2026-001"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                required
              />
              <small className="input-help">Formato: ONF-XXXX-XXX (ejemplo: ONF-2026-001)</small>
            </div>
            <button type="submit" className="btn-rastrear-full" disabled={cargando}>
              {cargando ? '🔍 Buscando...' : '🔍 Rastrear'}
            </button>
          </form>

          {resultado && (
            <div className="rastreo-resultado">
              <div className="rastreo-header">
                <h3>📦 Estado del envío</h3>
                <span className="rastreo-codigo">Código: {resultado.codigo}</span>
              </div>
              <div className="rastreo-estado">
                <span className="estado-badge">{resultado.estado}</span>
              </div>
              <p><strong>📍 Ubicación:</strong> {resultado.ubicacion}</p>
              <p><strong>📅 Fecha:</strong> {resultado.fecha}</p>
              <p className="rastreo-mensaje">{resultado.mensaje}</p>
              
              <div className="rastreo-timeline">
                <div className="timeline-item completado">
                  <span className="timeline-icon">✅</span>
                  <div>
                    <strong>Recolección</strong>
                    <p>Paquete recogido en origen</p>
                  </div>
                </div>
                <div className="timeline-item activo">
                  <span className="timeline-icon">🚚</span>
                  <div>
                    <strong>En tránsito</strong>
                    <p>Tu paquete está en camino</p>
                  </div>
                </div>
                <div className="timeline-item pendiente">
                  <span className="timeline-icon">⏳</span>
                  <div>
                    <strong>Entrega</strong>
                    <p>Próximamente en tu puerta</p>
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