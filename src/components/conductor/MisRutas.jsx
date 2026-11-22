import { useState, useEffect } from "react";
import api from "../../api";
import "./CSS/MisRutas.css";

/* ==========================================
   ICONOS SVG (mismo estilo que el resto del panel)
========================================== */

function Icono({ size = 20, children }) {
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

const IconReloj = (p) => (
  <Icono {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
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

const IconCheck = (p) => (
  <Icono {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-6" />
  </Icono>
);

const IconAlerta = (p) => (
  <Icono {...p}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </Icono>
);

const IconBandeja = (p) => (
  <Icono {...p}>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </Icono>
);

const IconActualizar = (p) => (
  <Icono {...p}>
    <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
    <path d="M3 12A9 9 0 0 1 18.5 5.8L21 8" />
    <path d="M21 3v5h-5M3 21v-5h5" />
  </Icono>
);

/* ==========================================
   CONSTANTES
========================================== */

// Clase CSS según el estado que llega del servidor
const CLASE_ESTADO = {
  Pendiente: "pendiente",
  "En proceso": "proceso",
  Finalizada: "finalizada",
};

// Siguiente estado de una ruta y el texto del botón que lo activa
const SIGUIENTE = {
  Pendiente: { estado: "En proceso", texto: "Iniciar ruta", clase: "btn-iniciar-ruta" },
  "En proceso": { estado: "Finalizada", texto: "Finalizar ruta", clase: "btn-finalizar-ruta" },
};

const FILTROS = [
  { valor: "Todas", texto: "Todas" },
  { valor: "Pendiente", texto: "Pendientes" },
  { valor: "En proceso", texto: "En proceso" },
  { valor: "Finalizada", texto: "Finalizadas" },
];

export default function MisRutas() {
  const [filtro, setFiltro] = useState("Todas");
  const [rutas, setRutas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(""); // error al cargar la lista
  const [errorAccion, setErrorAccion] = useState(""); // error al cambiar un estado
  const [actualizando, setActualizando] = useState(null);

  // ==========================================
  // CONSULTAR RUTAS DEL CONDUCTOR
  // (fuera del useEffect para poder reintentar)
  // ==========================================
  const cargarRutas = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await api.get("/rutas/mis-rutas");

      const rutasAdaptadas = respuesta.data.map((ruta) => ({
        id_rutas: ruta.id_rutas,
        codigo: ruta.codigo_ruta,
        origen: ruta.ciudad_origen,
        destino: ruta.ciudad_destino,
        hora: ruta.fecha_creacion
          ? new Date(ruta.fecha_creacion).toLocaleTimeString("es-CO", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "No disponible",
        fecha: ruta.fecha_creacion
          ? new Date(ruta.fecha_creacion).toLocaleDateString("es-CO")
          : "No disponible",
        vehiculo: ruta.tipo_vehiculo,
        paquetes: ruta.cantidad_paquetes,
        estado: ruta.estado,
      }));

      setRutas(rutasAdaptadas);
    } catch (error) {
      console.error("Error al cargar las rutas:", error);

      setError(
        error.response?.data?.detail || "No fue posible cargar tus rutas."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarRutas();
  }, []);

  // ==========================================
  // CAMBIAR ESTADO DE LA RUTA
  // ==========================================
  const cambiarEstado = async (ruta) => {
    const siguiente = SIGUIENTE[ruta.estado];
    if (!siguiente) return;

    try {
      setActualizando(ruta.id_rutas);
      setErrorAccion("");

      await api.patch(`/rutas/${ruta.id_rutas}/estado`, {
        estado: siguiente.estado,
      });

      setRutas((rutasActuales) =>
        rutasActuales.map((r) =>
          r.id_rutas === ruta.id_rutas ? { ...r, estado: siguiente.estado } : r
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado:", error);

      // Se muestra en pantalla, sin ventana emergente
      setErrorAccion(
        error.response?.data?.detail ||
          "No se pudo actualizar el estado de la ruta."
      );
    } finally {
      setActualizando(null);
    }
  };

  // ==========================================
  // FILTROS Y ESTADÍSTICAS
  // ==========================================
  const rutasFiltradas =
    filtro === "Todas" ? rutas : rutas.filter((ruta) => ruta.estado === filtro);

  const contar = (estado) => rutas.filter((r) => r.estado === estado).length;

  const pendientes = contar("Pendiente");
  const enProceso = contar("En proceso");
  const finalizadas = contar("Finalizada");

  const cantidadPorFiltro = {
    Todas: rutas.length,
    Pendiente: pendientes,
    "En proceso": enProceso,
    Finalizada: finalizadas,
  };

  // ==========================================
  // INTERFAZ
  // ==========================================
  return (
    <div className="mis-rutas">
      {/* ENCABEZADO */}
      <header className="mis-rutas-titulo">
        <div>
          <h1>Mis rutas</h1>
          <p>Consulta y organiza los recorridos que tienes asignados.</p>
        </div>

        <div className="rutas-total">
          <span>Rutas asignadas</span>
          <strong>{rutas.length}</strong>
        </div>
      </header>

      {/* RESUMEN */}
      <section className="rutas-resumen" aria-label="Resumen de rutas">
        <div className="ruta-resumen-card">
          <span className="ruta-resumen-icono amarillo">
            <IconReloj />
          </span>
          <div>
            <strong>{pendientes}</strong>
            <p>Pendientes</p>
          </div>
        </div>

        <div className="ruta-resumen-card">
          <span className="ruta-resumen-icono azul">
            <IconCamion />
          </span>
          <div>
            <strong>{enProceso}</strong>
            <p>En proceso</p>
          </div>
        </div>

        <div className="ruta-resumen-card">
          <span className="ruta-resumen-icono verde">
            <IconCheck />
          </span>
          <div>
            <strong>{finalizadas}</strong>
            <p>Finalizadas</p>
          </div>
        </div>
      </section>

      {/* FILTROS */}
      <section className="rutas-barra">
        <div className="rutas-barra-texto">
          <h2>Recorridos asignados</h2>
          <p>Filtra tus rutas por estado.</p>
        </div>

        <div className="rutas-filtros" role="group" aria-label="Filtrar por estado">
          {FILTROS.map(({ valor, texto }) => (
            <button
              key={valor}
              type="button"
              className={filtro === valor ? "filtro-activo" : ""}
              aria-pressed={filtro === valor}
              onClick={() => setFiltro(valor)}
            >
              {texto}
              <small>{cantidadPorFiltro[valor]}</small>
            </button>
          ))}
        </div>
      </section>

      {/* ERROR AL CAMBIAR ESTADO */}
      {errorAccion && (
        <div className="rutas-error" role="alert">
          {errorAccion}
        </div>
      )}

      {/* TARJETAS DE RUTAS */}
      <section className="rutas-tarjetas" aria-live="polite">
        {cargando ? (
          [1, 2, 3, 4].map((n) => (
            <div className="ruta-card ruta-esqueleto" key={n} aria-hidden="true">
              <span className="esq esq-linea corta" />
              <span className="esq esq-bloque" />
              <span className="esq esq-linea" />
              <span className="esq esq-boton" />
            </div>
          ))
        ) : error ? (
          <div className="rutas-vacio rutas-vacio--error" role="alert">
            <span className="vacio-icono">
              <IconAlerta size={28} />
            </span>
            <h3>No se pudieron cargar las rutas</h3>
            <p>{error}</p>
            <button type="button" className="rutas-reintentar" onClick={cargarRutas}>
              <IconActualizar size={16} />
              Intentar de nuevo
            </button>
          </div>
        ) : rutasFiltradas.length > 0 ? (
          rutasFiltradas.map((ruta) => {
            const claseEstado = CLASE_ESTADO[ruta.estado] || "otro";
            const siguiente = SIGUIENTE[ruta.estado];
            const ocupada = actualizando === ruta.id_rutas;

            return (
              <article
                className={`ruta-card ${claseEstado}`}
                key={ruta.id_rutas ?? ruta.codigo}
              >
                <div className="ruta-card-superior">
                  <strong>{ruta.codigo}</strong>
                  <span className={`ruta-estado ${claseEstado}`}>
                    {ruta.estado}
                  </span>
                </div>

                {/* Origen y destino unidos por una línea */}
                <div className="ruta-recorrido">
                  <div className="ruta-punto">
                    <span className="punto-origen" aria-hidden="true" />
                    <div>
                      <small>Origen</small>
                      <strong>{ruta.origen}</strong>
                    </div>
                  </div>

                  <div className="ruta-linea" aria-hidden="true" />

                  <div className="ruta-punto">
                    <span className="punto-destino" aria-hidden="true" />
                    <div>
                      <small>Destino</small>
                      <strong>{ruta.destino}</strong>
                    </div>
                  </div>
                </div>

                <div className="ruta-detalles">
                  <div>
                    <small>Fecha</small>
                    <strong>{ruta.fecha}</strong>
                  </div>

                  <div>
                    <small>Hora</small>
                    <strong>{ruta.hora}</strong>
                  </div>

                  <div>
                    <small>Vehículo</small>
                    <strong>{ruta.vehiculo || "—"}</strong>
                  </div>

                  <div>
                    <small>Paquetes</small>
                    <strong>{ruta.paquetes ?? 0}</strong>
                  </div>
                </div>

                {/* BOTÓN DE CAMBIO DE ESTADO */}
                <div className="ruta-acciones">
                  {siguiente && (
                    <button
                      type="button"
                      className={siguiente.clase}
                      disabled={ocupada}
                      onClick={() => cambiarEstado(ruta)}
                    >
                      {ocupada ? "Actualizando..." : siguiente.texto}
                    </button>
                  )}

                  {ruta.estado === "Finalizada" && (
                    <span className="ruta-completada">
                      <IconCheck size={16} />
                      Ruta completada
                    </span>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          <div className="rutas-vacio">
            <span className="vacio-icono">
              <IconBandeja size={28} />
            </span>
            <h3>
              {rutas.length === 0
                ? "Aún no tienes rutas asignadas"
                : "No hay rutas en este estado"}
            </h3>
            <p>
              {rutas.length === 0
                ? "Cuando te asignen un recorrido, aparecerá aquí."
                : "Prueba seleccionando otro filtro."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}