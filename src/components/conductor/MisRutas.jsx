
import { useState, useEffect } from "react";
import api from "../../api";
import "./CSS/MisRutas.css";

export default function MisRutas() {
  const [filtro, setFiltro] = useState("Todas");
  const [rutas, setRutas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarRutas = async () => {
      try {
        setCargando(true);
        setError("");

        const respuesta = await api.get("/rutas/mis-rutas");

        const rutasAdaptadas = respuesta.data.map((ruta) => ({
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
          error.response?.data?.detail ||
          "No fue posible cargar tus rutas."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarRutas();
  }, []);

  const rutasFiltradas =
    filtro === "Todas"
      ? rutas
      : rutas.filter((ruta) => ruta.estado === filtro);

  return (
    <div className="mis-rutas">

      <div className="mis-rutas-titulo">
        <div>
          <span className="rutas-etiqueta">GESTIÓN DE RECORRIDOS</span>
          <h1>Mis rutas</h1>
          <p>Consulta y organiza los recorridos que tienes asignados.</p>
        </div>

        <div className="rutas-total">
          <span>Rutas asignadas</span>
          <strong>{rutas.length}</strong>
        </div>
      </div>

      {/* RESUMEN */}
      <div className="rutas-resumen">

        <div className="ruta-resumen-card">
          <span className="ruta-resumen-icono">🛣️</span>
          <div>
            <p>Total de rutas</p>
            <strong>{rutas.length}</strong>
          </div>
        </div>

        <div className="ruta-resumen-card">
          <span className="ruta-resumen-icono">🟡</span>
          <div>
            <p>Pendientes</p>
            <strong>
              {rutas.filter(r => r.estado === "Pendiente").length}
            </strong>
          </div>
        </div>

        <div className="ruta-resumen-card">
          <span className="ruta-resumen-icono">🔵</span>
          <div>
            <p>En proceso</p>
            <strong>
              {rutas.filter(r => r.estado === "En proceso").length}
            </strong>
          </div>
        </div>

        <div className="ruta-resumen-card">
          <span className="ruta-resumen-icono">🟢</span>
          <div>
            <p>Finalizadas</p>
            <strong>
              {rutas.filter(r => r.estado === "Finalizada").length}
            </strong>
          </div>
        </div>

      </div>

      {/* FILTROS */}
      <div className="rutas-listado">

        <div className="rutas-listado-header">
          <div>
            <h2>Recorridos asignados</h2>
            <p>Selecciona un estado para filtrar tus rutas.</p>
          </div>

          <div className="rutas-filtros">
            {["Todas", "Pendiente", "En proceso", "Finalizada"].map(
              (estado) => (
                <button
                  key={estado}
                  className={filtro === estado ? "filtro-activo" : ""}
                  onClick={() => setFiltro(estado)}
                >
                  {estado}
                </button>
              )
            )}
          </div>
        </div>

        {/* TARJETAS DE RUTAS */}
        <div className="rutas-tarjetas">

          {cargando ? (
            <div className="rutas-vacio">
              <p>Cargando tus rutas...</p>
            </div>
          ) : error ? (
            <div className="rutas-vacio">
              <span>⚠️</span>
              <h3>No se pudieron cargar las rutas</h3>
              <p>{error}</p>
            </div>
          ) : rutasFiltradas.length > 0 ? (
            rutasFiltradas.map((ruta) => (
              <article className="ruta-card" key={ruta.codigo}>

                <div className="ruta-card-superior">
                  <strong>{ruta.codigo}</strong>

                  <span className={`ruta-estado ${
                    ruta.estado === "Pendiente"
                      ? "pendiente"
                      : ruta.estado === "En proceso"
                      ? "proceso"
                      : "finalizada"
                  }`}>
                    {ruta.estado}
                  </span>
                </div>

                <div className="ruta-recorrido">

                  <div className="ruta-punto">
                    <span className="punto-origen"></span>
                    <div>
                      <small>Origen</small>
                      <strong>{ruta.origen}</strong>
                    </div>
                  </div>

                  <div className="ruta-linea"></div>

                  <div className="ruta-punto">
                    <span className="punto-destino"></span>
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
                    <strong>{ruta.vehiculo}</strong>
                  </div>

                  <div>
                    <small>Paquetes</small>
                    <strong>{ruta.paquetes}</strong>
                  </div>

                </div>

              </article>
            ))
          ) : (
            <div className="rutas-vacio">
              <span>📭</span>
              <h3>
                {rutas.length === 0
                  ? "Aún no tienes rutas asignadas"
                  : "No hay rutas en este estado"}
              </h3>
              <p>Prueba seleccionando otro filtro.</p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
