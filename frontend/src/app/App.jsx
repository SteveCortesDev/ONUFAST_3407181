
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Navigate,
    useNavigate,
    useLocation
} from 'react-router-dom';

import { useState, useEffect } from 'react';

import '@/styles/App.css';
import '@/styles/responsive.css';

import AuthModal from '@/features/auth/AuthModal';
import RastreoRapido from '@/features/envios/RastreoRapido';
import ComoFunciona from '@/features/landing/ComoFunciona';
import Footer from '@/shared/components/Footer';

import Nosotros from '@/features/landing/Nosotros';
import Rastreo from '@/features/envios/Rastreo';
import Servicios from '@/features/landing/Servicios';
import Ubicacion from '@/features/landing/Ubicacion';
import Admin from '@/features/admin/Admin';
import Usuario from '@/features/usuario/Usuario';

import api from '@/shared/api';


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
// PROTECCIÓN DE RUTAS
// ─────────────────────────────────────────────

function RutaProtegida({ children, esAdmin = false }) {

    const token = localStorage.getItem('token');
    const idRol = Number(localStorage.getItem('id_rol'));

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (!idRol) {
        localStorage.removeItem('token');
        localStorage.removeItem('id_usuario');
        localStorage.removeItem('nombre_usuario');
        localStorage.removeItem('id_rol');
        localStorage.removeItem('nombre_rol');

        return <Navigate to="/" replace />;
    }

    if (esAdmin && idRol !== 1) {
        return <Navigate to="/usuario" replace />;
    }

    if (!esAdmin && idRol === 1) {
        return <Navigate to="/admin" replace />;
    }

    return children;
}


// ─────────────────────────────────────────────
// COMPONENTE INTERNO
// ─────────────────────────────────────────────

function AppContent() {

    const [indiceActivo, setIndiceActivo] = useState(0);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [dbStatus, setDbStatus] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const esPanelUsuario = location.pathname === '/usuario';
    const esPanelAdmin = location.pathname === '/admin';

    const estaLogueado = !!localStorage.getItem('token');


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

        console.log('Usuario autenticado:', {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            id_rol: usuario.id_rol,
            nombre_rol: usuario.nombre_rol
        });

        if (Number(usuario.id_rol) === 1) {
            navigate('/admin', { replace: true });
        } else {
            navigate('/usuario', { replace: true });
        }

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


            {/* HEADER / NAVBAR */}

            {!esPanelUsuario && !esPanelAdmin && (

                <header className="onufast-header">

                    <div className="logo-container">

                        <Link
                            to={estaLogueado ? "/usuario" : "/"}
                            onClick={cerrarMenu}
                        >

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

                        <Link
                            to={estaLogueado
                                ? (Number(localStorage.getItem('id_rol')) === 1
                                    ? "/admin"
                                    : "/usuario")
                                : "/"}
                            onClick={cerrarMenu}
                        >
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

                        {!estaLogueado && (

                            <button
                                className="btn-login btn-login-mobile"
                                onClick={() => {
                                    setMostrarModal(true);
                                    cerrarMenu();
                                }}
                            >
                                Iniciar Sesión
                            </button>

                        )}

                    </nav>


                    {/* LOGIN DESKTOP */}

                    {!estaLogueado && (

                        <button
                            className="btn-login btn-login-desktop"
                            onClick={() => setMostrarModal(true)}
                        >
                            Iniciar Sesión
                        </button>

                    )}

                </header>

            )}


            {/* ESTADO DE LA BASE DE DATOS */}

            {/*
            <div className="db-status">
                Estado de la BD: {dbStatus || 'Comprobando...'}
            </div>
            */}


            {/* RUTAS DE LA APLICACIÓN */}

            <Routes>


                {/* PÁGINA PRINCIPAL */}

                <Route
                    path="/"
                    element={

                        <>

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


                                {/* CARRUSEL */}

                                <div className="hero-carousel-container">

                                    <div className="carousel-placeholder">

                                        <span
                                            className="arrow-left"
                                            onClick={anteriorImagen}
                                        >
                                            ‹
                                        </span>

                                        <img
                                            src={imagenesCarrusel[indiceActivo]}
                                            alt={`Carrusel entrega ${indiceActivo + 1}`}
                                            className="carousel-img"
                                        />

                                        <span
                                            className="arrow-right"
                                            onClick={siguienteImagen}
                                        >
                                            ›
                                        </span>

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


                            {/* SERVICIOS */}

                            <section
                                className="onufast-services"
                                id="servicios"
                            >

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


                            {/* CÓMO FUNCIONA */}

                            <ComoFunciona />

                        </>

                    }
                />


                {/* OTRAS RUTAS */}

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


                {/* PANEL ADMINISTRATIVO */}

                <Route
                    path="/admin"
                    element={
                        <RutaProtegida esAdmin={true}>
                            <Admin />
                        </RutaProtegida>
                    }
                />


                {/* PANEL DE USUARIO */}

                <Route
                    path="/usuario"
                    element={
                        <RutaProtegida>
                            <Usuario />
                        </RutaProtegida>
                    }
                />

            </Routes>


            {/* FOOTER */}

            {!esPanelUsuario && !esPanelAdmin && <Footer />}


            {/* MODAL DE AUTENTICACIÓN */}

            {!estaLogueado && !esPanelUsuario && !esPanelAdmin && (

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
