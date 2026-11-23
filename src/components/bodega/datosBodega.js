// ============================================
// DATOS DE EJEMPLO DEL PANEL DE BODEGA
// ============================================

export const CIUDADES = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Bucaramanga",
  "Cartagena",
  "Pereira",
  "Manizales"
];

export const ESTADOS = ["En bodega", "En tránsito", "Entregado"];

// Fecha actual en formato AAAA-MM-DD
export const hoyISO = () => new Date().toISOString().slice(0, 10);

// Fecha legible: 2026-11-14 → 14/11/2026
export const formatearFecha = (fecha) => {
  if (!fecha) return "—";
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
};

export const PAQUETES_INICIALES = [
  {
    id_paquete: 1,
    guia: "ONU-2401",
    remitente: "María Gómez",
    destinatario: "Carlos Ruiz",
    origen: "Bogotá",
    destino: "Medellín",
    peso: 2.4,
    dimensiones: "30x20x15 cm",
    estado: "En bodega",
    fecha: hoyISO(),
    rutaId: null
  },
  {
    id_paquete: 2,
    guia: "ONU-2402",
    remitente: "Tienda Andina",
    destinatario: "Laura Restrepo",
    origen: "Bogotá",
    destino: "Cali",
    peso: 5.1,
    dimensiones: "40x35x20 cm",
    estado: "En bodega",
    fecha: hoyISO(),
    rutaId: null
  },
  {
    id_paquete: 3,
    guia: "ONU-2403",
    remitente: "Ferretería El Tornillo",
    destinatario: "Jorge Medina",
    origen: "Bogotá",
    destino: "Barranquilla",
    peso: 8.7,
    dimensiones: "50x40x30 cm",
    estado: "En bodega",
    fecha: hoyISO(),
    rutaId: null
  },
  {
    id_paquete: 4,
    guia: "ONU-2404",
    remitente: "Ana Torres",
    destinatario: "Pedro Salazar",
    origen: "Bogotá",
    destino: "Medellín",
    peso: 1.2,
    dimensiones: "20x15x10 cm",
    estado: "En bodega",
    fecha: "2026-11-13",
    rutaId: null
  },
  {
    id_paquete: 5,
    guia: "ONU-2405",
    remitente: "Distribuidora Sur",
    destinatario: "Camila Ospina",
    origen: "Bogotá",
    destino: "Cali",
    peso: 3.6,
    dimensiones: "35x25x20 cm",
    estado: "En tránsito",
    fecha: "2026-11-13",
    rutaId: "RUT-002"
  },
  {
    id_paquete: 6,
    guia: "ONU-2406",
    remitente: "Librería Central",
    destinatario: "Andrés Peña",
    origen: "Bogotá",
    destino: "Bucaramanga",
    peso: 4.0,
    dimensiones: "45x30x25 cm",
    estado: "En bodega",
    fecha: "2026-11-12",
    rutaId: null
  },
  {
    id_paquete: 7,
    guia: "ONU-2407",
    remitente: "Moda Express",
    destinatario: "Sofía Cárdenas",
    origen: "Bogotá",
    destino: "Medellín",
    peso: 0.9,
    dimensiones: "25x20x10 cm",
    estado: "En tránsito",
    fecha: "2026-11-12",
    rutaId: "RUT-001"
  },
  {
    id_paquete: 8,
    guia: "ONU-2408",
    remitente: "Tecno Store",
    destinatario: "Ricardo López",
    origen: "Bogotá",
    destino: "Cali",
    peso: 2.2,
    dimensiones: "30x20x20 cm",
    estado: "Entregado",
    fecha: "2026-11-11",
    rutaId: "RUT-002"
  },
  {
    id_paquete: 9,
    guia: "ONU-2409",
    remitente: "Papelería Norte",
    destinatario: "Valentina Ríos",
    origen: "Bogotá",
    destino: "Barranquilla",
    peso: 6.3,
    dimensiones: "55x40x35 cm",
    estado: "En bodega",
    fecha: "2026-11-11",
    rutaId: null
  },
  {
    id_paquete: 10,
    guia: "ONU-2410",
    remitente: "Café de Origen",
    destinatario: "Mauricio Gómez",
    origen: "Bogotá",
    destino: "Bucaramanga",
    peso: 12.5,
    dimensiones: "60x50x40 cm",
    estado: "Entregado",
    fecha: "2026-11-10",
    rutaId: null
  }
];

export const RUTAS_INICIALES = [
  {
    id: "RUT-001",
    destino: "Medellín",
    conductor: "Carlos Pérez",
    vehiculo: "ABC-123",
    hora: "08:00 AM",
    capacidad: 20,
    estado: "Programada"
  },
  {
    id: "RUT-002",
    destino: "Cali",
    conductor: "Julián Ramírez",
    vehiculo: "XYZ-456",
    hora: "10:30 AM",
    capacidad: 15,
    estado: "En ruta"
  },
  {
    id: "RUT-003",
    destino: "Barranquilla",
    conductor: "Diana Castro",
    vehiculo: "JKL-789",
    hora: "02:00 PM",
    capacidad: 25,
    estado: "Programada"
  }
];

export const COLOR_ESTADO = {
  "En bodega": "amarillo",
  "En tránsito": "azul",
  Entregado: "verde",
  Programada: "gris",
  "En ruta": "azul",
  Despachada: "verde"
};
