// ============================================
// CONSTANTES Y UTILIDADES DEL PANEL DE BODEGA
// Los datos ya no son de ejemplo: vienen del backend.
// ============================================

export const CIUDADES = [
  "Bogota",
  "Medellin",
  "Cali",
  "Barranquilla",
  "Bucaramanga",
  "Cartagena",
  "Pereira",
  "Manizales",
  "Tunja",
  "Ibague",
  "Chia"
];

// Estados a los que la bodega puede mover un paquete
export const ESTADOS = [
  "En bodega",
  "En camino",
  "Entregado",
  "Devuelto",
  "Cancelado"
];

// Todos los estados que existen en la tabla estado_envio
export const TODOS_LOS_ESTADOS = [
  "Confirmado",
  "Pendiente",
  ...ESTADOS
];

export const COLOR_ESTADO = {
  Pendiente: "gris",
  Confirmado: "gris",
  "En bodega": "amarillo",
  "En camino": "azul",
  Entregado: "verde",
  Devuelto: "rojo",
  Cancelado: "rojo",
  Programada: "gris",
  Despachada: "verde"
};

// Fecha actual en formato AAAA-MM-DD
export const hoyISO = () => new Date().toISOString().slice(0, 10);

// 2026-11-14T08:30:00 → 14/11/2026
export const formatearFecha = (valor) => {
  if (!valor) return "—";

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) return "—";

  return fecha.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

// 2026-11-14T08:30:00 → 08:30 a. m.
export const formatearHora = (valor) => {
  if (!valor) return "—";

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) return "—";

  return fecha.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit"
  });
};

// Mensaje legible para los errores de FastAPI
export const mensajeError = (error, porDefecto = "Ocurrió un error.") => {
  const detalle = error?.response?.data?.detail;

  if (typeof detalle === "string") return detalle;

  if (Array.isArray(detalle)) {
    return detalle.map((d) => d.msg).join(", ");
  }

  if (error?.message === "Network Error") {
    return "No se pudo conectar con el servidor. Revisa que el backend esté encendido.";
  }

  return porDefecto;
};
