import { useState } from "react";
import "./CSS/Bodega.css";

import DashboardBodega from "./DashboardBodega";
import RecepcionPaquetes from "./RecepcionPaquetes";
import PaquetesBodega from "./PaquetesBodega";
import DespachosBodega from "./DespachosBodega";
import PerfilBodega from "./PerfilBodega";

import { PAQUETES_INICIALES, RUTAS_INICIALES } from "./datosBodega";

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

export default function Bodega() {
  const [seccionActiva, setSeccionActiva] = useState("inicio");

  // Estado compartido del módulo: paquetes y rutas
  const [paquetes, setPaquetes] = useState(PAQUETES_INICIALES);
  const [rutas, setRutas] = useState(RUTAS_INICIALES);

  const seccion = SECCIONES[seccionActiva];

  const nombre =
    localStorage.getItem("nombre_usuario") ||
    localStorage.getItem("nombre") ||
    "Encargado de bodega";

  // ─────────────────────────────────────────
  // REGISTRAR PAQUETE
  // ─────────────────────────────────────────

  const registrarPaquete = (nuevo) => {
    setPaquetes((prev) => {
      const idMayor = prev.reduce(
        (mayor, p) => Math.max(mayor, p.id_paquete),
        0
      );

      return [
        { ...nuevo, id_paquete: idMayor + 1, estado: "En bodega", rutaId: null },
        ...prev
      ];
    });
  };

  // ─────────────────────────────────────────
  // CAMBIAR ESTADO DE UN PAQUETE
  // ─────────────────────────────────────────

  const cambiarEstado = (idPaquete, nuevoEstado) => {
    setPaquetes((prev) =>
      prev.map((p) =>
        p.id_paquete === idPaquete ? { ...p, estado: nuevoEstado } : p
      )
    );
  };

  // ─────────────────────────────────────────
  // ASIGNAR / QUITAR PAQUETE DE UNA RUTA
  // ─────────────────────────────────────────

  const asignarPaquete = (rutaId, idPaquete) => {
    setPaquetes((prev) =>
      prev.map((p) => (p.id_paquete === idPaquete ? { ...p, rutaId } : p))
    );
  };

  const quitarPaquete = (idPaquete) => {
    setPaquetes((prev) =>
      prev.map((p) => (p.id_paquete === idPaquete ? { ...p, rutaId: null } : p))
    );
  };

  // ─────────────────────────────────────────
  // DESPACHAR UNA RUTA
  // ─────────────────────────────────────────

  const despacharRuta = (rutaId) => {
    setPaquetes((prev) =>
      prev.map((p) =>
        p.rutaId === rutaId && p.estado === "En bodega"
          ? { ...p, estado: "En tránsito" }
          : p
      )
    );

    setRutas((prev) =>
      prev.map((r) =>
        r.id === rutaId ? { ...r, estado: "Despachada" } : r
      )
    );
  };

  // ─────────────────────────────────────────
  // CERRAR SESIÓN
  // ─────────────────────────────────────────

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre_usuario");
    localStorage.removeItem("id_usuario");

    window.location.href = "/";
  };

  return (
    <div className="bodega-container">

      {/* BARRA LATERAL */}
      <aside className="bodega-sidebar">

        <div className="bodega-logo">
          <img src="/LOGO_ONUFAST.jpg" alt="Logo ONUFAST" />
        </div>

        <div className="bodega-info">
          <div className="bodega-avatar">B</div>
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
            <div className="bodega-avatar pequeño">B</div>
          </div>
        </header>

        <section className="bodega-content">

          {seccionActiva === "inicio" && (
            <DashboardBodega
              paquetes={paquetes}
              rutas={rutas}
              onIrA={setSeccionActiva}
            />
          )}

          {seccionActiva === "recepcion" && (
            <RecepcionPaquetes
              paquetes={paquetes}
              onRegistrar={registrarPaquete}
            />
          )}

          {seccionActiva === "paquetes" && (
            <PaquetesBodega
              paquetes={paquetes}
              rutas={rutas}
              onCambiarEstado={cambiarEstado}
            />
          )}

          {seccionActiva === "despachos" && (
            <DespachosBodega
              paquetes={paquetes}
              rutas={rutas}
              onAsignar={asignarPaquete}
              onQuitar={quitarPaquete}
              onDespachar={despacharRuta}
            />
          )}

          {seccionActiva === "perfil" && <PerfilBodega />}

        </section>

      </main>

    </div>
  );
}
