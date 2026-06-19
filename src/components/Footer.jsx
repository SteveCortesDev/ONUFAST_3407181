export default function Footer() {
  return (
    <footer className="onufast-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/LOGO_ONUFAST.jpg" alt="ONUFAST Logo" className="footer-logo" />
          <h3>ONUFAST</h3>
          <p>Haz que suceda. Tu paquete, nuestra prioridad.</p>
        </div>
        
        <div className="footer-links">
          <h4>Navegación</h4>
          <a href="/Inicio">Inicio</a>
          <a href="/Servicios">Servicios</a>
          <a href="/Nosotros">Quiénes Somos</a>
          <a href="/Rastreo">Rastrear Envío</a>
          <a href="/Ubicacion">Ubícanos</a>
        </div>
        
        <div className="footer-contact">
          <h4>Contacto</h4>
          <p>📧 onufast@gmail.com</p>
          <p>📞 +57 3138040658</p>
          <p>📍 Bogotá, Colombia</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 ONUFAST. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}