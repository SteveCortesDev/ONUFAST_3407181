export default function MisEnvios({
    envios,
    cargandoEnvios,
    errorEnvios,
    cargarEnvios
}) {

    return (

        <section className="ultimos-envios">

            <div className="envios-header">

                <h2>
                    Mis Envíos
                </h2>

                <button onClick={cargarEnvios}>
                    🔄 Actualizar
                </button>

            </div>

            {cargandoEnvios ? (

                <p>
                    Cargando tus envíos...
                </p>

            ) : errorEnvios ? (

                <p>
                    {errorEnvios}
                </p>

            ) : envios.length === 0 ? (

                <p>
                    Aún no tienes envíos registrados.
                </p>

            ) : (

                <div className="tabla-envios">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Código de guía
                                </th>

                                <th>
                                    Tipo de envío
                                </th>

                                <th>
                                    Cantidad
                                </th>

                                <th>
                                    Paquetes registrados
                                </th>

                                <th>
                                    Estado
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {envios.map((envio) => (

                                <tr
                                    key={envio.id_pedido}
                                >

                                    <td>
                                        {envio.codigo_rastreo}
                                    </td>

                                    <td>
                                        {envio.tipo_envio}
                                    </td>

                                    <td>
                                        {envio.cantidad}
                                    </td>

                                    <td>
                                        {envio.paquetes_registrados}
                                    </td>

                                    <td>

                                        <span
                                            className={`estado estado-${envio.estado
                                                ?.toLowerCase()
                                                .replaceAll(
                                                    " ",
                                                    "-"
                                                )}`}
                                        >
                                            {envio.estado}
                                        </span>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </section>
    );
}