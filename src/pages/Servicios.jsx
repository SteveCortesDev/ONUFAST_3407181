import './Pages.css';

export default function Servicios() {
  const servicios = [
    {
      icono: '/camion.png',
      titulo: 'Estándar',
      desc: 'El envío estándar es nuestro servicio normal, ideal para quienes buscan una entrega confiable a un costo regular.'
    },
    {
      icono: '/avion.png',
      titulo: 'Express',
      desc: 'El envío express va con mayor velocidad logística, priorizando tu envío para que llegue lo más rápido posible.'
    }
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
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}