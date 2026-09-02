import './Pages.css';

export default function Servicios() {
  const servicios = [
    {
      icono: '/camion.png',
      titulo: 'Servicio Estándar',
      desc: 'El envío estándar es nuestro servicio regular, ideal para quienes buscan una entrega confiable a un costo accesible. Perfecto para envíos que no requieren urgencia extrema.',
      tiempo: '2-5 días hábiles',
      precio: 'Desde $15.000 COP'
    },
    {
      icono: '/avion.png',
      titulo: 'Servicio Express',
      desc: 'El envío express prioriza tu paquete con nuestra red logística más rápida. Ideal para documentos urgentes y entregas que no pueden esperar.',
      tiempo: '24-48 horas',
      precio: 'Desde $35.000 COP'
    },
  ];

  return (
    <div className="page-container">
      <section className="page-hero">
        <h1>Nuestros Servicios</h1>
        <p>Soluciones logísticas para todas tus necesidades</p>
      </section>

      <section className="page-content">
        <div className="servicios-grid">
          {servicios.map((servicio, index) => (
            <div key={index} className="servicio-card">
              <div className="icon-wrapper">
                <img src={servicio.icono} alt={servicio.titulo} className="service-icon" />
              </div>
              <h3>{servicio.titulo}</h3>
              <p>{servicio.desc}</p>
              <div className="service-details">
                <p><strong>Tiempo de Entrega:</strong> {servicio.tiempo}</p>
                <p><strong>Precio:</strong> {servicio.precio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}