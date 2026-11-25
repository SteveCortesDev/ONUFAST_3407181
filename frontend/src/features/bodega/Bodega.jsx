import { useCallback, useEffect, useState } from "react";
import api from "@/shared/api";

import "./CSS/Bodega.css";

import DashboardBodega from "./DashboardBodega";
import RecepcionPaquetes from "./RecepcionPaquetes";
import PaquetesBodega from "./PaquetesBodega";
import DespachosBodega from "./DespachosBodega";
import PerfilBodega from "./PerfilBodega";

import { mensajeError } from "./datosBodega";

// ============================================
// TÍTULOS DE CADA SECCIÓN
// ============================================

const SECCIONES = {
  inicio: {
    titulo: "Panel de bodega",
    descripcion: "Controla la recepción, el almacenamiento y el despacho de paquetes."
  },
  recepcion: {
    titulo: "Recepción de paquetes",
    descripcion: "Registra los paquetes que llegan a la bodega."
  },
  paquetes: {
    titulo: "Paquetes en bodega",
    descripcion: "Consulta y actualiza el estado de cada paquete."
  },
  despachos: {
    titulo: "Despachos",
    descripcion: "Asigna paquetes a las rutas y despacha los vehículos."
  },
  perfil: {
    titulo: "Mi perfil",
    descripcion: "Consulta tu información como encargado de bodega."
  }
};

const DATOS_VACIOS = {
  resumen: null,
  paquetes: [],
  pendientes: [],
  rutas: [],
  sinRuta: [],
  perfil: null
};

