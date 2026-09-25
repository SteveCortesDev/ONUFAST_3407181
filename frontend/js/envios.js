export function procesarEnvios(envios = []) {
  let totalEnvios = envios.length;
  let totalFacturado = 0;
  let totalPeso = 0;

  const estados = {};
  const tiposEnvio = {};
  const rutas = {};

  envios.forEach((envio) => {
    totalFacturado += Number(envio.total_pago) || 0;
    totalPeso += Number(envio.peso) || 0;

    estados[envio.estado_envio] =
      (estados[envio.estado_envio] || 0) + 1;

    tiposEnvio[envio.tipo_envio] =
      (tiposEnvio[envio.tipo_envio] || 0) + 1;

    rutas[envio.codigo_ruta] =
      (rutas[envio.codigo_ruta] || 0) + 1;
  });

  return {
    totalEnvios,
    totalFacturado,
    totalPeso,
    estados,
    tiposEnvio,
    rutas
  };
}