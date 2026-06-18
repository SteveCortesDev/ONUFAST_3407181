import { useState } from 'react';
import './Pages.css';

export default function Rastreo() {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState(null);

  const handleRastrear = (e) => {
    e.preventDefault();
    // Simulación de búsqueda
    setResultado({
      estado: 'En tránsito',
      ubicacion: 'Bogotá - Centro',
      fecha: '17/06/2026',
      mensaje: 'Tu paquete está en camino'
    });
  };

  return (
    <div className="page-container">
      <section className="page-hero">
        <h1>Rastrear Envío</h1>
        <p>Ingresa tu código de seguimiento</p>
      </section>

      <section className="page-content">
        <div className="rastreo-form-container">
          <form onSubmit={handleRastrear} className="rastreo-form">
            <div className="input-group">
              <label>Código de seguimiento:</label>
              <input 
                type="text" 
                placeholder="Ej: ONF-2026-001"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-rastrear-full">Rastrear</button>
          </form>

          {resultado && (
            <div className="rastreo-resultado">
              <h3>Estado: {resultado.estado}</h3>
              <p><strong>Ubicación:</strong> {resultado.ubicacion}</p>
              <p><strong>Fecha:</strong> {resultado.fecha}</p>
              <p>{resultado.mensaje}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}