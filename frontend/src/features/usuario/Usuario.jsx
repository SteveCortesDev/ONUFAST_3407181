import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "@/shared/api";
import "@/styles/Usuarios.css";

import PanelUsuario from "./PanelUsuario";
import MenuUsuario from "./MenuUsuario";
import MiPerfil from "./MiPerfil";
import MisEnvios from "./MisEnvios";
import RegistrarPaquete from "./RegistrarPaquete";
import Rastreo from "@/features/envios/Rastreo";

// ============================================
// EXTRAER MENSAJE DE ERROR
// ============================================

const extraerMensajeError = (error) => {

    const detail = error.response?.data?.detail;

    if (typeof detail === "string") {
        return detail;
    }

    if (Array.isArray(detail)) {
        return detail
            .map((d) => d.msg)
            .join(", ");
    }

    return "Ocurrió un error inesperado.";
};


// ============================================
// COMPONENTE USUARIO
// ============================================

export default function Usuario() {

    const navigate = useNavigate();


    // ============================================
    // ESTADOS
    // ============================================

    const [menuActivo, setMenuActivo] =
        useState("panel");

    const [usuario, setUsuario] =
        useState(null);

    const [envios, setEnvios] =
        useState([]);

    const [cargandoPerfil, setCargandoPerfil] =
        useState(true);

    const [cargandoEnvios, setCargandoEnvios] =
        useState(true);

    const [errorPerfil, setErrorPerfil] =
        useState("");

    const [errorEnvios, setErrorEnvios] =
        useState("");


    // ============================================
    // CARGAR INFORMACIÓN
    // ============================================

    useEffect(() => {

        cargarPerfil();
        cargarEnvios();

    }, []);


    // ============================================
    // OBTENER PERFIL
    // GET /usuarios/perfil
    // ============================================

    const cargarPerfil = async () => {

        try {

            setCargandoPerfil(true);
            setErrorPerfil("");

            const response = await api.get("/usuarios/perfil");

            if (response.data.id_rol === 1) {
                navigate("/admin");
                return;
            }

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
    // OBTENER ENVÍOS
    // GET /envios/mis-pedidos
    // ============================================

    const cargarEnvios = async () => {

        try {

            setCargandoEnvios(true);
            setErrorEnvios("");

            const response =
                await api.get(
                    "/envios/mis-pedidos"
                );

            setEnvios(
                response.data.pedidos || []
            );

        } catch (error) {

            console.error(
                "Error al cargar envíos:",
                error
            );

            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "nombre_usuario"
                );

                localStorage.removeItem(
                    "id_usuario"
                );

                navigate("/");

            } else {

                setErrorEnvios(
                    extraerMensajeError(error)
                );
            }

        } finally {

            setCargandoEnvios(false);
        }
    };


    // ============================================
    // ESTADÍSTICAS
    // ============================================

    const estadisticas = {

        total:
            envios.length,

        camino:
            envios.filter(
                (envio) =>
                    envio.estado?.toUpperCase() ===
                        "EN CAMINO" ||
                    envio.estado?.toUpperCase() ===
                        "EN_CAMINO"
            ).length,

        entregados:
            envios.filter(
                (envio) =>
                    envio.estado?.toUpperCase() ===
                    "ENTREGADO"
            ).length,

        pendientes:
            envios.filter(
                (envio) =>
                    envio.estado?.toUpperCase() ===
                    "PENDIENTE"
            ).length
    };


    // ============================================
    // CERRAR SESIÓN
    // ============================================

    const cerrarSesion = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "nombre_usuario"
        );

        localStorage.removeItem(
            "id_usuario"
        );

        navigate("/");
    };


    // ============================================
    // CAMBIAR MENÚ
    // ============================================

    const cambiarMenu = (seccion) => {

        setMenuActivo(seccion);
    };


    // ============================================
    // RENDER
    // ============================================

    return (

        <div className="usuario-panel">

            {/* ========================================
                HEADER
            ======================================== */}

            <header className="usuario-header">

                <div className="usuario-logo">

                    <Link to="/">

                        <img
                            src="/logo_calidad_onufast.jpg"
                            alt="ONUFAST"
                        />

                    </Link>

                </div>

                <div className="usuario-header-right">

                    <div className="usuario-cuenta">

                        <div className="usuario-icono">
                            👤
                        </div>

                        <div>

                            <strong>
                                {usuario?.nombre ||
                                    "Cargando..."}
                            </strong>

                            <small>
                                Mi cuenta
                            </small>

                        </div>

                    </div>

                </div>

            </header>

            {/* ========================================
                CUERPO
            ======================================== */}

            <div className="usuario-body">

                <MenuUsuario
                    menuActivo={menuActivo}
                    cambiarMenu={cambiarMenu}
                    navigate={navigate}
                    cerrarSesion={cerrarSesion}
                />

                <main className="usuario-contenido">

                    {menuActivo === "panel" && (

                        <PanelUsuario
                            usuario={usuario}
                            estadisticas={
                                estadisticas
                            }
                            envios={envios}
                            cargandoEnvios={
                                cargandoEnvios
                            }
                            errorEnvios={
                                errorEnvios
                            }
                            cambiarMenu={
                                cambiarMenu
                            }
                            navigate={navigate}
                        />

                    )}

                    {menuActivo === "paquete" && (

                        <RegistrarPaquete
                            cargarEnvios={
                                cargarEnvios
                            }
                        />

                    )}

                    {menuActivo === "perfil" && (

                        <MiPerfil
                            usuario={usuario}
                            cargandoPerfil={
                                cargandoPerfil
                            }
                            errorPerfil={
                                errorPerfil
                            }
                        />

                    )}

                    {menuActivo === "envios" && (

                        <MisEnvios
                            envios={envios}
                            cargandoEnvios={
                                cargandoEnvios
                            }
                            errorEnvios={
                                errorEnvios
                            }
                            cargarEnvios={
                                cargarEnvios
                            }
                        />

                    )}

                    {menuActivo === "rastreo" && (
                        <Rastreo />
                    )}

                </main>

            </div>

        </div>
    );
}