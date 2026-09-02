import { useState } from 'react';

export default function RastreoRapido() {
  const [codigo, setCodigo] = useState('');

  const handleRastrear = (e) => {
    e.preventDefault();
    alert(`Buscando el paquete con código: ${codigo}`);
    // Aquí se conectará con el backend de ONUFAST en el futuro
  };

  return (
    <div className="rastreo-rapido-box">
      <h3>Rastrea tu paquete</h3>
      <form onSubmit={handleRastrear} className="rastreo-input-group">
        <input 
          type="text"
          placeholder="Ej: ONF-2026-001"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
        />
        <button type="submit" className="btn-rastrear">Rastrear</button>
      </form>
    </div>
  );
}