import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function SelectorUbicacionMapa({
  latitud,
  longitud,
  onChangeUbicacion,
  height = 290,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const callbackRef = useRef(onChangeUbicacion);
  callbackRef.current = onChangeUbicacion;

  const [estadoUbicacion, setEstadoUbicacion] = useState("");
  const [buscandoGps, setBuscandoGps] = useState(false);

  const tieneCoords =
    typeof latitud === "number" &&
    typeof longitud === "number" &&
    !Number.isNaN(latitud) &&
    !Number.isNaN(longitud);

  const latInicial = tieneCoords ? latitud : 4.711;
  const lngInicial = tieneCoords ? longitud : -74.0721;

  const solicitarUbicacionActual = () => {
    if (!navigator.geolocation) {
      setEstadoUbicacion("Tu navegador no soporta geolocalización. Haz clic en el mapa para marcar tu casa.");
      return;
    }

    setBuscandoGps(true);
    setEstadoUbicacion("Solicitando tu ubicación...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nuevaLat = Number(pos.coords.latitude.toFixed(6));
        const nuevaLng = Number(pos.coords.longitude.toFixed(6));
        callbackRef.current?.({ latitud: nuevaLat, longitud: nuevaLng });
        setEstadoUbicacion("Ubicación obtenida. Puedes hacer clic o arrastrar el pin para afinar el punto.");
        setBuscandoGps(false);
      },
      (err) => {
        setEstadoUbicacion(
          `No se pudo obtener GPS automáticamente (${err.message}). Haz clic en el mapa para ubicar tu casa.`
        );
        setBuscandoGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [latInicial, lngInicial],
      zoom: tieneCoords ? 15 : 12,
      worldCopyJump: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([latInicial, lngInicial], { draggable: true }).addTo(map);
    marker.bindPopup("Punto exacto de entrega");

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      callbackRef.current?.({
        latitud: Number(pos.lat.toFixed(6)),
        longitud: Number(pos.lng.toFixed(6)),
      });
      setEstadoUbicacion("Marcador movido manualmente.");
    });

    map.on("click", (e) => {
      const nuevaLat = Number(e.latlng.lat.toFixed(6));
      const nuevaLng = Number(e.latlng.lng.toFixed(6));
      marker.setLatLng([nuevaLat, nuevaLng]);
      callbackRef.current?.({ latitud: nuevaLat, longitud: nuevaLng });
      setEstadoUbicacion("Punto de entrega fijado en el mapa.");
    });

    mapRef.current = map;
    markerRef.current = marker;

    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker || !tieneCoords) return;

    const pos = [latitud, longitud];
    marker.setLatLng(pos);
    map.setView(pos, Math.max(map.getZoom(), 15), { animate: true });
  }, [latitud, longitud, tieneCoords]);

  return (
    <div
      style={{
        gridColumn: "1 / -1",
        border: "1px solid #d1d5db",
        borderRadius: "10px",
        padding: "14px",
        background: "#fafafa",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "10px",
        }}
      >
        <div>
          <strong>📌 Punto exacto de entrega en el mapa</strong>
          <p style={{ margin: "3px 0 0", fontSize: "12.5px", color: "#555" }}>
            Activa tu ubicación o haz clic / arrastra el pin al lugar exacto de recepción.
          </p>
        </div>

        <button
          type="button"
          onClick={solicitarUbicacionActual}
          disabled={buscandoGps}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "none",
            background: "#c9252c",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          {buscandoGps ? "Buscando ubicación..." : "📍 Usar mi ubicación actual"}
        </button>
      </div>

      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: `${height}px`,
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #cbd5e1",
          zIndex: 1,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "8px",
          fontSize: "12.5px",
          color: "#333",
        }}
      >
        <span>
          <strong>Latitud:</strong> {tieneCoords ? latitud.toFixed(6) : "No definida"} |{" "}
          <strong>Longitud:</strong> {tieneCoords ? longitud.toFixed(6) : "No definida"}
        </span>
        {estadoUbicacion && <span style={{ color: "#1565c0" }}>{estadoUbicacion}</span>}
      </div>
    </div>
  );
}