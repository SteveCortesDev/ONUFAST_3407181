import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Usuarios.css';

export default function Usuario() {

    const [menuActivo, setMenuActivo] = useState('panel');

    // Datos de prueba
    const usuario = {
        nombre: 'María López'
    };

    const estadisticas = {
        total: 12,
        camino: 3,
        entregados: 8,
        pendientes: 1
    };


    //panel ultimos envios

    const envios = [
        {
            codigo: 'ONF-2026-001',
            destino: 'Bogotá, Colombia',
            fecha: '01/09/2026',
            estado: 'En camino',
            progreso: 60
        },
        {
            codigo: 'ONF-2026-002',
            destino: 'Medellín, Colombia',
            fecha: '30/08/2026',
            estado: 'Entregado',
            progreso: 100
        },
        {
            codigo: 'ONF-2026-003',
            destino: 'Cali, Colombia',
            fecha: '28/08/2026',
            estado: 'En camino',
            progreso: 30
        },
        {
            codigo: 'ONF-2026-004',
            destino: 'Bucaramanga, Colombia',
            fecha: '27/08/2026',
            estado: 'Pendiente',
            progreso: 0
        }
    ];

    const cerrarSesion = () => {
        console.log('Cerrar sesión');
    };

    return (
        <div className="usuario-panel">

            {/* ═══════════════════════════════════════
                HEADER DEL PANEL
            ═══════════════════════════════════════ */}

            <header className="usuario-header">

                {/* LOGO */}

                <div className="usuario-logo">

                    <Link to="/">
                        <img
                            src="/logo_calidad_onufast.jpg"
                            alt="ONUFAST"
                        />
                    </Link>

                </div>


                {/* NAVEGACIÓN SUPERIOR */}

                <nav className="usuario-nav">

                    <Link to="/">
                        Inicio
                    </Link>

                    <Link to="/servicios">
                        Servicios
                    </Link>

                    <Link to="/nosotros">
                        Quiénes Somos
                    </Link>

                    <Link to="/rastreo">
                        Rastrear Envío
                    </Link>

                    <Link to="/ubicacion">
                        Ubícanos
                    </Link>

                </nav>


                {/* PARTE DERECHA */}

                <div className="usuario-header-right">

                    <div className="usuario-cuenta">

                        <div className="usuario-icono">
                            👤
                        </div>

                        <div>
                            <strong>{usuario.nombre}</strong>
                            <small>Mi cuenta</small>
                        </div>

                    </div>

                </div>

            </header>


            {/* ═══════════════════════════════════════
                CUERPO DEL PANEL
            ═══════════════════════════════════════ */}

            <div className="usuario-body">


                {/* ═══════════════════════════════
                    MENÚ LATERAL
                ═══════════════════════════════ */}

                <aside className="usuario-sidebar">

                    <button
                        className={`sidebar-item ${
                            menuActivo === 'panel' ? 'activo' : ''
                        }`}
                        onClick={() => setMenuActivo('panel')}
                    >
                        <span>⌂</span>
                        Panel de Usuario
                    </button>


                    <button
                        className={`sidebar-item ${
                            menuActivo === 'paquete' ? 'activo' : ''
                        }`}
                        onClick={() => setMenuActivo('paquete')}
                    >
                        <span>▣</span>
                        Registrar Paquete
                    </button>


                    <button
                        className={`sidebar-item ${
                            menuActivo === 'envios' ? 'activo' : ''
                        }`}
                        onClick={() => setMenuActivo('envios')}
                    >
                        <span>▱</span>
                        Mis Envíos
                    </button>


                    <button
                        className={`sidebar-item ${
                            menuActivo === 'rastreo' ? 'activo' : ''
                        }`}
                        onClick={() => setMenuActivo('rastreo')}
                    >
                        <span>⌕</span>
                        Rastrear Envío
                    </button>


                    <button
                        className={`sidebar-item ${
                            menuActivo === 'perfil' ? 'activo' : ''
                        }`}
                        onClick={() => setMenuActivo('perfil')}
                    >
                        <span>♙</span>
                        Mi Perfil
                    </button>


                    <button
                        className={`sidebar-item ${
                            menuActivo === 'direcciones' ? 'activo' : ''
                        }`}
                        onClick={() => setMenuActivo('direcciones')}
                    >
                        <span>⌖</span>
                        Direcciones
                    </button>


                    <button
                        className={`sidebar-item ${
                            menuActivo === 'notificaciones' ? 'activo' : ''
                        }`}
                        onClick={() => setMenuActivo('notificaciones')}
                    >
                        <span>♧</span>
                        Notificaciones
                    </button>


                    {/* CERRAR SESIÓN */}

                    <div className="sidebar-separador"></div>

                    <button
                        className="cerrar-sesion"
                        onClick={cerrarSesion}
                    >
                        <span>↪</span>
                        Cerrar Sesión
                    </button>

                </aside>


                {/* ═══════════════════════════════
                    CONTENIDO PRINCIPAL
                ═══════════════════════════════ */}

                <main className="usuario-contenido">


                    {/* ═══════════════════════════════
                        BIENVENIDA
                    ═══════════════════════════════ */}

                    <section className="usuario-bienvenida">

                        <div className="bienvenida-texto">

                            <h1>
                                ¡Hola, {usuario.nombre.split(' ')[0]}! 
                            </h1>

                            <p>
                                Bienvenido al panel de usuario de ONUFAST, tu aliado confiable en envíos
                            </p>

                            <p>
                                Desde aquí puedes gestionar tus envíos
                                de forma rápida y segura.
                            </p>

                        </div>


                        <div className="bienvenida-imagen">

                            <div className="paquete-imagen">
                                📦
                            </div>

                        </div>

                    </section>


                    {/* ═══════════════════════════════
                        RESUMEN DE ENVÍOS
                    ═══════════════════════════════ */}

                    <section className="resumen">

                        <div className="seccion-titulo">

                            <h2>
                                Resumen de tus envíos
                            </h2>

                        </div>


                        <div className="estadisticas-grid">


                            <div className="estadistica-card">

                                <div className="estadistica-icono">
                                    📦
                                </div>

                                <div>
                                    <strong>
                                        {estadisticas.total}
                                    </strong>

                                    <span>
                                        Total enviados
                                    </span>
                                </div>

                            </div>


                            <div className="estadistica-card">

                                <div className="estadistica-icono">
                                    🚚
                                </div>

                                <div>
                                    <strong>
                                        {estadisticas.camino}
                                    </strong>

                                    <span>
                                        En camino
                                    </span>
                                </div>

                            </div>


                            <div className="estadistica-card">

                                <div className="estadistica-icono">
                                    ✓
                                </div>

                                <div>
                                    <strong>
                                        {estadisticas.entregados}
                                    </strong>

                                    <span>
                                        Entregados
                                    </span>
                                </div>

                            </div>


                            <div className="estadistica-card">

                                <div className="estadistica-icono">
                                    ◷
                                </div>

                                <div>
                                    <strong>
                                        {estadisticas.pendientes}
                                    </strong>

                                    <span>
                                        Pendientes
                                    </span>
                                </div>

                            </div>

                        </div>

                    </section>


                    {/* ═══════════════════════════════
                        ACCIONES RÁPIDAS
                    ═══════════════════════════════ */}

                    <section className="acciones">

                        <h2>
                            Acciones rápidas
                        </h2>


                        <div className="acciones-grid">


                            <div className="accion-card">

                                <div className="accion-icono">
                                    📦
                                </div>

                                <h3>
                                    Registrar Paquete
                                </h3>

                                <p>
                                    Crea un nuevo paquete
                                    y realiza un envío.
                                </p>

                                <button>
                                    Comenzar →
                                </button>

                            </div>


                            <div className="accion-card">

                                <div className="accion-icono">
                                    🚚
                                </div>

                                <h3>
                                    Mis Envíos
                                </h3>

                                <p>
                                    Consulta y administra
                                    todos tus envíos.
                                </p>

                                <button>
                                    Ver envíos →
                                </button>

                            </div>


                            <div className="accion-card">

                                <div className="accion-icono">
                                    🔍
                                </div>

                                <h3>
                                    Rastrear Envío
                                </h3>

                                <p>
                                    Ingresa tu código de guía
                                    y consulta el estado.
                                </p>

                                <button>
                                    Rastrear →
                                </button>

                            </div>


                            <div className="accion-card">

                                <div className="accion-icono">
                                    👤
                                </div>

                                <h3>
                                    Mi Perfil
                                </h3>

                                <p>
                                    Actualiza tus datos
                                    y preferencias.
                                </p>

                                <button>
                                    Editar perfil →
                                </button>

                            </div>

                        </div>

                    </section>


                    {/* ═══════════════════════════════
                        ÚLTIMOS ENVÍOS
                    ═══════════════════════════════ */}

                    <section className="ultimos-envios">

                        <div className="envios-header">

                            <h2>
                                Últimos envíos
                            </h2>

                            <button>
                                Ver todos mis envíos →
                            </button>

                        </div>


                        <div className="tabla-envios">

                            <table>

                                <thead>

                                    <tr>
                                        <th>Código de guía</th>
                                        <th>Destino</th>
                                        <th>Fecha de envío</th>
                                        <th>Estado</th>
                                        <th>Progreso</th>
                                        <th>Acciones</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {envios.map((envio) => (

                                        <tr key={envio.codigo}>

                                            <td>
                                                {envio.codigo}
                                            </td>

                                            <td>
                                                {envio.destino}
                                            </td>

                                            <td>
                                                {envio.fecha}
                                            </td>

                                            <td>

                                                <span
                                                    className={`estado estado-${envio.estado
                                                        .toLowerCase()
                                                        .replace(' ', '-')}`}
                                                >
                                                    {envio.estado}
                                                </span>

                                            </td>

                                            <td>

                                                <div className="progreso">

                                                    <div className="barra">

                                                        <div
                                                            className="barra-llenado"
                                                            style={{
                                                                width: `${envio.progreso}%`
                                                            }}
                                                        ></div>

                                                    </div>

                                                    <span>
                                                        {envio.progreso}%
                                                    </span>

                                                </div>

                                            </td>

                                            <td>

                                                <button className="ver-envio">
                                                    👁
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </section>

                </main>

            </div>

        </div>
    );
}