import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapaRastreo({
  latitud,
  longitud,
  titulo = "Ubicación en tiempo real",
  subtitulo = "",
  historial = [],
  activo = false,
  actualizadoEn = null,
  height = 360,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);

  const tieneCoordenadas =
    typeof latitud === "number" &&
    typeof longitud === "number" &&
    !Number.isNaN(latitud) &&
    !Number.isNaN(longitud);

  const latMostrar = tieneCoordenadas ? latitud : 4.711;
  const lngMostrar = tieneCoordenadas ? longitud : -74.0721;

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [latMostrar, lngMostrar],
      zoom: tieneCoordenadas ? 13 : 2,
      worldCopyJump: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    const markerIcon = L.divIcon({
      className: "onufast-gps-marker-wrapper",
      html: `<div style="
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: ${activo ? "#e9232b" : "#17161c"};
        border: 3px solid #ffffff;
        box-shadow: 0 0 0 5px rgba(233, 35, 43, 0.25), 0 4px 10px rgba(0,0,0,0.35);
      "></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    const marker = L.marker([latMostrar, lngMostrar], { icon: markerIcon }).addTo(map);
    marker.bindPopup(`<strong>${titulo}</strong><br/>Lat: ${latMostrar.toFixed(6)}, Lng: ${lngMostrar.toFixed(6)}`);

    const polyline = L.polyline([], {
      color: "#e9232b",
      weight: 3,
      opacity: 0.8,
    }).addTo(map);

    mapInstanceRef.current = map;
    markerRef.current = marker;
    polylineRef.current = polyline;

    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
      polylineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const marker = markerRef.current;
    const polyline = polylineRef.current;
    if (!map || !marker || !polyline) return;

    const nuevaPos = [latMostrar, lngMostrar];
    marker.setLatLng(nuevaPos);
    marker.setPopupContent(
      `<strong>${titulo}</strong><br/>Lat: ${latMostrar.toFixed(6)}, Lng: ${lngMostrar.toFixed(6)}`
    );

    if (tieneCoordenadas) {
      map.setView(nuevaPos, Math.max(map.getZoom(), 13), { animate: true });
    }

    const puntos = Array.isArray(historial)
      ? historial
          .filter(
            (p) =>
              typeof p?.latitud === "number" &&
              typeof p?.longitud === "number" &&
              !Number.isNaN(p.latitud) &&
              !Number.isNaN(p.longitud)
          )
          .map((p) => [p.latitud, p.longitud])
      : [];

    if (puntos.length === 0 && tieneCoordenadas) {
      puntos.push(nuevaPos);
    }

    polyline.setLatLngs(puntos);
  }, [latMostrar, lngMostrar, tieneCoordenadas, titulo, historial, activo]);

  return (
    <div
      style={{
        border: "1px solid #e8e8ed",
        borderRadius: "14px",
        background: "#ffffff",
        padding: "16px",
        boxShadow: "0 4px 14px rgba(20, 18, 28, 0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", color: "#23222a" }}>
            🌍 {titulo}
          </h3>
          {subtitulo && (
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b6973" }}>
              {subtitulo}
            </p>
          )}
        </div>

        <span
          style={{
            padding: "5px 12px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 700,
            background: activo ? "#e8f7ee" : "#f0f0f4",
            color: activo ? "#1c7a45" : "#6b6973",
          }}
        >
          {activo ? "● Transmisión activa" : "○ En espera / Sin transmisión"}
        </span>
      </div>

      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: `${height}px`,
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #dcdce4",
          zIndex: 1,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
          marginTop: "12px",
          fontSize: "12.5px",
          color: "#3a3841",
        }}
      >
        <div>
          <strong>Latitud:</strong> {tieneCoordenadas ? latMostrar.toFixed(6) : "Sin coordenada"}
          {" | "}
          <strong>Longitud:</strong> {tieneCoordenadas ? lngMostrar.toFixed(6) : "Sin coordenada"}
        </div>

        <div>
          <strong>Última actualización:</strong>{" "}
          {actualizadoEn
            ? new Date(actualizadoEn).toLocaleTimeString("es-CO")
            : "Aún no transmitida"}
        </div>
      </div>
    </div>
  );
}