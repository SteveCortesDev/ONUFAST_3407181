import { useState } from "react";
import "./CSS/Conductor.css";

import DashboardConductor from "./DashboardConductor";
import MisRutas from "./MisRutas";
import MisEntregas from "./MisEntregas";
import PerfilConductor from "./PerfilConductor";

/* ==========================================
   ICONOS (SVG propios, sin instalar librerías)
   Todos usan currentColor, así heredan el color del botón
========================================== */

const props = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const IconInicio = () => (
  <svg {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const IconRutas = () => (
  <svg {...props}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

const IconEntregas = () => (
  <svg {...props}>
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8z" />
    <path d="M3 8l9 5 9-5" />
    <path d="M12 13v8" />
  </svg>
);

const IconPerfil = () => (
  <svg {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const IconSalir = () => (
  <svg {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

/* ==========================================
   OPCIONES DEL MENÚ
   Para agregar una sección nueva, solo añade un objeto aquí
========================================== */

const OPCIONES_MENU = [
  { id: "dashboard", texto: "Inicio", Icono: IconInicio },
  { id: "rutas", texto: "Mis rutas", Icono: IconRutas },
  { id: "entregas", texto: "Mis entregas", Icono: IconEntregas },
  { id: "perfil", texto: "Mi perfil", Icono: IconPerfil },
];

export default function Conductor() {
  const [seccionActiva, setSeccionActiva] = useState("dashboard");


  // Si hay nombre guardado en el login lo usamos; si no, "Conductor"
  const nombre = localStorage.getItem("nombre_usuario") || "Conductor";
  const inicial = nombre.trim().charAt(0).toUpperCase();

  const cerrarSesion = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("nombre_usuario");
  localStorage.removeItem("id_usuario");

  window.location.replace("/");
};

  return (
    <div className="conductor-container">
      {/* BARRA LATERAL */}
      <aside className="conductor-sidebar">
        <div className="conductor-logo">
          <img src="/LOGO_ONUFAST.jpg" alt="ONUFAST" />
        </div>

        

        <nav className="conductor-menu" aria-label="Menú del conductor">
          {OPCIONES_MENU.map(({ id, texto, Icono }) => (
            <button
              key={id}
              type="button"
              className={seccionActiva === id ? "activo" : ""}
              aria-current={seccionActiva === id ? "page" : undefined}
              onClick={() => setSeccionActiva(id)}
            >
              <Icono />
              <span>{texto}</span>
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="conductor-logout"
          onClick={cerrarSesion}
        >
          <IconSalir />
          <span>Cerrar sesión</span>
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="conductor-main">
        <header className="conductor-header">
          <div>
            <h2>Panel del conductor</h2>
            <p>Gestiona tus rutas y entregas desde aquí.</p>
          </div>

          <div className="conductor-header-user">
            <span>{nombre}</span>
            <div className="conductor-avatar conductor-avatar--sm">
              {inicial}
            </div>
          </div>
        </header>

        <section className="conductor-content">
          {seccionActiva === "dashboard" && <DashboardConductor />}
          {seccionActiva === "rutas" && <MisRutas />}
          {seccionActiva === "entregas" && <MisEntregas />}
          {seccionActiva === "perfil" && <PerfilConductor />}
        </section>
      </main>
    </div>
  );
}