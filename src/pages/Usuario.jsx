import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./Usuarios.css";
import Rastreo from "./Rastreo";


const extraerMensajeError = (error) => {
    const detail = error.response?.data?.detail;

    if (typeof detail === "string") return detail;

    if (Array.isArray(detail)) {
        return detail.map((d) => d.msg).join(", ");
    }

    return "Ocurrió un error inesperado.";
};

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

    // Registrar Paquete
const [tiposEnvio, setTiposEnvio] = useState([]);
const [cargandoTipos, setCargandoTipos] = useState(true);

const [formPaquete, setFormPaquete] = useState({
    id_tipenvio: "",
    nombre_destinatario: "",
    documento_destinatario: "",
    peso: "",
    alto: "",
    largo: "",
    ancho: "",
    descripcion: "",
    origen: "",
    destino: ""
});

const [enviandoPaquete, setEnviandoPaquete] = useState(false);
const [mensajePaquete, setMensajePaquete] = useState("");
const [errorPaquete, setErrorPaquete] = useState("");


    // ============================================
    // CARGAR INFORMACIÓN AL ABRIR EL PANEL
    // ============================================

    useEffect(() => {
        cargarPerfil();
        cargarEnvios();
        cargarTiposEnvio(); 
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

                setErrorPerfil(extraerMensajeError(error));
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

                setErrorEnvios(extraerMensajeError(error));
            }

        } finally {

            setCargandoEnvios(false);

        }
    };

    const cargarTiposEnvio = async () => {
    try {
        setCargandoTipos(true);
        const response = await api.get("/tipos-envio/");
        setTiposEnvio(response.data);
    } catch (error) {
        console.error("Error al cargar tipos de envío:", error);
    } finally {
        setCargandoTipos(false);
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

    const handleChangePaquete = (e) => {
    const { name, value } = e.target;
    setFormPaquete((prev) => ({ ...prev, [name]: value }));
};

const enviarPaquete = async (e) => {
    e.preventDefault();

    setEnviandoPaquete(true);
    setErrorPaquete("");
    setMensajePaquete("");

    try {
        const response = await api.post("/envios/registrar-paquete", {
            id_tipenvio: Number(formPaquete.id_tipenvio),
            nombre_destinatario: formPaquete.nombre_destinatario,
            documento_destinatario: formPaquete.documento_destinatario,
            peso: Number(formPaquete.peso),
            alto: Number(formPaquete.alto),
            largo: Number(formPaquete.largo),
            ancho: Number(formPaquete.ancho),
            descripcion: formPaquete.descripcion || null,
            origen: formPaquete.origen,
            destino: formPaquete.destino
        });

        setMensajePaquete(
            `¡Paquete registrado! Código de rastreo: ${response.data.codigo_rastreo}`
        );

        // Limpiar formulario
        setFormPaquete({
            id_tipenvio: "",
            nombre_destinatario: "",
            documento_destinatario: "",
            peso: "",
            alto: "",
            largo: "",
            ancho: "",
            descripcion: "",
            origen: "",
            destino: ""
        });

        // Refrescar la lista de envíos
        cargarEnvios();

    } catch (error) {
        console.error("Error al registrar paquete:", error);
        setErrorPaquete(extraerMensajeError(error));
    } finally {
        setEnviandoPaquete(false);
    }
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
                        className="sidebar-item"
                        onClick={() => navigate("/rastreo")}
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
                    ¡Hola, {usuario?.nombre?.split(" ")[0] || "usuario"}!
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
                <div className="paquete-imagen">📦</div>
            </div>

        </section>


        {/* RESUMEN DE ENVÍOS */}
        <section className="resumen">

            <div className="seccion-titulo">
                <h2>Resumen de tus envíos</h2>
            </div>

            <div className="estadisticas-grid">

                <div className="estadistica-card">
                    <div className="estadistica-icono">📦</div>
                    <div>
                        <strong>{estadisticas.total}</strong>
                        <span>Total enviados</span>
                    </div>
                </div>

                <div className="estadistica-card">
                    <div className="estadistica-icono">🚚</div>
                    <div>
                        <strong>{estadisticas.camino}</strong>
                        <span>En camino</span>
                    </div>
                </div>

                <div className="estadistica-card">
                    <div className="estadistica-icono">✓</div>
                    <div>
                        <strong>{estadisticas.entregados}</strong>
                        <span>Entregados</span>
                    </div>
                </div>

                <div className="estadistica-card">
                    <div className="estadistica-icono">◷</div>
                    <div>
                        <strong>{estadisticas.pendientes}</strong>
                        <span>Pendientes</span>
                    </div>
                </div>

            </div>

        </section>


        {/* ACCIONES RÁPIDAS */}
        <section className="acciones">

            <h2>Acciones rápidas</h2>

            <div className="acciones-grid">

                <div className="accion-card">
                    <div className="accion-icono">📦</div>
                    <h3>Registrar Paquete</h3>
                    <p>Crea un nuevo paquete y realiza un envío.</p>
                    <button onClick={() => cambiarMenu("paquete")}>Comenzar →</button>
                </div>

                <div className="accion-card">
                    <div className="accion-icono">🚚</div>
                    <h3>Mis Envíos</h3>
                    <p>Consulta y administra todos tus envíos.</p>
                    <button onClick={() => cambiarMenu("envios")}>Ver envíos →</button>
                </div>

                <div className="accion-card">
                    <div className="accion-icono">🔍</div>
                    <h3>Rastrear Envío</h3>
                    <p>Ingresa tu código de guía y consulta el estado.</p>
                    <button onClick={() => navigate("/rastreo")}>Rastrear →</button>
                </div>

                <div className="accion-card">
                    <div className="accion-icono">👤</div>
                    <h3>Mi Perfil</h3>
                    <p>Consulta tus datos personales.</p>
                    <button onClick={() => cambiarMenu("perfil")}>Ver perfil →</button>
                </div>

            </div>

        </section>


        {/* ÚLTIMOS ENVÍOS */}
        <section className="ultimos-envios">

            <div className="envios-header">
                <h2>Últimos envíos</h2>
                <button onClick={() => cambiarMenu("envios")}>
                    Ver todos mis envíos →
                </button>
            </div>

            <div className="tabla-envios">

                {cargandoEnvios ? (
                    <p>Cargando envíos...</p>
                ) : errorEnvios ? (
                    <p>{errorEnvios}</p>
                ) : envios.length === 0 ? (
                    <p>Aún no tienes envíos registrados.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Código de guía</th>
                                <th>Tipo de envío</th>
                                <th>Cantidad</th>
                                <th>Estado</th>
                                <th>Paquetes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {envios.slice(0, 4).map((envio) => (
                                <tr key={envio.id_pedido}>
                                    <td>{envio.codigo_rastreo}</td>
                                    <td>{envio.tipo_envio}</td>
                                    <td>{envio.cantidad}</td>
                                    <td>
                                        <span className={`estado estado-${envio.estado?.toLowerCase().replaceAll(" ", "-")}`}>
                                            {envio.estado}
                                        </span>
                                    </td>
                                    <td>{envio.paquetes_registrados}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

            </div>

        </section>

    </>

)}

                    {menuActivo === "paquete" && (

    <section className="usuario-bienvenida">

        <div className="bienvenida-texto" style={{ width: "100%" }}>

            <h1>Registrar Paquete</h1>

            <p>Completa los datos del destinatario y del paquete para generar tu envío.</p>

            {mensajePaquete && (
                <div style={{
                    background: "#1e3a2f",
                    color: "#4ade80",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    marginBottom: "15px"
                }}>
                    {mensajePaquete}
                </div>
            )}

            {errorPaquete && (
                <div style={{
                    background: "#3a1e1e",
                    color: "#f87171",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    marginBottom: "15px"
                }}>
                    {errorPaquete}
                </div>
            )}

            <form onSubmit={enviarPaquete}>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>

                    <div>
                        <label>Tipo de envío</label><br />
                        <select
                            name="id_tipenvio"
                            value={formPaquete.id_tipenvio}
                            onChange={handleChangePaquete}
                            required
                            style={{ width: "100%", padding: "10px" }}
                        >
                            <option value="">
                                {cargandoTipos ? "Cargando..." : "Selecciona..."}
                            </option>
                            {tiposEnvio.map((tipo) => (
                                <option key={tipo.id_tipenvio} value={tipo.id_tipenvio}>
                                    {tipo.descripcion}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Nombre del destinatario</label><br />
                        <input
                            type="text"
                            name="nombre_destinatario"
                            value={formPaquete.nombre_destinatario}
                            onChange={handleChangePaquete}
                            required
                            style={{ width: "100%", padding: "10px" }}
                        />
                    </div>

                    <div>
                        <label>Documento del destinatario</label><br />
                        <input
                            type="text"
                            name="documento_destinatario"
                            value={formPaquete.documento_destinatario}
                            onChange={handleChangePaquete}
                            required
                            style={{ width: "100%", padding: "10px" }}
                        />
                    </div>

                    <div>
                        <label>Descripción del paquete</label><br />
                        <input
                            type="text"
                            name="descripcion"
                            value={formPaquete.descripcion}
                            onChange={handleChangePaquete}
                            style={{ width: "100%", padding: "10px" }}
                        />
                    </div>

                    <div>
                        <label>Origen</label><br />
                        <input
                            type="text"
                            name="origen"
                            value={formPaquete.origen}
                            onChange={handleChangePaquete}
                            required
                            style={{ width: "100%", padding: "10px" }}
                        />
                    </div>

                    <div>
                        <label>Destino</label><br />
                        <input
                            type="text"
                            name="destino"
                            value={formPaquete.destino}
                            onChange={handleChangePaquete}
                            required
                            style={{ width: "100%", padding: "10px" }}
                        />
                    </div>

                    <div>
                        <label>Peso (kg)</label><br />
                        <input
                            type="number" step="0.01"
                            name="peso"
                            value={formPaquete.peso}
                            onChange={handleChangePaquete}
                            required
                            style={{ width: "100%", padding: "10px" }}
                        />
                    </div>

                    <div>
                        <label>Alto (cm)</label><br />
                        <input
                            type="number" step="0.01"
                            name="alto"
                            value={formPaquete.alto}
                            onChange={handleChangePaquete}
                            required
                            style={{ width: "100%", padding: "10px" }}
                        />
                    </div>

                    <div>
                        <label>Largo (cm)</label><br />
                        <input
                            type="number" step="0.01"
                            name="largo"
                            value={formPaquete.largo}
                            onChange={handleChangePaquete}
                            required
                            style={{ width: "100%", padding: "10px" }}
                        />
                    </div>

                    <div>
                        <label>Ancho (cm)</label><br />
                        <input
                            type="number" step="0.01"
                            name="ancho"
                            value={formPaquete.ancho}
                            onChange={handleChangePaquete}
                            required
                            style={{ width: "100%", padding: "10px" }}
                        />
                    </div>

                </div>

                <button
                    type="submit"
                    disabled={enviandoPaquete}
                    className="admin-btn"
                    style={{ marginTop: "20px" }}
                >
                    {enviandoPaquete ? "Registrando..." : "Registrar Paquete"}
                </button>

            </form>

        </div>

    </section>

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

                    


                    {menuActivo === "rastreo" && <Rastreo />}

                </main>

            </div>

        </div>
    );
}