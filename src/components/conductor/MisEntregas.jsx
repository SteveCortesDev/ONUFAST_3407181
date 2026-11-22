
import { useState, useEffect } from "react";
import api from "../../api"; // Ajusta esta ruta si tu archivo está en otra carpeta
import "./CSS/MisEntregas.css";

export default function MisEntregas() {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todas");
  const [entregas, setEntregas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(null);
  const [error, setError] = useState("");

  // ==========================================
  // CONSULTAR ENTREGAS DEL CONDUCTOR
  // ==========================================
  const cargarEntregas = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await api.get("/envios/mis-entregas");

      setEntregas(respuesta.data);
    } catch (error) {
      console.error("Error al cargar las entregas:", error);

      if (error.response?.status === 401) {
        setError("Tu sesión ha expirado. Inicia sesión nuevamente.");
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
        estado: nuevoEstado
      });

      // Actualizar la lista con los datos del servidor
      await cargarEntregas();

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

    const coincideEstado =
      filtro === "Todas" || entrega.estado === filtro;

    return coincideBusqueda && coincideEstado;
  });

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================
  const pendientes = entregas.filter(
    (e) => e.estado === "Pendiente"
  ).length;

  const enCamino = entregas.filter(
    (e) => e.estado === "En camino"
  ).length;

  const completadas = entregas.filter(
    (e) => e.estado === "Entregado"
  ).length;

  // ==========================================
  // INTERFAZ
  // ==========================================
  return (
    <div className="mis-entregas">

      {/* ENCABEZADO */}
      <div className="entregas-titulo">
        <div>
          <span className="entregas-etiqueta">
            GESTIÓN DE PAQUETES
          </span>

          <h1>Mis entregas</h1>

          <p>
            Consulta los paquetes asignados y actualiza su estado.
          </p>
        </div>

        <div className="entregas-total">
          <span>Total de paquetes</span>
          <strong>{entregas.length}</strong>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="entregas-resumen">

        <div className="entrega-resumen-card">
          <span>📦</span>
          <div>
            <p>Pendientes</p>
            <strong>{pendientes}</strong>
          </div>
        </div>

        <div className="entrega-resumen-card">
          <span>🚚</span>
          <div>
            <p>En camino</p>
            <strong>{enCamino}</strong>
          </div>
        </div>

        <div className="entrega-resumen-card">
          <span>✅</span>
          <div>
            <p>Entregadas</p>
            <strong>{completadas}</strong>
          </div>
        </div>

      </div>

      {/* LISTADO */}
      <div className="entregas-listado">

        <div className="entregas-listado-header">
          <div>
            <h2>Paquetes asignados</h2>
            <p>Consulta la información de cada entrega.</p>
          </div>

          <button
            type="button"
            onClick={cargarEntregas}
            disabled={cargando}
          >
            {cargando ? "Cargando..." : "Actualizar"}
          </button>
        </div>

        {/* MENSAJE DE ERROR */}
        {error && (
          <div className="entregas-error">
            {error}
          </div>
        )}

        {/* BUSCADOR Y FILTROS */}
        <div className="entregas-controles">

          <div className="entregas-buscador">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Buscar por código, destinatario o ciudad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="Todas">Todos los estados</option>
            <option value="Pendiente">Pendientes</option>
            <option value="En camino">En camino</option>
            <option value="Entregado">Entregados</option>
          </select>

        </div>

        {/* TARJETAS */}
        <div className="entregas-tarjetas">

          {cargando ? (
            <div className="entregas-vacio">
              <p>Cargando tus entregas...</p>
            </div>
          ) : entregasFiltradas.length > 0 ? (

            entregasFiltradas.map((entrega) => {
              const id = entrega.id_envio ?? entrega.id;

              return (
                <article className="entrega-card" key={id}>

                  <div className="entrega-card-header">
                    <div>
                      <span className="entrega-codigo">
                        {entrega.codigo}
                      </span>

                      <h3>{entrega.destinatario}</h3>
                    </div>

                    <span
                      className={`entrega-estado ${
                        entrega.estado === "Pendiente"
                          ? "pendiente"
                          : entrega.estado === "En camino"
                          ? "en-camino"
                          : "entregado"
                      }`}
                    >
                      {entrega.estado}
                    </span>
                  </div>

                  <div className="entrega-informacion">

                    <div>
                      <span>Documento</span>
                      <strong>{entrega.documento}</strong>
                    </div>

                    <div>
                      <span>Ciudad</span>
                      <strong>{entrega.ciudad}</strong>
                    </div>

                    <div className="entrega-direccion">
                      <span>Dirección de entrega</span>
                      <strong>📍 {entrega.direccion}</strong>
                    </div>

                    <div>
                      <span>Descripción</span>
                      <strong>{entrega.descripcion}</strong>
                    </div>

                  </div>

                  <div className="entrega-acciones">

                    {entrega.estado === "Pendiente" && (
                      <button
                        className="btn-iniciar-entrega"
                        disabled={actualizando === id}
                        onClick={() =>
                          actualizarEstado(id, "En camino")
                        }
                      >
                        {actualizando === id
                          ? "Actualizando..."
                          : "Iniciar entrega"}
                      </button>
                    )}

                    {entrega.estado === "En camino" && (
                      <button
                        className="btn-finalizar-entrega"
                        disabled={actualizando === id}
                        onClick={() =>
                          actualizarEstado(id, "Entregado")
                        }
                      >
                        {actualizando === id
                          ? "Actualizando..."
                          : "Marcar como entregado"}
                      </button>
                    )}

                    {entrega.estado === "Entregado" && (
                      <span className="entrega-completada">
                        ✓ Entrega completada
                      </span>
                    )}

                  </div>

                </article>
              );
            })

          ) : (
            <div className="entregas-vacio">
              <span>📭</span>
              <h3>
                {entregas.length === 0
                  ? "No tienes entregas asignadas"
                  : "No se encontraron entregas"}
              </h3>
              <p>
                Intenta cambiar la búsqueda o el filtro.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
