import { useState, useEffect, useRef } from "react";
import api from "@/shared/api";
import MapaRastreo from "@/shared/components/MapaRastreo";
import "./CSS/MisEntregas.css";

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

const IconPaquete = (p) => (
  <Icono {...p}>
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8z" />
    <path d="M3 8l9 5 9-5" />
    <path d="M12 13v8" />
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

const IconPin = (p) => (
  <Icono {...p}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Icono>
);

const IconBuscar = (p) => (
  <Icono {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icono>
);

const IconActualizar = (p) => (
  <Icono {...p}>
    <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
    <path d="M3 12A9 9 0 0 1 18.5 5.8L21 8" />
    <path d="M21 3v5h-5M3 21v-5h5" />
  </Icono>
);

const IconBandeja = (p) => (
  <Icono {...p}>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </Icono>
);

const CLASE_ESTADO = {
  Pendiente: "pendiente",
  "En camino": "en-camino",
  Entregado: "entregado",
};

const FILTROS = [
  { valor: "Todas", texto: "Todas" },
  { valor: "Pendiente", texto: "Pendientes" },
  { valor: "En camino", texto: "En camino" },
  { valor: "Entregado", texto: "Entregadas" },
];

export default function MisEntregas() {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todas");
  const [entregas, setEntregas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(null);
  const [error, setError] = useState("");

  const [entregaActivaId, setEntregaActivaId] = useState(null);
  const [intervaloSegundos, setIntervaloSegundos] = useState(5);
  const [coordenadaActual, setCoordenadaActual] = useState(null);
  const [historialCoords, setHistorialCoords] = useState([]);
  const [estadoGpsTexto, setEstadoGpsTexto] = useState("");

  const ultimaCoordsRef = useRef(null);
  const ultimoEnvioMsRef = useRef(0);
  const watchIdRef = useRef(null);
  const timerRef = useRef(null);

  const cargarEntregas = async (silencioso = false) => {
    try {
      if (!silencioso) setCargando(true);
      setError("");

      const respuesta = await api.get("/envios/mis-entregas");
      setEntregas(respuesta.data);
    } catch (error) {
      console.error("Error al cargar las entregas:", error);

      if (error.response?.status === 401) {
        setError("Tu sesion ha expirado. Inicia sesion nuevamente.");
      } else if (error.response?.status === 403) {
        setError("No tienes permisos para consultar estas entregas.");
      } else {
        setError("No fue posible cargar las entregas. Intenta nuevamente.");
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEntregas();
  }, []);

  const normalizarPosicion = (pos) => ({
    latitud: Number(pos.coords.latitude.toFixed(6)),
    longitud: Number(pos.coords.longitude.toFixed(6)),
    precision_m: pos.coords.accuracy != null ? Math.round(pos.coords.accuracy) : null,
    velocidad: pos.coords.speed ?? null,
  });

  const obtenerPosicionNavegador = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Tu navegador no soporta geolocalización."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(normalizarPosicion(pos)),
        (err) => reject(new Error(err.message || "No se pudo obtener la ubicación GPS.")),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  const enviarCoordsAlBackend = async (idEnvio, coords) => {
    const resp = await api.post(`/rastreo-gps/envios/${idEnvio}/ubicacion`, coords);
    const ub = resp.data?.ubicacion_actual;

    if (ub) {
      const ubConPrecision = {
        ...ub,
        precision_m: coords.precision_m ?? ub.precision_m ?? null,
      };
      setCoordenadaActual(ubConPrecision);
      setHistorialCoords((prev) => [...prev.slice(-29), ubConPrecision]);
      ultimoEnvioMsRef.current = Date.now();
      const avisoPrecision =
        typeof coords.precision_m === "number"
          ? ` (±${coords.precision_m} m${coords.precision_m > 500 ? ", ubicación aproximada por red/IP" : ""})`
          : "";
      setEstadoGpsTexto(
        `Transmitiendo cada ${intervaloSegundos}s${avisoPrecision} · Lat: ${ub.latitud.toFixed(5)}, Lng: ${ub.longitud.toFixed(5)}`
      );
    }
  };

  const detenerTransmisionGps = async (idEnvioActual = entregaActivaId, notificarBackend = false) => {
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    ultimaCoordsRef.current = null;
    ultimoEnvioMsRef.current = 0;

    if (notificarBackend && idEnvioActual) {
      try {
        await api.post(`/rastreo-gps/envios/${idEnvioActual}/finalizar`);
      } catch (err) {
        console.error("Error al detener GPS en servidor:", err);
      }
    }

    setEntregaActivaId(null);
    setEstadoGpsTexto("Transmisión GPS detenida.");
  };

  useEffect(() => {
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!entregaActivaId) return;

    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (pos) => {
          const coords = normalizarPosicion(pos);
          ultimaCoordsRef.current = coords;
          setCoordenadaActual((prev) => ({
            ...(prev || {}),
            latitud: coords.latitud,
            longitud: coords.longitud,
            precision_m: coords.precision_m,
            actualizado_en: new Date().toISOString(),
          }));

          const ahora = Date.now();
          if (ahora - ultimoEnvioMsRef.current >= intervaloSegundos * 1000) {
            try {
              await enviarCoordsAlBackend(entregaActivaId, coords);
            } catch (err) {
              console.error("Error enviando coordenada GPS:", err);
            }
          }
        },
        (err) => {
          setEstadoGpsTexto(`GPS: ${err.message || "Sin señal continua"}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }

    timerRef.current = setInterval(async () => {
      try {
        const coords = ultimaCoordsRef.current || (await obtenerPosicionNavegador());
        await enviarCoordsAlBackend(entregaActivaId, coords);
      } catch (err) {
        console.error("Error enviando coordenada GPS:", err);
        setEstadoGpsTexto(err.message || "Error al capturar posición GPS");
      }
    }, intervaloSegundos * 1000);

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [entregaActivaId, intervaloSegundos]);

  const empezarRutaEntrega = async (entrega) => {
    const id = entrega.id_envio ?? entrega.id;
    try {
      setActualizando(id);
      setError("");

      let coordsIniciales = { latitud: 4.711, longitud: -74.0721, precision_m: null };
      try {
        coordsIniciales = await obtenerPosicionNavegador();
      } catch (geoErr) {
        setEstadoGpsTexto(
          `GPS del navegador no disponible (${geoErr.message}). Usando coordenada inicial de respaldo.`
        );
      }

      ultimaCoordsRef.current = coordsIniciales;
      ultimoEnvioMsRef.current = Date.now();

      const resp = await api.post(`/rastreo-gps/envios/${id}/iniciar`, coordsIniciales);
      const ub = resp.data?.ubicacion_actual;

      setEntregaActivaId(id);
      if (ub) {
        const ubConPrecision = {
          ...ub,
          precision_m: coordsIniciales.precision_m ?? null,
        };
        setCoordenadaActual(ubConPrecision);
        setHistorialCoords([ubConPrecision]);
      }

      await cargarEntregas(true);
    } catch (err) {
      console.error("Error al empezar ruta:", err);
      setError(
        err.response?.data?.detail || "No fue posible iniciar la ruta del paquete."
      );
    } finally {
      setActualizando(null);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      setActualizando(id);
      setError("");

      await api.patch(`/envios/${id}/estado`, {
        estado: nuevoEstado,
      });

      if (nuevoEstado === "Entregado") {
        await detenerTransmisionGps(id, true);
      }

      await cargarEntregas(true);
    } catch (error) {
      console.error("Error al actualizar el estado:", error);

      setError(
        error.response?.data?.detail ||
          "No fue posible actualizar el estado de la entrega."
      );
    } finally {
      setActualizando(null);
    }
  };

  const entregasFiltradas = entregas.filter((entrega) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      (entrega.codigo || "").toLowerCase().includes(texto) ||
      (entrega.destinatario || "").toLowerCase().includes(texto) ||
      (entrega.ciudad || "").toLowerCase().includes(texto);

    const coincideEstado = filtro === "Todas" || entrega.estado === filtro;

    return coincideBusqueda && coincideEstado;
  });

  const contar = (estado) => entregas.filter((e) => e.estado === estado).length;

  const pendientes = contar("Pendiente");
  const enCamino = contar("En camino");
  const completadas = contar("Entregado");

  const cantidadPorFiltro = {
    Todas: entregas.length,
    Pendiente: pendientes,
    "En camino": enCamino,
    Entregado: completadas,
  };

  const entregaSeleccionadaMapa =
    entregas.find((e) => (e.id_envio ?? e.id) === entregaActivaId) ||
    entregas.find((e) => e.estado === "En camino") ||
    entregas[0] ||
    null;

  return (
    <div className="mis-entregas">
      <header className="entregas-titulo">
        <div>
          <h1>Mis entregas</h1>
          <p>Consulta los paquetes asignados, inicia la ruta y transmite tu ubicación en tiempo real.</p>
        </div>

        <div className="entregas-total">
          <span>Total de paquetes</span>
          <strong>{entregas.length}</strong>
        </div>
      </header>

      <section className="entregas-resumen" aria-label="Resumen de entregas">
        <div className="entrega-resumen-card">
          <span className="resumen-icono amarillo">
            <IconPaquete />
          </span>
          <div>
            <strong>{pendientes}</strong>
            <p>Pendientes</p>
          </div>
        </div>

        <div className="entrega-resumen-card">
          <span className="resumen-icono azul">
            <IconCamion />
          </span>
          <div>
            <strong>{enCamino}</strong>
            <p>En camino</p>
          </div>
        </div>

        <div className="entrega-resumen-card">
          <span className="resumen-icono verde">
            <IconCheck />
          </span>
          <div>
            <strong>{completadas}</strong>
            <p>Entregadas</p>
          </div>
        </div>
      </section>

      <section className="entregas-gps-panel">
        <div className="entregas-gps-controles">
          <div>
            <strong>Frecuencia de envío de coordenadas:</strong>
            <div className="gps-intervalo-botones">
              <button
                type="button"
                className={intervaloSegundos === 5 ? "activo" : ""}
                onClick={() => setIntervaloSegundos(5)}
              >
                Cada 5 seg
              </button>
              <button
                type="button"
                className={intervaloSegundos === 10 ? "activo" : ""}
                onClick={() => setIntervaloSegundos(10)}
              >
                Cada 10 seg
              </button>
            </div>
          </div>

          {entregaActivaId && (
            <button
              type="button"
              className="btn-detener-gps"
              onClick={() => detenerTransmisionGps(entregaActivaId, true)}
            >
              Detener transmisión GPS
            </button>
          )}
        </div>

        {estadoGpsTexto && (
          <p className="gps-estado-texto">{estadoGpsTexto}</p>
        )}

        <MapaRastreo
          latitud={coordenadaActual?.latitud}
          longitud={coordenadaActual?.longitud}
          latitudDestino={entregaSeleccionadaMapa?.latitud_destino}
          longitudDestino={entregaSeleccionadaMapa?.longitud_destino}
          titulo={
            entregaSeleccionadaMapa
              ? `Mapa en vivo · ${entregaSeleccionadaMapa.codigo} (${entregaSeleccionadaMapa.destinatario})`
              : "Mapa global de entregas ONUFAST"
          }
          subtitulo={
            entregaSeleccionadaMapa
              ? `Destino: ${entregaSeleccionadaMapa.direccion || entregaSeleccionadaMapa.ciudad || "No especificado"}`
              : "Inicia una ruta en tus paquetes asignados para transmitir coordenadas."
          }
          historial={historialCoords}
          activo={Boolean(entregaActivaId)}
          actualizadoEn={coordenadaActual?.actualizado_en}
          height={340}
        />
      </section>

      <section className="entregas-barra">
        <div className="entregas-buscador">
          <IconBuscar size={18} />
          <input
            type="text"
            placeholder="Buscar por codigo, destinatario o ciudad"
            aria-label="Buscar entregas"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="entregas-actualizar"
          onClick={() => cargarEntregas()}
          disabled={cargando}
        >
          <span className={cargando ? "girando" : ""}>
            <IconActualizar size={16} />
          </span>
          {cargando ? "Cargando" : "Actualizar"}
        </button>

        <div className="entregas-filtros" role="group" aria-label="Filtrar por estado">
          {FILTROS.map(({ valor, texto }) => (
            <button
              key={valor}
              type="button"
              className={filtro === valor ? "activo" : ""}
              aria-pressed={filtro === valor}
              onClick={() => setFiltro(valor)}
            >
              {texto}
              <small>{cantidadPorFiltro[valor]}</small>
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="entregas-error" role="alert">
          {error}
        </div>
      )}

      <section className="entregas-tarjetas" aria-live="polite">
        {cargando ? (
          [1, 2, 3, 4].map((n) => (
            <div className="entrega-card entrega-esqueleto" key={n} aria-hidden="true">
              <span className="esq esq-linea corta" />
              <span className="esq esq-linea" />
              <span className="esq esq-bloque" />
              <span className="esq esq-boton" />
            </div>
          ))
        ) : entregasFiltradas.length > 0 ? (
          entregasFiltradas.map((entrega) => {
            const id = entrega.id_envio ?? entrega.id;
            const claseEstado = CLASE_ESTADO[entrega.estado] || "otro";
            const transmitiendoEsta = entregaActivaId === id;

            return (
              <article className={`entrega-card ${claseEstado}`} key={id}>
                <div className="entrega-card-header">
                  <div>
                    <span className="entrega-codigo">{entrega.codigo}</span>
                    <h3>{entrega.destinatario}</h3>
                  </div>

                  <span className={`entrega-estado ${claseEstado}`}>
                    {entrega.estado}
                  </span>
                </div>

                <div className="entrega-informacion">
                  <div className="entrega-direccion">
                    <span>Dirección de entrega</span>
                    <strong>
                      <IconPin size={16} />
                      {entrega.direccion || "Sin dirección"}
                    </strong>
                  </div>

                  <div>
                    <span>Ciudad</span>
                    <strong>{entrega.ciudad || "—"}</strong>
                  </div>

                  <div>
                    <span>Documento</span>
                    <strong>{entrega.documento || "—"}</strong>
                  </div>

                  <div className="entrega-descripcion">
                    <span>Descripción del paquete</span>
                    <strong>{entrega.descripcion || "Sin descripcion"}</strong>
                  </div>
                </div>

                <div className="entrega-acciones">
                  {entrega.estado === "Pendiente" && (
                    <button
                      type="button"
                      className="btn-iniciar-entrega"
                      disabled={actualizando === id}
                      onClick={() => empezarRutaEntrega(entrega)}
                    >
                      {actualizando === id ? "Iniciando ruta..." : "Empezar ruta"}
                    </button>
                  )}

                  {entrega.estado === "En camino" && (
                    <>
                      {!transmitiendoEsta && (
                        <button
                          type="button"
                          className="btn-iniciar-entrega"
                          disabled={actualizando === id}
                          onClick={() => empezarRutaEntrega(entrega)}
                        >
                          Empezar ruta / Transmitir GPS
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn-finalizar-entrega"
                        disabled={actualizando === id}
                        onClick={() => actualizarEstado(id, "Entregado")}
                      >
                        {actualizando === id
                          ? "Actualizando..."
                          : "Marcar como entregado"}
                      </button>
                    </>
                  )}

                  {entrega.estado === "Entregado" && (
                    <span className="entrega-completada">
                      <IconCheck size={16} />
                      Entrega completada
                    </span>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          <div className="entregas-vacio">
            <span className="vacio-icono">
              <IconBandeja size={28} />
            </span>
            <h3>
              {entregas.length === 0
                ? "No tienes entregas asignadas"
                : "No se encontraron entregas"}
            </h3>
            <p>
              {entregas.length === 0
                ? "Cuando te asignen paquetes, aparecerán aquí."
                : "Prueba con otra búsqueda o cambia el filtro de estado."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}