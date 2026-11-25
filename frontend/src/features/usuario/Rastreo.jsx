import { useEffect, useState } from "react";
import api from "@/shared/api";
import MapaRastreo from "@/shared/components/MapaRastreo";

export default function Rastreo() {
  const [codigo, setCodigo] = useState("");
  const [datosRastreo, setDatosRastreo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const consultarRastreo = async (codigoABuscar, silencioso = false) => {
    const limpio = (codigoABuscar ?? codigo).trim().toUpperCase();
    if (!limpio) {
      if (!silencioso) {
        setError("Ingresa un código de rastreo para consultar tu paquete.");
      }
      return;
    }

    try {
      if (!silencioso) {
        setCargando(true);
        setError("");
      }

      const resp = await api.get(`/rastreo-gps/codigo/${encodeURIComponent(limpio)}`);
      setDatosRastreo(resp.data);
      setError("");
    } catch (err) {
      if (!silencioso) {
        setDatosRastreo(null);
        setError(
          err.response?.data?.detail ||
            "No se encontró información de rastreo para ese código."
        );
      }
    } finally {
      if (!silencioso) {
        setCargando(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    consultarRastreo(codigo, false);
  };

  useEffect(() => {
    if (!datosRastreo?.codigo_rastreo || !datosRastreo?.viaje_activo) return;

    const intervalo = setInterval(() => {
      consultarRastreo(datosRastreo.codigo_rastreo, true);
    }, 5000);

    return () => clearInterval(intervalo);
  }, [datosRastreo?.codigo_rastreo, datosRastreo?.viaje_activo]);

  const ubicacionActual = datosRastreo?.ubicacion_actual || null;
  const historial = Array.isArray(datosRastreo?.historial_ubicaciones)
    ? datosRastreo.historial_ubicaciones
    : [];

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ marginTop: 0 }}>Rastreo de envío</h1>
      <p style={{ color: "#6b6973", marginBottom: "18px" }}>
        Revisa el estado de tu paquete, el punto exacto de entrega y la posición del conductor en tiempo real.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Ej: ONU-90F1A5D872"
          style={{
            flex: 1,
            minWidth: "220px",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontSize: "14px",
          }}
        />
        <button
          type="submit"
          disabled={cargando}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            background: "#c9252c",
            color: "#ffffff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {cargando ? "Buscando..." : "Rastrear"}
        </button>
      </form>

      {error && (
        <div
          role="alert"
          style={{
            padding: "12px 14px",
            borderRadius: "8px",
            background: "#fee2e2",
            color: "#991b1b",
            marginBottom: "18px",
          }}
        >
          {error}
        </div>
      )}

      {datosRastreo && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            <div>
              <small style={{ color: "#6b6973" }}>Código</small>
              <div><strong>{datosRastreo.codigo_rastreo}</strong></div>
            </div>
            <div>
              <small style={{ color: "#6b6973" }}>Estado</small>
              <div><strong>{datosRastreo.estado || datosRastreo.estado_paquete}</strong></div>
            </div>
            <div>
              <small style={{ color: "#6b6973" }}>Destinatario</small>
              <div><strong>{datosRastreo.nombre_destinatario || "—"}</strong></div>
            </div>
            <div>
              <small style={{ color: "#6b6973" }}>Destino</small>
              <div>
                <strong>
                  {datosRastreo.direccion || datosRastreo.destino || "—"}
                </strong>
              </div>
            </div>
            <div>
              <small style={{ color: "#6b6973" }}>Conductor</small>
              <div>
                <strong>{datosRastreo.ruta?.nombre_conductor || "Por asignar"}</strong>
              </div>
            </div>
          </div>

          <MapaRastreo
            latitud={ubicacionActual?.latitud}
            longitud={ubicacionActual?.longitud}
            latitudDestino={datosRastreo.latitud_destino}
            longitudDestino={datosRastreo.longitud_destino}
            titulo={`Envío ${datosRastreo.codigo_rastreo}`}
            subtitulo={
              datosRastreo.direccion || datosRastreo.destino || "Seguimiento en mapa"
            }
            historial={historial}
            activo={Boolean(datosRastreo.viaje_activo)}
            actualizadoEn={ubicacionActual?.actualizado_en}
            height={380}
          />
        </div>
      )}
    </div>
  );
}