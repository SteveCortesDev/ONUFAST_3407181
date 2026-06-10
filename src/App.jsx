import { useState } from 'react';
import './App.css';
import AuthModal from './AuthModal';

// Arreglo de imágenes alojadas en la carpeta 'public'
const imagenesCarrusel = [
  "/carrusel_img1.jpg",
  "/carrusel_img2.jpg",
  "/carrusel_img3.jpg",
  "/carrusel_img4.jpg",
  "/carrusel_img5.jpg"
];

function App() {
  // Estado para el carrusel de la landing page
  const [indiceActivo, setIndiceActivo] = useState(0);
  
  // Estado para controlar la visibilidad del modal de autenticación
  const [mostrarModal, setMostrarModal] = useState(false);

  const siguienteImagen = () => {
    setIndiceActivo((prev) => (prev === imagenesCarrusel.length - 1 ? 0 : prev + 1));
  };

  const anteriorImagen = () => {
    setIndiceActivo((prev) => (prev === 0 ? imagenesCarrusel.length - 1 : prev - 1));
  };

  return (
    <div className="onufast-container">
      {/* 1. HEADER / NAVBAR */}
      <header className="onufast-header">
        <div className="logo-container">
          <img src="/logo_con_nombre.jpg" alt="Logo Onufast" className="logo-img" />
        </div>
        <nav className="onufast-nav">
          <a href="#inicio">Inicio</a>
          <a href="#ubicanos">Ubícanos</a>
          <a href="#quienes-somos">Quienes Somos</a>
        </nav>
        <button className="btn-login" onClick={() => setMostrarModal(true)}>
          Iniciar Sesión
        </button>
      </header>

      {/* 2. HERO SECTION */}
      <main className="onufast-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            El Mejor Sitio Seguro <br /> Para Tus pedidos
          </h1>
          <p className="hero-description">
            Enviando felicidad a tu puerta, rápido, seguro y hasta <br />
            tu hogar, tu paquete, nuestra prioridad
          </p>
          <button className="btn-start">Comenzar</button>
        </div>
        
        <div className="hero-carousel-container">
          <div className="carousel-placeholder">
            <span className="arrow-left" onClick={anteriorImagen}>‹</span>
            
            <img 
              src={imagenesCarrusel[indiceActivo]} 
              alt={`Carrusel entrega ${indiceActivo + 1}`} 
              className="carousel-img" 
            />

            <span className="arrow-right" onClick={siguienteImagen}>›</span>
            
            <div className="carousel-dots">
              {imagenesCarrusel.map((_, indice) => (
                <span 
                  key={indice} 
                  className={`dot ${indice === indiceActivo ? 'active' : ''}`}
                  onClick={() => setIndiceActivo(indice)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* 3. SERVICES SECTION */}
      <section className="onufast-services">
        <div className="service-card">
          <img src="/avion.png" alt="Icono Avión" className="service-icon" />
          <h3>Envíos Nacionales e internacionales</h3>
          <p>Recogemos, transportamos y entregamos tus encomiendas o paquetes a Colombia y el resto del mundo.</p>
        </div>

        <div className="service-card">
          <img src="/correo-electronico.png" alt="Icono Sobre" className="service-icon" />
          <h3>Envíos de Documentos</h3>
          <p>Envíos de documentos en nuestra red a los diferentes destinos que ofrecemos en Colombia y en el resto del mundo.</p>
        </div>

        <div className="service-card">
          <img src="/camion.png" alt="Icono Camión" className="service-icon" />
          <h3>Exportaciones</h3>
          <p>Servientrega International Inc. es un Freight Forwarder autorizado que provee servicios de exportación para mercancías.</p>
        </div>

        <div className="service-card">
          <img src="/icono-de-la-tienda-web.png" alt="Icono Carrito" className="service-icon" />
          <h3>E-commerce</h3>
          <p>Proveemos las siguientes operaciones especializadas para el manejo de su mercancía recibida en nuestro centro logístico.</p>
        </div>
      </section>

      {/* COMPONENTE EMERGENTE DE AUTENTICACIÓN */}
      <AuthModal isOpen={mostrarModal} onClose={() => setMostrarModal(false)} />
    </div>
  );
}

export default App;