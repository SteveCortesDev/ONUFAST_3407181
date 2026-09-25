export function crearTarjeta(titulo, valor) {
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("tarjeta");

  tarjeta.innerHTML = `
    <h3>${titulo}</h3>
    <p>${valor}</p>
  `;

  return tarjeta;
}

export function crearTablaEnvios(envios) {
  const contenedor = document.createElement("div");
  contenedor.classList.add("tabla-contenedor");

  const tabla = document.createElement("table");

  tabla.innerHTML = `
    <thead>
      <tr>
        <th>Rastreo</th>
        <th>Usuario</th>
        <th>Tipo de envío</th>
        <th>Estado</th>
        <th>Ruta</th>
        <th>Destinatario</th>
        <th>Factura</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const cuerpo = tabla.querySelector("tbody");

  envios.forEach((envio) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>
        <strong>${envio.codigo_rastreo}</strong>
      </td>

      <td>
        ${envio.usuario}
      </td>

      <td>
        <span class="tipo-envio">
          ${envio.tipo_envio}
        </span>
      </td>

      <td>
        <span class="estado estado-${envio.estado_envio
          .toLowerCase()
          .replaceAll(" ", "-")}">
          ${envio.estado_envio}
        </span>
      </td>

      <td>
        <strong>${envio.codigo_ruta}</strong>
        <br>
        <small>
          ${envio.ciudad_origen} → ${envio.ciudad_destino}
        </small>
      </td>

      <td>
        ${envio.nombre_destinatario}
      </td>

      <td>
        <strong>$ ${Number(envio.total_pago).toLocaleString("es-CO")}</strong>
        <br>
        <small>${envio.metodo_pago}</small>
      </td>
    `;

    cuerpo.appendChild(fila);
  });

  contenedor.appendChild(tabla);

  return contenedor;
}

export function crearDetalleEnvio(envio) {
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("detalle-envio");

  tarjeta.innerHTML = `
    <div class="detalle-header">
      <div>
        <h3>${envio.codigo_rastreo}</h3>
        <p>${envio.usuario}</p>
      </div>

      <span class="estado">
        ${envio.estado_envio}
      </span>
    </div>

    <div class="detalle-grid">

      <div>
        <span>Ruta</span>
        <strong>${envio.codigo_ruta}</strong>
      </div>

      <div>
        <span>Recorrido</span>
        <strong>
          ${envio.ciudad_origen} → ${envio.ciudad_destino}
        </strong>
      </div>

      <div>
        <span>Tipo de vehículo</span>
        <strong>${envio.tipo_vehiculo}</strong>
      </div>

      <div>
        <span>Tiempo estimado</span>
        <strong>${envio.tiempo_estimado}</strong>
      </div>

      <div>
        <span>Destinatario</span>
        <strong>${envio.nombre_destinatario}</strong>
      </div>

      <div>
        <span>Paquete</span>
        <strong>${envio.descripcion_paquete}</strong>
      </div>

      <div>
        <span>Peso</span>
        <strong>${envio.peso} kg</strong>
      </div>

      <div>
        <span>Total factura</span>
        <strong>
          $ ${Number(envio.total_pago).toLocaleString("es-CO")}
        </strong>
      </div>

    </div>
  `;

  return tarjeta;
}