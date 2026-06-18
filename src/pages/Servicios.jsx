import './Pages.css';

export default function Servicios() {
  const servicios = [
    {
      icono: '/avion.png',
      titulo: 'Envíos Nacionales e Internacionales',
      desc: 'Recogemos, transportamos y entregamos tus encomiendas o paquetes a nivel nacional e internacional con total seguridad.'
    },
    {
      icono: '/correo-electronico.png',
      titulo: 'Envíos de Documentos',
      desc: 'Transporte especializado de documentos y mensajería expresa con confirmación de entrega en tiempo real.'
    },
    {
      icono: '/camion.png',
      titulo: 'Exportaciones ONUFAST',
      desc: 'ONUFAST opera como tu aliado estratégico de carga, proveyendo servicios integrales de exportación para tus mercancías.'
    },
    {
      icono: '/icono-de-la-tienda-web.png',
      titulo: 'E-commerce Dedicado',
      desc: 'Proveemos soluciones de almacenamiento y despacho optimizado para potenciar las ventas y entregas de tu tienda virtual.'
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