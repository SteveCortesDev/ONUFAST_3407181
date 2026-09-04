import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./Usuarios.css";

export default function Usuario() {

    // ============================================
    // ESTADOS
    // ============================================

    const [menuActivo, setMenuActivo] = useState("panel");

    const navigate = useNavigate();

    // Usuario obtenido desde FastAPI
    const [usuario, setUsuario] = useState(null);

    // Envíos obtenidos desde FastAPI
    const [envios, setEnvios] = useState([]);

    // Estados de carga
    const [cargandoPerfil, setCargandoPerfil] = useState(true);
    const [cargandoEnvios, setCargandoEnvios] = useState(true);

    // Estados de error
    const [errorPerfil, setErrorPerfil] = useState("");
    const [errorEnvios, setErrorEnvios] = useState("");


    // ============================================
    // CARGAR INFORMACIÓN AL ABRIR EL PANEL
    // ============================================

    useEffect(() => {
        cargarPerfil();
        cargarEnvios();
    }, []);


    // ============================================
    // OBTENER PERFIL DESDE FASTAPI
    // GET /usuarios/perfil
    // ============================================

    const cargarPerfil = async () => {

        try {

            setCargandoPerfil(true);
            setErrorPerfil("");

            const response = await api.get("/usuarios/perfil");

            setUsuario(response.data);

        } catch (error) {

            console.error("Error al cargar perfil:", error);

            if (error.response?.status === 401) {

                localStorage.removeItem("token");
                localStorage.removeItem("nombre_usuario");
                localStorage.removeItem("id_usuario");

                navigate("/");

            } else {

                setErrorPerfil(
                    error.response?.data?.detail ||
                    "No se pudo cargar la información del perfil."
                );
            }

        } finally {

            setCargandoPerfil(false);

        }
    };


    // ============================================
    // OBTENER ENVÍOS DESDE FASTAPI
    // GET /envios/mis-pedidos
    // ============================================

    const cargarEnvios = async () => {

        try {

            setCargandoEnvios(true);
            setErrorEnvios("");

            const response = await api.get("/envios/mis-pedidos");

            setEnvios(response.data.pedidos || []);

        } catch (error) {

            console.error("Error al cargar envíos:", error);

            if (error.response?.status === 401) {

                localStorage.removeItem("token");
                localStorage.removeItem("nombre_usuario");
                localStorage.removeItem("id_usuario");

                navigate("/");

            } else {

                setErrorEnvios(
                    error.response?.data?.detail ||
                    "No se pudieron cargar tus envíos."
                );
            }

        } finally {

            setCargandoEnvios(false);

        }
    };


    // ============================================
    // ESTADÍSTICAS REALES
    // ============================================

    const estadisticas = {

        total: envios.length,

        camino: envios.filter(
            (envio) =>
                envio.estado?.toUpperCase() === "EN CAMINO" ||
                envio.estado?.toUpperCase() === "EN_CAMINO"
        ).length,

        entregados: envios.filter(
            (envio) =>
                envio.estado?.toUpperCase() === "ENTREGADO"
        ).length,

        pendientes: envios.filter(
            (envio) =>
                envio.estado?.toUpperCase() === "PENDIENTE"
        ).length
    };


    // ============================================
    // CERRAR SESIÓN
    // ============================================

    const cerrarSesion = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("nombre_usuario");
        localStorage.removeItem("id_usuario");

        navigate("/");
    };


    // ============================================
    // FUNCIÓN PARA CAMBIAR DE SECCIÓN
    // ============================================

    const cambiarMenu = (seccion) => {
        setMenuActivo(seccion);
    };


    // ============================================
    // RENDER
    // ============================================

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

                            <strong>
                                {usuario?.nombre || "Cargando..."}
                            </strong>

                            <small>
                                Mi cuenta
                            </small>

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
                            menuActivo === "panel" ? "activo" : ""
                        }`}
                        onClick={() => cambiarMenu("panel")}
                    >
                        <span>⌂</span>
                        Panel de Usuario
                    </button>


                    <button
                        className={`sidebar-item ${
                            menuActivo === "paquete" ? "activo" : ""
                        }`}
                        onClick={() => cambiarMenu("paquete")}
                    >
                        <span>▣</span>
                        Registrar Paquete
                    </button>


                    <button
                        className={`sidebar-item ${
                            menuActivo === "envios" ? "activo" : ""
                        }`}
                        onClick={() => cambiarMenu("envios")}
                    >
                        <span>▱</span>
                        Mis Envíos
                    </button>


                    <button
                        className={`sidebar-item ${
                            menuActivo === "rastreo" ? "activo" : ""
                        }`}
                        onClick={() => cambiarMenu("rastreo")}
                    >
                        <span>⌕</span>
                        Rastrear Envío
                    </button>


                    <button
                        className={`sidebar-item ${
                            menuActivo === "perfil" ? "activo" : ""
                        }`}
                        onClick={() => cambiarMenu("perfil")}
                    >
                        <span>♙</span>
                        Mi Perfil
                    </button>


                    <button
                        className={`sidebar-item ${
                            menuActivo === "direcciones" ? "activo" : ""
                        }`}
                        onClick={() => cambiarMenu("direcciones")}
                    >
                        <span>⌖</span>
                        Direcciones
                    </button>


                    <button
                        className={`sidebar-item ${
                            menuActivo === "notificaciones" ? "activo" : ""
                        }`}
                        onClick={() => cambiarMenu("notificaciones")}
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


                    {/* ==================================================
                        PANEL PRINCIPAL
                    ================================================== */}

                    {menuActivo === "panel" && (

                        <>

                            {/* BIENVENIDA */}

                            <section className="usuario-bienvenida">

                                <div className="bienvenida-texto">

                                    <h1>
                                        ¡Hola,{" "}
                                        {usuario?.nombre?.split(" ")[0] || "usuario"}!
                                    </h1>

                                    <p>
                                        Bienvenido al panel de usuario de ONUFAST,
                                        tu aliado confiable en envíos
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


                            {/* RESUMEN DE ENVÍOS */}

                            <section className="resumen">

                                <div className="seccion-titulo">

                                    <h2>
                                        Resumen de tus envíos
                                    </h2>

                                </div>


                                <div className="estadisticas-grid">


                                    {/* TOTAL */}

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


                                    {/* EN CAMINO */}

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


                                    {/* ENTREGADOS */}

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


                                    {/* PENDIENTES */}

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


                            {/* ACCIONES RÁPIDAS */}

                            <section className="acciones">

                                <h2>
                                    Acciones rápidas
                                </h2>


                                <div className="acciones-grid">


                                    {/* REGISTRAR PAQUETE */}

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

                                        <button
                                            onClick={() => cambiarMenu("paquete")}
                                        >
                                            Comenzar →
                                        </button>

                                    </div>


                                    {/* MIS ENVÍOS */}

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

                                        <button
                                            onClick={() => cambiarMenu("envios")}
                                        >
                                            Ver envíos →
                                        </button>

                                    </div>


                                    {/* RASTREAR */}

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

                                        <button
                                            onClick={() => cambiarMenu("rastreo")}
                                        >
                                            Rastrear →
                                        </button>

                                    </div>


                                    {/* PERFIL */}

                                    <div className="accion-card">

                                        <div className="accion-icono">
                                            👤
                                        </div>

                                        <h3>
                                            Mi Perfil
                                        </h3>

                                        <p>
                                            Consulta tus datos
                                            personales.
                                        </p>

                                        <button
                                            onClick={() => cambiarMenu("perfil")}
                                        >
                                            Ver perfil →
                                        </button>

                                    </div>

                                </div>

                            </section>


                            {/* ÚLTIMOS ENVÍOS */}

                            <section className="ultimos-envios">

                                <div className="envios-header">

                                    <h2>
                                        Últimos envíos
                                    </h2>

                                    <button
                                        onClick={() => cambiarMenu("envios")}
                                    >
                                        Ver todos mis envíos →
                                    </button>

                                </div>


                                <div className="tabla-envios">

                                    {cargandoEnvios ? (

                                        <p>
                                            Cargando envíos...
                                        </p>

                                    ) : errorEnvios ? (

                                        <p>
                                            {errorEnvios}
                                        </p>

                                    ) : envios.length === 0 ? (

                                        <p>
                                            Aún no tienes envíos registrados.
                                        </p>

                                    ) : (

                                        <table>

                                            <thead>

                                                <tr>

                                                    <th>
                                                        Código de guía
                                                    </th>

                                                    <th>
                                                        Tipo de envío
                                                    </th>

                                                    <th>
                                                        Cantidad
                                                    </th>

                                                    <th>
                                                        Estado
                                                    </th>

                                                    <th>
                                                        Paquetes
                                                    </th>

                                                </tr>

                                            </thead>


                                            <tbody>

                                                {envios.slice(0, 4).map(
                                                    (envio) => (

                                                        <tr
                                                            key={envio.id_pedido}
                                                        >

                                                            <td>
                                                                {envio.codigo_rastreo}
                                                            </td>

                                                            <td>
                                                                {envio.tipo_envio}
                                                            </td>

                                                            <td>
                                                                {envio.cantidad}
                                                            </td>

                                                            <td>

                                                                <span
                                                                    className={`estado estado-${envio.estado
                                                                        ?.toLowerCase()
                                                                        .replaceAll(
                                                                            " ",
                                                                            "-"
                                                                        )}`}
                                                                >
                                                                    {envio.estado}
                                                                </span>

                                                            </td>

                                                            <td>
                                                                {envio.paquetes_registrados}
                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    )}

                                </div>

                            </section>

                        </>

                    )}


                    {/* ==================================================
                        MI PERFIL
                    ================================================== */}

                    {menuActivo === "perfil" && (

                        <section className="usuario-bienvenida">

                            <div className="bienvenida-texto">

                                <h1>
                                    Mi Perfil
                                </h1>

                                {cargandoPerfil ? (

                                    <p>
                                        Cargando información...
                                    </p>

                                ) : errorPerfil ? (

                                    <p>
                                        {errorPerfil}
                                    </p>

                                ) : usuario ? (

                                    <div className="perfil-datos">

                                        <p>
                                            <strong>
                                                Nombre:
                                            </strong>{" "}
                                            {usuario.nombre}
                                        </p>

                                        <p>
                                            <strong>
                                                Correo:
                                            </strong>{" "}
                                            {usuario.correo}
                                        </p>

                                        <p>
                                            <strong>
                                                Teléfono:
                                            </strong>{" "}
                                            {usuario.telefono || "No registrado"}
                                        </p>

                                        <p>
                                            <strong>
                                                Tipo de documento:
                                            </strong>{" "}
                                            {usuario.tipo_documento}
                                        </p>

                                        <p>
                                            <strong>
                                                Número de documento:
                                            </strong>{" "}
                                            {usuario.num_documento}
                                        </p>

                                        <p>
                                            <strong>
                                                Dirección:
                                            </strong>{" "}
                                            {usuario.direccion || "No registrada"}
                                        </p>

                                    </div>

                                ) : null}

                            </div>


                            <div className="bienvenida-imagen">

                                <div className="paquete-imagen">
                                    👤
                                </div>

                            </div>

                        </section>

                    )}


                    {/* ==================================================
                        MIS ENVÍOS
                    ================================================== */}

                    {menuActivo === "envios" && (

                        <section className="ultimos-envios">

                            <div className="envios-header">

                                <h2>
                                    Mis Envíos
                                </h2>

                                <button onClick={cargarEnvios}>
                                    🔄 Actualizar
                                </button>

                            </div>


                            {cargandoEnvios ? (

                                <p>
                                    Cargando tus envíos...
                                </p>

                            ) : errorEnvios ? (

                                <p>
                                    {errorEnvios}
                                </p>

                            ) : envios.length === 0 ? (

                                <p>
                                    Aún no tienes envíos registrados.
                                </p>

                            ) : (

                                <div className="tabla-envios">

                                    <table>

                                        <thead>

                                            <tr>

                                                <th>
                                                    Código de guía
                                                </th>

                                                <th>
                                                    Tipo de envío
                                                </th>

                                                <th>
                                                    Cantidad
                                                </th>

                                                <th>
                                                    Paquetes registrados
                                                </th>

                                                <th>
                                                    Estado
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {envios.map((envio) => (

                                                <tr
                                                    key={envio.id_pedido}
                                                >

                                                    <td>
                                                        {envio.codigo_rastreo}
                                                    </td>

                                                    <td>
                                                        {envio.tipo_envio}
                                                    </td>

                                                    <td>
                                                        {envio.cantidad}
                                                    </td>

                                                    <td>
                                                        {envio.paquetes_registrados}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={`estado estado-${envio.estado
                                                                ?.toLowerCase()
                                                                .replaceAll(
                                                                    " ",
                                                                    "-"
                                                                )}`}
                                                        >
                                                            {envio.estado}
                                                        </span>

                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </section>

                    )}


                    {/* ==================================================
                        SECCIONES TODAVÍA NO CONECTADAS
                    ================================================== */}

                    {menuActivo === "paquete" && (

                        <section className="usuario-bienvenida">

                            <div className="bienvenida-texto">

                                <h1>
                                    Registrar Paquete
                                </h1>

                                <p>
                                    Desde aquí podrás registrar un nuevo
                                    paquete y realizar tu envío.
                                </p>

                                <p>
                                    Esta sección la conectaremos con
                                    FastAPI en el siguiente paso.
                                </p>

                            </div>

                            <div className="bienvenida-imagen">

                                <div className="paquete-imagen">
                                    📦
                                </div>

                            </div>

                        </section>

                    )}


                    {menuActivo === "rastreo" && (

                        <section className="usuario-bienvenida">

                            <div className="bienvenida-texto">

                                <h1>
                                    Rastrear Envío
                                </h1>

                                <p>
                                    Aquí podrás consultar el estado de
                                    tu envío mediante el código de rastreo.
                                </p>

                                <p>
                                    Esta sección la conectaremos con
                                    FastAPI en el siguiente paso.
                                </p>

                            </div>

                            <div className="bienvenida-imagen">

                                <div className="paquete-imagen">
                                    🔍
                                </div>

                            </div>

                        </section>

                    )}


                    {menuActivo === "direcciones" && (

                        <section className="usuario-bienvenida">

                            <div className="bienvenida-texto">

                                <h1>
                                    Direcciones
                                </h1>

                                <p>
                                    Aquí podrás administrar tus direcciones
                                    de envío.
                                </p>

                                <p>
                                    Esta sección la conectaremos con
                                    FastAPI posteriormente.
                                </p>

                            </div>

                            <div className="bienvenida-imagen">

                                <div className="paquete-imagen">
                                    📍
                                </div>

                            </div>

                        </section>

                    )}


                    {menuActivo === "notificaciones" && (

                        <section className="usuario-bienvenida">

                            <div className="bienvenida-texto">

                                <h1>
                                    Notificaciones
                                </h1>

                                <p>
                                    Aquí aparecerán las notificaciones
                                    relacionadas con tus envíos.
                                </p>

                                <p>
                                    Esta sección la conectaremos con
                                    FastAPI posteriormente.
                                </p>

                            </div>

                            <div className="bienvenida-imagen">

                                <div className="paquete-imagen">
                                    🔔
                                </div>

                            </div>

                        </section>

                    )}

                </main>

            </div>

        </div>
    );
}