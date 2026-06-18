import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import './responsive.css';
import AuthModal from './components/AuthModal';
import RastreoRapido from './components/RastreoRapido';
import ComoFunciona from './components/ComoFunciona';
import Footer from './components/Footer';
import Nosotros from './pages/Nosotros';
import Rastreo from './pages/Rastreo';
import Servicios from './pages/Servicios';
import Ubicacion from './pages/Ubicacion';

const imagenesCarrusel = [
  "/carrusel_img1.jpg",
  "/carrusel_img2.jpg",
  "/carrusel_img3.jpg",
  "/carrusel_img4.jpg",
  "/carrusel_img5.jpg"
];

function App() {
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);

  const siguienteImagen = () => {
    setIndiceActivo((prev) => (prev === imagenesCarrusel.length - 1 ? 0 : prev + 1));
  };

  const anteriorImagen = () => {
    setIndiceActivo((prev) => (prev === 0 ? imagenesCarrusel.length - 1 : prev - 1));
  };

  return (
    <BrowserRouter>
      <div className="onufast-container" id="inicio">
        {/* 1. HEADER / NAVBAR */}
        <header className="onufast-header">
          <div className="logo-container">
            <Link to="/">
              <img src="/logo_con_nombre.jpg" alt="Logo Onufast" className="logo-img" />
            </Link>
          </div>
          <nav className="onufast-nav">
            <Link to="/">Inicio</Link>
            <Link to="/servicios">Servicios</Link>
            <Link to="/nosotros">Quiénes Somos</Link>
            <Link to="/rastreo">Rastrear Envío</Link>
            <Link to="/ubicacion">Ubícanos</Link>
          </nav>
          <button className="btn-login" onClick={() => setMostrarModal(true)}>
            Iniciar Sesión
          </button>
        </header>

        {/* 2. RUTAS DE LA APLICACIÓN */}
        <Routes>
          {/* RUTA PRINCIPAL - HOME */}
          <Route path="/" element={
            <>
              {/* HERO SECTION */}
              <main className="onufast-hero">
                <div className="hero-content">
                  <h1 className="hero-title">
                    El Mejor Sitio Seguro <br /> Para Tus Pedidos
                  </h1>
                  <p className="hero-description">
                    Enviando felicidad a tu puerta, rápido, seguro y hasta <br />
                    tu hogar, tu paquete, nuestra prioridad.
                  </p>
                  
                  <div className="hero-actions-container">
                    <button className="btn-start">Comenzar</button>
                    <RastreoRapido />
                  </div>
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

              {/* SECCIÓN DE SERVICIOS */}
              <section className="onufast-services" id="servicios">
                <div className="service-card">
                  <div className="icon-wrapper">
                    <img src="/avion.png" alt="Icono Avión" className="service-icon" />
                  </div>
                  <h3>Envíos Nacionales e Internacionales</h3>
                  <p>Recogemos, transportamos y entregamos tus encomiendas o paquetes a nivel nacional e internacional con total seguridad.</p>
                </div>

                <div className="service-card">
                  <div className="icon-wrapper">
                    <img src="/correo-electronico.png" alt="Icono Sobre" className="service-icon" />
                  </div>
                  <h3>Envíos de Documentos</h3>
                  <p>Transporte especializado de documentos y mensajería expresa con confirmación de entrega en tiempo real.</p>
                </div>

                <div className="service-card">
                  <div className="icon-wrapper">
                    <img src="/camion.png" alt="Icono Camión" className="service-icon" />
                  </div>
                  <h3>Exportaciones ONUFAST</h3>
                  <p>ONUFAST opera como tu aliado estratégico de carga, proveyendo servicios integrales de exportación para tus mercancías.</p>
                </div>

                <div className="service-card">
                  <div className="icon-wrapper">
                    <img src="/icono-de-la-tienda-web.png" alt="Icono Carrito" className="service-icon" />
                  </div>
                  <h3>E-commerce Dedicado</h3>
                  <p>Proveemos soluciones de almacenamiento y despacho optimizado para potenciar las ventas y entregas de tu tienda virtual.</p>
                </div>
              </section>

              {/* SECCIÓN CÓMO FUNCIONA */}
              <ComoFunciona />
            </>
          } />

          {/* RUTAS DE LAS PÁGINAS */}
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/rastreo" element={<Rastreo />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/ubicacion" element={<Ubicacion />} />
        </Routes>

        {/* 3. FOOTER */}
        <Footer />

        {/* 4. MODAL DE AUTENTICACIÓN */}
        <AuthModal isOpen={mostrarModal} onClose={() => setMostrarModal(false)} />
      </div>
    </BrowserRouter>
  );
}

export default App;