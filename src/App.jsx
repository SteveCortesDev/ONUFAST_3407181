import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import Admin from './pages/Admin';
import Usuario from './pages/Usuario';

import api from './api';


// ─────────────────────────────────────────────
// IMÁGENES DEL CARRUSEL
// ─────────────────────────────────────────────

const imagenesCarrusel = [
    "/carrusel_img1.jpg",
    "/carrusel_img2.jpg",
    "/carrusel_img3.jpg",
    "/carrusel_img4.jpg",
    "/carrusel_img5.jpg"
];


// ─────────────────────────────────────────────
// COMPONENTE INTERNO
// Permite utilizar useNavigate()
// ─────────────────────────────────────────────

function AppContent() {

    // Estados del carrusel
    const [indiceActivo, setIndiceActivo] = useState(0);

    // Estado del modal de inicio de sesión
    const [mostrarModal, setMostrarModal] = useState(false);

    // Estado del menú móvil
    const [menuAbierto, setMenuAbierto] = useState(false);

    // Estado de conexión con la base de datos
    const [dbStatus, setDbStatus] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const esPanelUsuario = location.pathname === '/usuario';


    // ─────────────────────────────────────────
    // COMPROBAR CONEXIÓN CON LA BASE DE DATOS
    // ─────────────────────────────────────────

    useEffect(() => {

        api.get('/test-db')
            .then(res => {
                console.log('Conexión con BD:', res.data);
                setDbStatus(res.data.conexion);
            })
            .catch(err => {
                console.error('Error conectando con la BD:', err);
                setDbStatus('Error de conexión');
            });

    }, []);


    // ─────────────────────────────────────────
    // LOGIN
    // ─────────────────────────────────────────

    const handleLogin = (usuario) => {

        console.log('Usuario autenticado:', usuario);

        navigate('/usuario');

    };


    // ─────────────────────────────────────────
    // CARRUSEL
    // ─────────────────────────────────────────

    const siguienteImagen = () => {

        setIndiceActivo((prev) =>
            prev === imagenesCarrusel.length - 1
                ? 0
                : prev + 1
        );

    };


    const anteriorImagen = () => {

        setIndiceActivo((prev) =>
            prev === 0
                ? imagenesCarrusel.length - 1
                : prev - 1
        );

    };


    // ─────────────────────────────────────────
    // CERRAR MENÚ
    // ─────────────────────────────────────────

    const cerrarMenu = () => {
        setMenuAbierto(false);
    };


    // ─────────────────────────────────────────
    // INTERFAZ
    // ─────────────────────────────────────────

    return (

        <div className="onufast-container" id="inicio">


            {/* ═══════════════════════════════════
                HEADER / NAVBAR
            ═══════════════════════════════════ */}
            {!esPanelUsuario && (

    <header className="onufast-header">

        <div className="logo-container">

            <Link to="/" onClick={cerrarMenu}>

                <img
                    src="/logo_calidad_onufast.jpg"
                    alt="Logo Onufast"
                    className="logo-img"
                />

            </Link>

        </div>

         {/* BOTÓN HAMBURGUESA */}

                <button
                    className={`btn-hamburguesa ${menuAbierto ? 'abierto' : ''}`}
                    onClick={() => setMenuAbierto(!menuAbierto)}
                    aria-label="Abrir menú de navegación"
                    aria-expanded={menuAbierto}
                >

                    <span></span>
                    <span></span>
                    <span></span>

                </button>


                {/* OVERLAY */}

                {menuAbierto && (

                    <div
                        className="nav-overlay"
                        onClick={cerrarMenu}
                    ></div>

                )}


                {/* MENÚ */}

                <nav
                    className={`onufast-nav ${menuAbierto ? 'nav-abierto' : ''}`}
                >

                    <Link to="/" onClick={cerrarMenu}>
                        Inicio
                    </Link>

                    <Link to="/servicios" onClick={cerrarMenu}>
                        Servicios
                    </Link>

                    <Link to="/nosotros" onClick={cerrarMenu}>
                        Quiénes Somos
                    </Link>

                    <Link to="/rastreo" onClick={cerrarMenu}>
                        Rastrear Envío
                    </Link>

                    <Link to="/ubicacion" onClick={cerrarMenu}>
                        Ubícanos
                    </Link>


                    {/* LOGIN MOBILE */}

                    <button
                        className="btn-login btn-login-mobile"
                        onClick={() => {
                            setMostrarModal(true);
                            cerrarMenu();
                        }}
                    >

                        Iniciar Sesión

                    </button>

                </nav>


                {/* LOGIN DESKTOP */}

                <button
                    className="btn-login btn-login-desktop"
                    onClick={() => setMostrarModal(true)}
                >

                    Iniciar Sesión

                </button>

            </header>

   
)}

            


               


            {/* ═══════════════════════════════════
                ESTADO DE LA BASE DE DATOS
            ═══════════════════════════════════ */}

            {/*

            Si quieres mostrar el estado en pantalla,
            puedes quitar los comentarios de este bloque.

            */}

            {/*
            <div className="db-status">
                Estado de la BD: {dbStatus || 'Comprobando...'}
            </div>
            */}


            {/* ═══════════════════════════════════
                RUTAS DE LA APLICACIÓN
            ═══════════════════════════════════ */}

            <Routes>


                {/* ═══════════════════════════════
                    PÁGINA PRINCIPAL
                ═══════════════════════════════ */}

                <Route
                    path="/"
                    element={

                        <>


                            {/* ─────────────────────
                                HERO SECTION
                            ───────────────────── */}

                            <main className="onufast-hero">


                                <div className="hero-content">

                                    <h1 className="hero-title">

                                        El Mejor Sitio Seguro
                                        <br />
                                        Para Tus Pedidos

                                    </h1>


                                    <p className="hero-description">

                                        Enviando felicidad a tu puerta,
                                        rápido, seguro y hasta
                                        <br />
                                        tu hogar, tu paquete,
                                        nuestra prioridad.

                                    </p>


                                    <div className="hero-actions-container">

                                        <button
                                            className="btn-start"
                                            onClick={() => setMostrarModal(true)}
                                        >

                                            Comenzar

                                        </button>


                                        <RastreoRapido />

                                    </div>

                                </div>


                                {/* ─────────────────────
                                    CARRUSEL
                                ───────────────────── */}

                                <div className="hero-carousel-container">

                                    <div className="carousel-placeholder">


                                        {/* ANTERIOR */}

                                        <span
                                            className="arrow-left"
                                            onClick={anteriorImagen}
                                        >

                                            ‹

                                        </span>


                                        {/* IMAGEN */}

                                        <img
                                            src={imagenesCarrusel[indiceActivo]}
                                            alt={`Carrusel entrega ${indiceActivo + 1}`}
                                            className="carousel-img"
                                        />


                                        {/* SIGUIENTE */}

                                        <span
                                            className="arrow-right"
                                            onClick={siguienteImagen}
                                        >

                                            ›

                                        </span>


                                        {/* PUNTOS */}

                                        <div className="carousel-dots">

                                            {imagenesCarrusel.map((_, indice) => (

                                                <span
                                                    key={indice}
                                                    className={`dot ${
                                                        indice === indiceActivo
                                                            ? 'active'
                                                            : ''
                                                    }`}
                                                    onClick={() =>
                                                        setIndiceActivo(indice)
                                                    }
                                                ></span>

                                            ))}

                                        </div>

                                    </div>

                                </div>

                            </main>


                            {/* ═══════════════════════
                                SERVICIOS
                            ═══════════════════════ */}

                            <section
                                className="onufast-services"
                                id="servicios"
                            >


                                {/* SERVICIO 1 */}

                                <div className="service-card">

                                    <div className="icon-wrapper">

                                        <img
                                            src="/avion.png"
                                            alt="Icono Avión"
                                            className="service-icon"
                                        />

                                    </div>

                                    <h3>
                                        Envíos Nacionales e Internacionales
                                    </h3>

                                    <p>
                                        Recogemos, transportamos y entregamos
                                        tus encomiendas o paquetes a nivel
                                        nacional e internacional con total
                                        seguridad.
                                    </p>

                                </div>


                                {/* SERVICIO 2 */}

                                <div className="service-card">

                                    <div className="icon-wrapper">

                                        <img
                                            src="/correo-electronico.png"
                                            alt="Icono Sobre"
                                            className="service-icon"
                                        />

                                    </div>

                                    <h3>
                                        Envíos de Documentos
                                    </h3>

                                    <p>
                                        Transporte especializado de documentos
                                        y mensajería expresa con confirmación
                                        de entrega en tiempo real.
                                    </p>

                                </div>


                                {/* SERVICIO 3 */}

                                <div className="service-card">

                                    <div className="icon-wrapper">

                                        <img
                                            src="/camion.png"
                                            alt="Icono Camión"
                                            className="service-icon"
                                        />

                                    </div>

                                    <h3>
                                        Exportaciones ONUFAST
                                    </h3>

                                    <p>
                                        ONUFAST opera como tu aliado estratégico
                                        de carga, proveyendo servicios integrales
                                        de exportación para tus mercancías.
                                    </p>

                                </div>


                                {/* SERVICIO 4 */}

                                <div className="service-card">

                                    <div className="icon-wrapper">

                                        <img
                                            src="/icono-de-la-tienda-web.png"
                                            alt="Icono Carrito"
                                            className="service-icon"
                                        />

                                    </div>

                                    <h3>
                                        E-commerce Dedicado
                                    </h3>

                                    <p>
                                        Proveemos soluciones de almacenamiento
                                        y despacho optimizado para potenciar
                                        las ventas y entregas de tu tienda
                                        virtual.
                                    </p>

                                </div>

                            </section>


                            {/* ═══════════════════════
                                CÓMO FUNCIONA
                            ═══════════════════════ */}

                            <ComoFunciona />

                        </>

                    }
                />


                {/* ═══════════════════════════════
                    OTRAS RUTAS
                ═══════════════════════════════ */}

                <Route
                    path="/nosotros"
                    element={<Nosotros />}
                />

                <Route
                    path="/rastreo"
                    element={<Rastreo />}
                />

                <Route
                    path="/servicios"
                    element={<Servicios />}
                />

                <Route
                    path="/ubicacion"
                    element={<Ubicacion />}
                />


                {/* ADMIN */}

                <Route
                    path="/admin"
                    element={<Admin />}
                />

                <Route
                    path="/usuario"
                    element={<Usuario />}
                /> 

            </Routes>


            {/* ═══════════════════════════════════
                FOOTER
            ═══════════════════════════════════ */}

            {/* FOOTER */}

            {!esPanelUsuario && <Footer />}


            {/* ═══════════════════════════════════
                MODAL DE AUTENTICACIÓN
            ═══════════════════════════════════ */}

            {!esPanelUsuario && (
                <AuthModal
                    isOpen={mostrarModal}
                    onClose={() => setMostrarModal(false)}
                    onLogin={handleLogin}
                />
)}

        </div>

    );

}


// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────

export default function App() {

    return (

        <BrowserRouter>

            <AppContent />

        </BrowserRouter>

    );

}