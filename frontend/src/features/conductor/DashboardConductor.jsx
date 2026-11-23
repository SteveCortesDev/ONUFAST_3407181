
import { useEffect, useMemo, useState } from "react";
import api from "@/shared/api";
import "./CSS/DashboardConductor.css";

/* ==========================================
   ICONOS SVG
========================================== */

function Icono({ size = 22, children })  {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const IconRuta = (p) => (
  <Icono {...p}>
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
    <circle cx="18" cy="5" r="3" />
  </Icono>
);

const IconPaquete = (p) => (
  <Icono {...p}>
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8z" />
    <path d="M3 8l9 5 9-5" />
    <path d="M12 13v8" />
  </Icono>
);

const IconCheck = (p) => (
  <Icono {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-6" />
  </Icono>
);

const IconCamion = (p) => (
  <Icono {...p}>
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </Icono>
);

const IconReloj = (p) => (
  <Icono {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icono>
);

const IconPin = (p) => (
  <Icono {...p}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Icono>
);

const IconCalendario = (p) => (
  <Icono {...p}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M3 10h18M8 2v4M16 2v4" />
  </Icono>
);

/* ==========================================
   FUNCIONES AUXILIARES
========================================== */

// Convierte diferentes formatos de respuesta en un array.
function obtenerLista(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.resultados)) return data.resultados;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

// Normaliza los estados para evitar diferencias de mayÃºsculas.
function normalizarEstado(estado) {
  return String(estado || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Detecta si una ruta ya fue finalizada.
function rutaFinalizada(ruta) {
  const estado = normalizarEstado(
    ruta.estado ?? ruta.estado_ruta
  );

  return estado.includes("finaliz") || estado.includes("complet");
}

// Detecta si una ruta estÃ¡ en proceso.
function rutaEnProceso(ruta) {
  const estado = normalizarEstado(
    ruta.estado ?? ruta.estado_ruta
  );

  return estado.includes("proceso") || estado.includes("curso");
}

// Detecta si un envÃ­o ya fue entregado.
function envioEntregado(envio) {
  const estado = normalizarEstado(
    envio.estado ?? envio.estado_envio
  );

  return estado.includes("entreg");
}

// Detecta entregas pendientes.
function envioPendiente(envio) {
  const estado = normalizarEstado(
    envio.estado ?? envio.estado_envio
  );

  return (
    estado.includes("pendiente") ||
    estado.includes("asignado") ||
    estado.includes("por entregar")
  );
}

/* ==========================================
   COMPONENTE DASHBOARD
========================================== */

export default function DashboardConductor() {
  const [rutas, setRutas] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [perfil, setPerfil] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  /* ==========================================
     CARGAR INFORMACIÃ“N REAL
  ========================================== */

  useEffect(() => {
    const cargarDashboard = async () => {
      setCargando(true);
      setError("");

      try {
        const [respuestaRutas, respuestaEntregas, respuestaPerfil] =
          await Promise.all([
            api.get("/rutas/mis-rutas"),
            api.get("/envios/mis-entregas"),
            api.get("/usuarios/perfil"),
          ]);

        setRutas(obtenerLista(respuestaRutas.data));
        setEntregas(obtenerLista(respuestaEntregas.data));
        setPerfil(respuestaPerfil.data);
      } catch (error) {
        console.error("Error al cargar el Dashboard:", error);

        setError(
          "No fue posible cargar toda la informacion del panel. Verifica tu conexiÃ³n."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarDashboard();
  }, []);

  /* ==========================================
     NOMBRE DEL CONDUCTOR
  ========================================== */

  const nombreCompleto =
    perfil?.nombre ||
    localStorage.getItem("nombre_usuario") ||
    localStorage.getItem("nombre") ||
    "Conductor";

  const primerNombre = nombreCompleto.trim().split(" ")[0];

  /* ==========================================
     FECHA ACTUAL
  ========================================== */

  const fecha = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  /* ==========================================
     ESTADÃSTICAS REALES
  ========================================== */

  const estadisticas = useMemo(() => {
    const rutasFinalizadas = rutas.filter(rutaFinalizada).length;
    const rutasActivas = rutas.filter(rutaEnProceso).length;

    const entregasCompletadas = entregas.filter(envioEntregado).length;

    const entregasPendientes = entregas.filter(envioPendiente).length;

    return [
      {
        titulo: "Rutas asignadas",
        valor: rutas.length,
        descripcion: "Rutas asignadas actualmente",
        Icono: IconRuta,
        color: "rojo",
      },
      {
        titulo: "Entregas pendientes",
        valor: entregasPendientes,
        descripcion: "Paquetes pendientes de entrega",
        Icono: IconPaquete,
        color: "amarillo",
      },
      {
        titulo: "Entregas completadas",
        valor: entregasCompletadas,
        descripcion: "Paquetes entregados",
        Icono: IconCheck,
        color: "verde",
      },
      {
        titulo: "Rutas finalizadas",
        valor: rutasFinalizadas,
        descripcion: "Recorridos completados",
        Icono: IconCamion,
        color: "azul",
      },
    ];
  }, [rutas, entregas]);

  /* ==========================================
     RUTA ACTUAL EN PROCESO
  ========================================== */

  const rutaEnCurso = rutas.find(rutaEnProceso);

  /* ==========================================
     RUTAS PARA LA TABLA
  ========================================== */

  const rutasTabla = rutas.slice(0, 3);

  /* ==========================================
     RENDER
  ========================================== */

  return (
    <div className="dashboard-conductor">

      {/* BIENVENIDA */}

      <section className="dashboard-bienvenida">
        <div className="dashboard-bienvenida-texto">
          <h1>¡Hola, {primerNombre}!</h1>

          <p>
            Este es el resumen de tu actividad. Consulta tus rutas y
            mantente al di­a con tus entregas.
          </p>

          <div className="dashboard-chips">
            <div className="dashboard-chip">
              <IconCalendario size={16} />
              <span className="dashboard-fecha">{fecha}</span>
            </div>

            {rutaEnCurso && (
              <div className="dashboard-chip dashboard-chip--ruta">
                <span className="punto-vivo" aria-hidden="true" />
                <span>
                  En curso:{" "}
                  {rutaEnCurso.codigo_ruta || rutaEnCurso.codigo || "Ruta"}{" "}
                  {rutaEnCurso.ciudad_origen || rutaEnCurso.origen
                    ? `, ${rutaEnCurso.ciudad_origen || rutaEnCurso.origen}`
                    : ""}
                  {" a "}
                  {rutaEnCurso.ciudad_destino || rutaEnCurso.destino || ""}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bienvenida-ilustracion" aria-hidden="true">
          <div className="bienvenida-circulo">
            <IconCamion size={76} />
          </div>

          <span className="bienvenida-decoracion decoracion-1">
            <IconPaquete size={20} />
          </span>

          <span className="bienvenida-decoracion decoracion-2">
            <IconPin size={20} />
          </span>
        </div>
      </section>

      {/* ESTADÃSTICAS */}

      <section className="dashboard-seccion">
        <div className="dashboard-titulo-seccion">
          <h2>Resumen de actividad</h2>
          <p>Estado general de tus operaciones</p>
        </div>

        <div className="estadisticas-conductor">
          {estadisticas.map(({ titulo, valor, descripcion, Icono, color }) => (
            <article className="estadistica-card" key={titulo}>
              <div className="estadistica-superior">
                <span className="estadistica-titulo">{titulo}</span>

                <div className={`estadistica-icono ${color}`}>
                  <Icono size={22} />
                </div>
              </div>

              <div className="estadistica-valor">
                <strong>{cargando ? "..." : valor}</strong>
                <span>{descripcion}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* JORNADA */}

      <section className="jornada-conductor">
        <div className="jornada-icono">
          <IconReloj size={24} />
        </div>

        <div className="jornada-info">
          <h3>Tu jornada de trabajo</h3>
          <p>
            {perfil?.jornada
              ? `Tu jornada asignada es: ${perfil.jornada}. Consulta tus rutas y manten actualizada la informacion de tus entregas.`
              : "Recuerda consultar tus rutas asignadas y mantener actualizada la informacion de tus entregas."}
          </p>
        </div>

        <div className="jornada-estado">
          <span className="jornada-punto" aria-hidden="true" />
          Panel disponible
        </div>
      </section>

      {/* PRÃ“XIMAS RUTAS */}

      <section className="rutas-conductor-card">
        <div className="rutas-card-header">
          <div>
            <h2>Mis proximas rutas</h2>
            <p>Resumen de tus recorridos programados.</p>
          </div>

          <div className="rutas-icono-header">
            <IconPin size={22} />
          </div>
        </div>

        {cargando ? (
          <p className="perfil-mensaje">Cargando rutas asignadas...</p>
        ) : error ? (
          <p className="perfil-error">{error}</p>
        ) : rutasTabla.length === 0 ? (
          <p className="perfil-mensaje">
            Actualmente no tienes rutas asignadas.
          </p>
        ) : (
          <div className="tabla-rutas">
            <table>
              <thead>
                <tr>
                  <th scope="col">Codigo</th>
                  <th scope="col">Origen</th>
                  <th scope="col">Destino</th>
                  <th scope="col">Hora</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>

              <tbody>
                {rutasTabla.map((ruta, index) => {
                  const estado =
                    ruta.estado || ruta.estado_ruta || "Pendiente";

                  const estadoNormalizado = normalizarEstado(estado);

                  const claseEstado = estadoNormalizado.includes("proceso")
                    ? "estado estado-proceso"
                    : estadoNormalizado.includes("finaliz") ||
                      estadoNormalizado.includes("complet")
                    ? "estado estado-finalizada"
                    : "estado estado-pendiente";

                  return (
                    <tr
                      key={ruta.id_rutas || ruta.codigo_ruta || index}
                      className={rutaEnProceso(ruta) ? "fila-activa" : ""}
                    >
                      <td>
                        <strong>
                          {ruta.codigo_ruta ||
                            ruta.codigo ||
                            `Ruta ${index + 1}`}
                        </strong>
                      </td>

                      <td>
                        {ruta.ciudad_origen || ruta.origen || "No definido"}
                      </td>

                      <td>
                        {ruta.ciudad_destino || ruta.destino || "No definido"}
                      </td>

                      <td>
                        {ruta.hora || ruta.hora_salida || "No definida"}
                      </td>

                      <td>
                        <span className={claseEstado}>
                          {estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}

