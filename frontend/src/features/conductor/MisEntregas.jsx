import { useState, useEffect } from "react";
import api from "@/shared/api"; // Ajusta esta ruta si tu archivo estÃ¡ en otra carpeta
import "./CSS/MisEntregas.css";

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

/* ==========================================
   CONSTANTES
========================================== */

// Clase CSS segÃºn el estado que llega del servidor
const CLASE_ESTADO = {
  Pendiente: "pendiente",
  "En camino": "en-camino",
  Entregado: "entregado",
};

// Opciones del filtro (el "valor" es el mismo que usaba el select)
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

  // ==========================================
  // CONSULTAR ENTREGAS DEL CONDUCTOR
  // silencioso = true: refresca los datos sin tapar
  // la lista con el estado de "cargando"
  // ==========================================
  const cargarEntregas = async (silencioso = false) => {
    try {
      if (!silencioso) setCargando(true);
      setError("");

      const respuesta = await api.get("/envios/mis-entregas");

      setEntregas(respuesta.data);
    } catch (error) {
      console.error("Error al cargar las entregas:", error);

      if (error.response?.status === 401) {
        setError("Tu sesiÃ³n ha expirado. Inicia sesiÃ³n nuevamente.");
      } else if (error.response?.status === 403) {
        setError("No tienes permisos para consultar estas entregas.");
      } else {
        setError("No fue posible cargar las entregas. Intenta nuevamente.");
      }
    } finally {
      setCargando(false);
    }
  };

  // Cargar los datos cuando se abre la pantalla
  useEffect(() => {
    cargarEntregas();
  }, []);

  // ==========================================
  // ACTUALIZAR ESTADO DE LA ENTREGA
  // ==========================================
  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      setActualizando(id);
      setError("");

      await api.patch(`/envios/${id}/estado`, {
        estado: nuevoEstado,
      });

      // Actualizar la lista con los datos del servidor (sin parpadeo)
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

  // ==========================================
  // BUSCADOR Y FILTROS
  // ==========================================
  const entregasFiltradas = entregas.filter((entrega) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      (entrega.codigo || "").toLowerCase().includes(texto) ||
      (entrega.destinatario || "").toLowerCase().includes(texto) ||
      (entrega.ciudad || "").toLowerCase().includes(texto);

    const coincideEstado = filtro === "Todas" || entrega.estado === filtro;

    return coincideBusqueda && coincideEstado;
  });

  // ==========================================
  // ESTADÃSTICAS
  // ==========================================
  const contar = (estado) => entregas.filter((e) => e.estado === estado).length;

  const pendientes = contar("Pendiente");
  const enCamino = contar("En camino");
  const completadas = contar("Entregado");

  // Cantidad que se muestra junto a cada opciÃ³n del filtro
  const cantidadPorFiltro = {
    Todas: entregas.length,
    Pendiente: pendientes,
    "En camino": enCamino,
    Entregado: completadas,
  };

  // ==========================================
  // INTERFAZ
  // ==========================================
  return (
    <div className="mis-entregas">
      {/* ENCABEZADO */}
      <header className="entregas-titulo">
        <div>
          <h1>Mis entregas</h1>
          <p>Consulta los paquetes asignados y actualiza su estado.</p>
        </div>

        <div className="entregas-total">
          <span>Total de paquetes</span>
          <strong>{entregas.length}</strong>
        </div>
      </header>

      {/* ESTADÃSTICAS */}
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

      {/* BARRA DE HERRAMIENTAS: buscar, filtrar y actualizar */}
      <section className="entregas-barra">
        <div className="entregas-buscador">
          <IconBuscar size={18} />
          <input
            type="text"
            placeholder="Buscar por cÃ³digo, destinatario o ciudad"
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

      {/* MENSAJE DE ERROR */}
      {error && (
        <div className="entregas-error" role="alert">
          {error}
        </div>
      )}

      {/* TARJETAS */}
      <section className="entregas-tarjetas" aria-live="polite">
        {cargando ? (
          // Esqueletos: muestran la forma de las tarjetas mientras llegan los datos
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
                    <span>DirecciÃ³n de entrega</span>
                    <strong>
                      <IconPin size={16} />
                      {entrega.direccion || "Sin direcciÃ³n"}
                    </strong>
                  </div>

                  <div>
                    <span>Ciudad</span>
                    <strong>{entrega.ciudad || "â€”"}</strong>
                  </div>

                  <div>
                    <span>Documento</span>
                    <strong>{entrega.documento || "â€”"}</strong>
                  </div>

                  <div className="entrega-descripcion">
                    <span>DescripciÃ³n</span>
                    <strong>{entrega.descripcion || "Sin descripciÃ³n"}</strong>
                  </div>
                </div>

                <div className="entrega-acciones">
                  {entrega.estado === "Pendiente" && (
                    <button
                      type="button"
                      className="btn-iniciar-entrega"
                      disabled={actualizando === id}
                      onClick={() => actualizarEstado(id, "En camino")}
                    >
                      {actualizando === id ? "Actualizando..." : "Iniciar entrega"}
                    </button>
                  )}

                  {entrega.estado === "En camino" && (
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
                ? "Cuando te asignen paquetes, aparecerÃ¡n aquÃ­."
                : "Prueba con otra bÃºsqueda o cambia el filtro de estado."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
