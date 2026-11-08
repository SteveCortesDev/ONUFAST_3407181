import './Pages.css';

export default function Ubicacion() {
  // Cambia esta dirección por la real de tus oficinas
  const direccion = "Calle 123 %2345-67, Bogotá, Colombia";
  const mapaSrc = `https://www.google.com/maps?q=${direccion}&output=embed`;

  return (
    <div className="page-container">
      <section className="page-hero">
        <h1>Ubícanos</h1>
        <p>Encuentra nuestras oficinas</p>
      </section>

      <section className="page-content">
        <div className="ubicacion-grid">
          <div className="mapa-container">
            <iframe
              src={mapaSrc}
              className="mapa-iframe"
              title="Ubicación ONUFAST"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
          </div>

          <div className="contacto-info">
            <div className="info-card">
              <h3>📍 Dirección</h3>
              <p>Calle 123 #45-67</p>
              <p>Bogotá, Colombia</p>
            </div>
            <div className="info-card">
              <h3>📞 Teléfono</h3>
              <p>+57 3138040658</p>
            </div>
            <div className="info-card">
              <h3>📧 Email</h3>
              <p>onufast@gmail.com</p>
            </div>
            <div className="info-card">
              <h3>🕐 Horario</h3>
              <p>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
              <p>Sábados: 9:00 AM - 1:00 PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}