export default function Bodega() {
  const [seccionActiva, setSeccionActiva] = useState("inicio");

  const [datos, setDatos] = useState(DATOS_VACIOS);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [sesionVencida, setSesionVencida] = useState(false);

  const seccion = SECCIONES[seccionActiva];

  // ─────────────────────────────────────────
  // CARGAR TODO DESDE LA BASE DE DATOS
  // ─────────────────────────────────────────

  const cargar = useCallback(async () => {
    setError("");

    try {
      const [
        resumen,
        paquetes,
        recepciones,
        despachos,
        perfil
      ] = await Promise.all([
        api.get("/bodega/resumen"),
        api.get("/bodega/paquetes"),
        api.get("/bodega/recepciones"),
        api.get("/bodega/despachos"),
        api.get("/bodega/perfil")
      ]);

      setDatos({
        resumen: resumen.data,
        paquetes: paquetes.data.paquetes || [],
        pendientes: recepciones.data.pendientes || [],
        rutas: despachos.data.rutas || [],
        sinRuta: despachos.data.sin_ruta || [],
        perfil: perfil.data
      });

      setSesionVencida(false);

    } catch (err) {
      if (err?.response?.status === 401) {
        setSesionVencida(true);
      } else {
        setError(mensajeError(err, "No se pudieron cargar los datos de bodega."));
      }
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const nombre =
    datos.perfil?.nombre_completo ||
    localStorage.getItem("nombre_usuario") ||
    "Encargado de bodega";

  const inicial = nombre.trim().charAt(0).toUpperCase();

  // ─────────────────────────────────────────
  // ACCIONES CONTRA LA API
  // ─────────────────────────────────────────

  const registrarPaquete = async (paquete) => {
    const { data } = await api.post("/bodega/paquetes", paquete);
    await cargar();
    return data;
  };

  const recibirPaquete = async (idPaquete) => {
    const { data } = await api.post(
      `/bodega/recepciones/${idPaquete}/recibir`
    );
    await cargar();
    return data;
  };

  const cambiarEstado = async (idPaquete, estado) => {
    const { data } = await api.patch(
      `/bodega/paquetes/${idPaquete}/estado`,
      { estado }
    );
    await cargar();
    return data;
  };

  const asignarPaquete = async (idRutas, idPaquete) => {
    const { data } = await api.post("/bodega/despachos/asignar", {
      id_rutas: idRutas,
      id_paquete: idPaquete
    });
    await cargar();
    return data;
  };

  const quitarPaquete = async (idPaquete, idRutas) => {
    const { data } = await api.post("/bodega/despachos/quitar", {
      id_paquete: idPaquete,
      id_rutas: idRutas
    });
    await cargar();
    return data;
  };

  const despacharRuta = async (idRutas) => {
    const { data } = await api.post(
      `/bodega/despachos/${idRutas}/despachar`
    );
    await cargar();
    return data;
  };

  // ─────────────────────────────────────────
  // CERRAR SESIÓN
  // ─────────────────────────────────────────

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre_usuario");
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("id_rol");
    localStorage.removeItem("nombre_rol");

    window.location.replace("/");
  };

  // ─────────────────────────────────────────
  // SESIÓN VENCIDA
  // ─────────────────────────────────────────

  if (sesionVencida) {
    return (
      <div className="bodega-container">
        <main className="bodega-main">
          <section className="bodega-content">
            <div className="bodega-card bodega-estado-pantalla">
              <span className="bodega-card-icono">🔐</span>

              <h2>Tu sesión expiró</h2>

              <p>
                Vuelve a iniciar sesión para entrar al panel de bodega con los
                datos reales de la base de datos.
              </p>

              <button className="btn-primario" onClick={cerrarSesion}>
                Volver al inicio de sesión
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="bodega-container">

      {/* BARRA LATERAL */}
      <aside className="bodega-sidebar">

        <div className="bodega-logo">
          <img src="/LOGO_ONUFAST.jpg" alt="Logo ONUFAST" />
        </div>

        <div className="bodega-info">
          <div className="bodega-avatar">{inicial}</div>
          <h3>{nombre}</h3>
          <span>Encargado de bodega</span>
        </div>

        <nav className="bodega-menu">
          <button
            className={seccionActiva === "inicio" ? "activo" : ""}
            onClick={() => setSeccionActiva("inicio")}
          >
            <span>▦</span> Inicio
          </button>

          <button
            className={seccionActiva === "recepcion" ? "activo" : ""}
            onClick={() => setSeccionActiva("recepcion")}
          >
            <span>⊕</span> Recepción
          </button>

          <button
            className={seccionActiva === "paquetes" ? "activo" : ""}
            onClick={() => setSeccionActiva("paquetes")}
          >
            <span>▤</span> Paquetes en bodega
          </button>

          <button
            className={seccionActiva === "despachos" ? "activo" : ""}
            onClick={() => setSeccionActiva("despachos")}
          >
            <span>⇥</span> Despachos
          </button>

          <button
            className={seccionActiva === "perfil" ? "activo" : ""}
            onClick={() => setSeccionActiva("perfil")}
          >
            <span>♙</span> Mi perfil
          </button>
        </nav>

        <button className="bodega-logout" onClick={cerrarSesion}>
          ↪ Cerrar sesión
        </button>

      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="bodega-main">

        <header className="bodega-header">
          <div>
            <h2>{seccion.titulo}</h2>
            <p>{seccion.descripcion}</p>
          </div>

          <div className="bodega-header-user">
            <span>{nombre}</span>
            <div className="bodega-avatar pequeño">{inicial}</div>
          </div>
        </header>

        <section className="bodega-content">

          {error && (
            <div className="bodega-aviso error">
              <span>{error}</span>
              <button className="btn-secundario" onClick={cargar}>
                Reintentar
              </button>
            </div>
          )}

          {cargando && (
            <p className="bodega-cargando">
              Cargando datos de la base de datos…
            </p>
          )}

          {!cargando && seccionActiva === "inicio" && (
            <DashboardBodega
              resumen={datos.resumen}
              paquetes={datos.paquetes}
              rutas={datos.rutas}
              onIrA={setSeccionActiva}
            />
          )}

          {!cargando && seccionActiva === "recepcion" && (
            <RecepcionPaquetes
              pendientes={datos.pendientes}
              onRegistrar={registrarPaquete}
              onRecibir={recibirPaquete}
            />
          )}

          {!cargando && seccionActiva === "paquetes" && (
            <PaquetesBodega
              paquetes={datos.paquetes}
              onCambiarEstado={cambiarEstado}
            />
          )}

          {!cargando && seccionActiva === "despachos" && (
            <DespachosBodega
              rutas={datos.rutas}
              sinRuta={datos.sinRuta}
              onAsignar={asignarPaquete}
              onQuitar={quitarPaquete}
              onDespachar={despacharRuta}
            />
          )}

          {!cargando && seccionActiva === "perfil" && (
            <PerfilBodega perfil={datos.perfil} />
          )}

        </section>

      </main>

    </div>
  );
}
