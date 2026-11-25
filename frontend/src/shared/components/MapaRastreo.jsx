import { useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const aNumeroValido = (valor) => {
  if (valor === null || valor === undefined || valor === "") return null;
  const num = Number(valor);
  return Number.isFinite(num) ? num : null;
};

const calcularDistanciaKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function MapaRastreo({
  latitud,
  longitud,
  latitudDestino = null,
  longitudDestino = null,
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
  const destinoMarkerRef = useRef(null);
  const polylineRef = useRef(null);
  const lineaDestinoRef = useRef(null);

  const latNum = aNumeroValido(latitud);
  const lngNum = aNumeroValido(longitud);
  const latDestNum = aNumeroValido(latitudDestino);
  const lngDestNum = aNumeroValido(longitudDestino);

  const tieneCoordenadas = latNum !== null && lngNum !== null;
  const tieneDestino = latDestNum !== null && lngDestNum !== null;

  const latMostrar = tieneCoordenadas ? latNum : (tieneDestino ? latDestNum : 4.711);
  const lngMostrar = tieneCoordenadas ? lngNum : (tieneDestino ? lngDestNum : -74.0721);

  const distanciaTexto = useMemo(() => {
    if (!tieneCoordenadas || !tieneDestino) return null;
    const km = calcularDistanciaKm(latNum, lngNum, latDestNum, lngDestNum);
    if (km < 1) {
      return `${Math.round(km * 1000)} m restantes`;
    }
    return `${km.toFixed(2)} km restantes`;
  }, [tieneCoordenadas, tieneDestino, latNum, lngNum, latDestNum, lngDestNum]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [latMostrar, lngMostrar],
      zoom: tieneCoordenadas || tieneDestino ? 14 : 2,
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

    const destinoIcon = L.divIcon({
      className: "onufast-dest-marker-wrapper",
      html: `<div style="
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #2563eb;
        border: 3px solid #ffffff;
        box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.25), 0 4px 10px rgba(0,0,0,0.35);
      "></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    const marker = L.marker([latMostrar, lngMostrar], { icon: markerIcon }).addTo(map);
    marker.bindPopup(`<strong>${titulo}</strong><br/>Lat: ${latMostrar.toFixed(6)}, Lng: ${lngMostrar.toFixed(6)}`);

    const destinoMarker = L.marker([latMostrar, lngMostrar], { icon: destinoIcon });
    if (tieneDestino) {
      destinoMarker.setLatLng([latDestNum, lngDestNum]);
      destinoMarker.bindPopup(`<strong>🏠 Punto de entrega</strong><br/>Lat: ${latDestNum.toFixed(6)}, Lng: ${lngDestNum.toFixed(6)}`);
      destinoMarker.addTo(map);
    }

    const polyline = L.polyline([], {
      color: "#e9232b",
      weight: 3,
      opacity: 0.85,
    }).addTo(map);

    const lineaDestino = L.polyline([], {
      color: "#2563eb",
      weight: 3,
      dashArray: "7, 8",
      opacity: 0.85,
    }).addTo(map);

    mapInstanceRef.current = map;
    markerRef.current = marker;
    destinoMarkerRef.current = destinoMarker;
    polylineRef.current = polyline;
    lineaDestinoRef.current = lineaDestino;

    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
      destinoMarkerRef.current = null;
      polylineRef.current = null;
      lineaDestinoRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const marker = markerRef.current;
    const destinoMarker = destinoMarkerRef.current;
    const polyline = polylineRef.current;
    const lineaDestino = lineaDestinoRef.current;
    if (!map || !marker || !polyline || !lineaDestino) return;

    const nuevaPos = [latMostrar, lngMostrar];
    marker.setLatLng(nuevaPos);
    marker.setPopupContent(
      `<strong>${titulo}</strong><br/>Lat: ${latMostrar.toFixed(6)}, Lng: ${lngMostrar.toFixed(6)}`
    );

    if (destinoMarker) {
      if (tieneDestino) {
        destinoMarker.setLatLng([latDestNum, lngDestNum]);
        destinoMarker.bindPopup(
          `<strong>🏠 Punto de entrega</strong><br/>Lat: ${latDestNum.toFixed(6)}, Lng: ${lngDestNum.toFixed(6)}`
        );
        if (!map.hasLayer(destinoMarker)) {
          destinoMarker.addTo(map);
        }
      } else if (map.hasLayer(destinoMarker)) {
        map.removeLayer(destinoMarker);
      }
    }

    const puntos = Array.isArray(historial)
      ? historial
          .map((p) => {
            const pLat = aNumeroValido(p?.latitud);
            const pLng = aNumeroValido(p?.longitud);
            return pLat !== null && pLng !== null ? [pLat, pLng] : null;
          })
          .filter(Boolean)
      : [];

    if (puntos.length === 0 && tieneCoordenadas) {
      puntos.push(nuevaPos);
    }

    polyline.setLatLngs(puntos);

    if (tieneCoordenadas && tieneDestino) {
      const posDest = [latDestNum, lngDestNum];
      lineaDestino.setLatLngs([nuevaPos, posDest]);
      const bounds = L.latLngBounds([nuevaPos, posDest]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    } else {
      lineaDestino.setLatLngs([]);
      if (tieneCoordenadas) {
        map.setView(nuevaPos, Math.max(map.getZoom(), 14), { animate: true });
      } else if (tieneDestino) {
        map.setView([latDestNum, lngDestNum], Math.max(map.getZoom(), 14), { animate: true });
      }
    }
  }, [
    latMostrar,
    lngMostrar,
    tieneCoordenadas,
    tieneDestino,
    latNum,
    lngNum,
    latDestNum,
    lngDestNum,
    titulo,
    historial,
    activo,
  ]);

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

        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          {distanciaTexto && (
            <span
              style={{
                padding: "5px 12px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
                background: "#eff6ff",
                color: "#1d4ed8",
              }}
            >
              📏 {distanciaTexto}
            </span>
          )}

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
          <strong>Conductor:</strong>{" "}
          {tieneCoordenadas ? `${latNum.toFixed(6)}, ${lngNum.toFixed(6)}` : "Sin coordenada"}
          {tieneDestino && (
            <>
              {" · "}
              <strong>Destino:</strong> {latDestNum.toFixed(6)}, {lngDestNum.toFixed(6)}
            </>
          )}
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