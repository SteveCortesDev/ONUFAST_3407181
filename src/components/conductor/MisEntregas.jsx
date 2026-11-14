
import { useState } from "react";
import "./CSS/MisEntregas.css";

export default function MisEntregas() {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todas");

  const [entregas, setEntregas] = useState([
    {
      id: 1,
      codigo: "ONU-2026-001",
      destinatario: "Carlos Rodríguez",
      documento: "1023456789",
      direccion: "Calle 15 # 20-30, Soacha",
      ciudad: "Soacha",
      descripcion: "Caja de documentos",
      estado: "Pendiente"
    },
    {
      id: 2,
      codigo: "ONU-2026-002",
      destinatario: "Laura Martínez",
      documento: "1034567890",
      direccion: "Carrera 8 # 12-45, Chía",
      ciudad: "Chía",
      descripcion: "Paquete pequeño",
      estado: "En camino"
    },
    {
      id: 3,
      codigo: "ONU-2026-003",
      destinatario: "Andrés Gómez",
      documento: "1012345678",
      direccion: "Calle 10 # 5-20, Mosquera",
      ciudad: "Mosquera",
      descripcion: "Caja mediana",
      estado: "Entregado"
    },
    {
      id: 4,
      codigo: "ONU-2026-004",
      destinatario: "Sofía Ramírez",
      documento: "1009876543",
      direccion: "Carrera 12 # 8-15, Funza",
      ciudad: "Funza",
      descripcion: "Sobre",
      estado: "Pendiente"
    }
  ]);

  const actualizarEstado = (id, nuevoEstado) => {
    setEntregas((anteriores) =>
      anteriores.map((entrega) =>
        entrega.id === id
          ? { ...entrega, estado: nuevoEstado }
          : entrega
      )
    );
  };

  const entregasFiltradas = entregas.filter((entrega) => {
    const coincideBusqueda =
      entrega.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      entrega.destinatario.toLowerCase().includes(busqueda.toLowerCase()) ||
      entrega.ciudad.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtro === "Todas" || entrega.estado === filtro;

    return coincideBusqueda && coincideEstado;
  });

  const pendientes = entregas.filter(
    (e) => e.estado === "Pendiente"
  ).length;

  const enCamino = entregas.filter(
    (e) => e.estado === "En camino"
  ).length;

  const completadas = entregas.filter(
    (e) => e.estado === "Entregado"
  ).length;

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
        </div>

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

          {entregasFiltradas.length > 0 ? (
            entregasFiltradas.map((entrega) => (

              <article className="entrega-card" key={entrega.id}>

                <div className="entrega-card-header">
                  <div>
                    <span className="entrega-codigo">
                      {entrega.codigo}
                    </span>
                    <h3>{entrega.destinatario}</h3>
                  </div>

                  <span className={`entrega-estado ${
                    entrega.estado === "Pendiente"
                      ? "pendiente"
                      : entrega.estado === "En camino"
                      ? "en-camino"
                      : "entregado"
                  }`}>
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
                      onClick={() =>
                        actualizarEstado(entrega.id, "En camino")
                      }
                    >
                      Iniciar entrega
                    </button>
                  )}

                  {entrega.estado === "En camino" && (
                    <button
                      className="btn-finalizar-entrega"
                      onClick={() =>
                        actualizarEstado(entrega.id, "Entregado")
                      }
                    >
                      Marcar como entregado
                    </button>
                  )}

                  {entrega.estado === "Entregado" && (
                    <span className="entrega-completada">
                      ✓ Entrega completada
                    </span>
                  )}

                </div>

              </article>

            ))
          ) : (
            <div className="entregas-vacio">
              <span>📭</span>
              <h3>No se encontraron entregas</h3>
              <p>Intenta cambiar la búsqueda o el filtro.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
