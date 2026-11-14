
import { useState } from "react";
import "./CSS/Conductor.css";

import DashboardConductor from "./DashboardConductor";
import MisRutas from "./MisRutas";
import MisEntregas from "./MisEntregas";
import PerfilConductor from "./PerfilConductor";


export default function Conductor() {
  const [seccionActiva, setSeccionActiva] = useState("dashboard");

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre_usuario");
    localStorage.removeItem("id_usuario");

    window.location.href = "/";
  };

  return (
    <div className="conductor-container">

      {/* BARRA LATERAL */}
      <aside className="conductor-sidebar">

        <div className="conductor-logo">
          <img
            src="/LOGO_ONUFAST.jpg"
            alt="Logo ONUFAST"
          />
        </div>

        <div className="conductor-info">
          <div className="foto-perfil">
            <img
                src="/public/foto-perfil.avif"
                alt="Foto de perfil del conductor"
                
            />
          </div>
          <h3>Conductor</h3>
          <span>Panel de trabajo</span>
        </div>

        <nav className="conductor-menu">

          <button
            className={seccionActiva === "dashboard" ? "activo" : ""}
            onClick={() => setSeccionActiva("dashboard")}
          >
            <span>▦</span> Inicio
          </button>

          <button
            className={seccionActiva === "rutas" ? "activo" : ""}
            onClick={() => setSeccionActiva("rutas")}
          >
            <span>⌖</span> Mis rutas
          </button>

          <button
            className={seccionActiva === "entregas" ? "activo" : ""}
            onClick={() => setSeccionActiva("entregas")}
          >
            <span>□</span> Mis entregas
          </button>

          <button
            className={seccionActiva === "perfil" ? "activo" : ""}
            onClick={() => setSeccionActiva("perfil")}
          >
            <span>♙</span> Mi perfil
          </button>

        </nav>

        <button className="conductor-logout" onClick={cerrarSesion}>
          ↪ Cerrar sesión
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
            <span>Conductor</span>
            <div className="conductor-avatar pequeño">C</div>
          </div>
        </header>

        <section className="conductor-content">

          {seccionActiva === "dashboard" && (
            <DashboardConductor />
          )}

          {seccionActiva === "rutas" && (
            <MisRutas />
          )}

          {seccionActiva === "entregas" && (
            <MisEntregas/>
          )}

          {seccionActiva === "perfil" && (
            <PerfilConductor/>
          )}

        </section>

      </main>

    </div>
  );
}
