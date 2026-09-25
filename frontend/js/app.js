import { obtenerEnvios } from "./servicio.js";
import { procesarEnvios } from "./envios.js";
import {
  crearTarjeta,
  crearTablaEnvios,
  crearDetalleEnvio
} from "./componentes.js";

async function iniciarAplicacion() {
  try {
    // 1. Obtener los datos
    const envios = await obtenerEnvios();

    // 2. Procesar los datos
    const metricas = procesarEnvios(envios);

    console.log("Resultado de la consulta multitabla:", envios);
    console.log("Métricas:", metricas);

    // 3. Crear tarjetas de resumen
    const contenedorResumen = document.querySelector("#resumen");

    contenedorResumen.appendChild(
      crearTarjeta(
        "Total de envíos",
        metricas.totalEnvios
      )
    );

    contenedorResumen.appendChild(
      crearTarjeta(
        "Total facturado",
        `$ ${metricas.totalFacturado.toLocaleString("es-CO")}`
      )
    );

    contenedorResumen.appendChild(
      crearTarjeta(
        "Peso total",
        `${metricas.totalPeso.toFixed(2)} kg`
      )
    );

    // 4. Crear tabla de la consulta multitabla
    const contenedorEnvios =
      document.querySelector("#envios");

    const tabla = crearTablaEnvios(envios);

    contenedorEnvios.appendChild(tabla);

    // 5. Crear detalles
    const contenedorDetalles =
      document.querySelector("#detalles");

    envios.forEach((envio) => {
      contenedorDetalles.appendChild(
        crearDetalleEnvio(envio)
      );
    });

  } catch (error) {
    console.error(
      "No fue posible iniciar la aplicación:",
      error
    );
  }
}

iniciarAplicacion();