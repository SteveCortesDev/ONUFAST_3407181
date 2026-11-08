function PanelUsuario({
    usuario,
    estadisticas,
    envios,
    cargandoEnvios,
    errorEnvios,
    cambiarMenu,
    navigate
}) {

    return (
        <>
            {/* ==================================================
                PANEL PRINCIPAL
            ================================================== */}

            {/* BIENVENIDA */}
            <section className="usuario-bienvenida">

                <div className="bienvenida-texto">

                    <h1>
                        ¡Hola, {usuario?.nombre?.split(" ")[0] || "usuario"}!
                    </h1>

                    <p>
                        Bienvenido al panel de usuario de ONUFAST,
                        tu aliado confiable en envíos
                    </p>

                    <p>
                        Desde aquí puedes gestionar tus envíos
                        de forma rápida y segura.
                    </p>

                </div>

                <div className="bienvenida-imagen">
                    <div className="paquete-imagen">📦</div>
                </div>

            </section>


            {/* ==================================================
                RESUMEN DE ENVÍOS
            ================================================== */}

            <section className="resumen">

                <div className="seccion-titulo">
                    <h2>Resumen de tus envíos</h2>
                </div>

                <div className="estadisticas-grid">

                    <div className="estadistica-card">
                        <div className="estadistica-icono">📦</div>

                        <div>
                            <strong>{estadisticas.total}</strong>
                            <span>Total enviados</span>
                        </div>
                    </div>


                    <div className="estadistica-card">
                        <div className="estadistica-icono">🚚</div>

                        <div>
                            <strong>{estadisticas.camino}</strong>
                            <span>En camino</span>
                        </div>
                    </div>


                    <div className="estadistica-card">
                        <div className="estadistica-icono">✓</div>

                        <div>
                            <strong>{estadisticas.entregados}</strong>
                            <span>Entregados</span>
                        </div>
                    </div>


                    <div className="estadistica-card">
                        <div className="estadistica-icono">◷</div>

                        <div>
                            <strong>{estadisticas.pendientes}</strong>
                            <span>Pendientes</span>
                        </div>
                    </div>

                </div>

            </section>


            {/* ==================================================
                ACCIONES RÁPIDAS
            ================================================== */}

            <section className="acciones">

                <h2>Acciones rápidas</h2>

                <div className="acciones-grid">

                    <div className="accion-card">

                        <div className="accion-icono">📦</div>

                        <h3>Registrar Paquete</h3>

                        <p>
                            Crea un nuevo paquete y realiza un envío.
                        </p>

                        <button
                            onClick={() => cambiarMenu("paquete")}
                        >
                            Comenzar →
                        </button>

                    </div>


                    <div className="accion-card">

                        <div className="accion-icono">🚚</div>

                        <h3>Mis Envíos</h3>

                        <p>
                            Consulta y administra todos tus envíos.
                        </p>

                        <button
                            onClick={() => cambiarMenu("envios")}
                        >
                            Ver envíos →
                        </button>

                    </div>


                    <div className="accion-card">

                        <div className="accion-icono">🔍</div>

                        <h3>Rastrear Envío</h3>

                        <p>
                            Ingresa tu código de guía y consulta el estado.
                        </p>

                        <button
                            onClick={() => navigate("/rastreo")}
                        >
                            Rastrear →
                        </button>

                    </div>


                    <div className="accion-card">

                        <div className="accion-icono">👤</div>

                        <h3>Mi Perfil</h3>

                        <p>
                            Consulta tus datos personales.
                        </p>

                        <button
                            onClick={() => cambiarMenu("perfil")}
                        >
                            Ver perfil →
                        </button>

                    </div>

                </div>

            </section>


            {/* ==================================================
                ÚLTIMOS ENVÍOS
            ================================================== */}

            <section className="ultimos-envios">

                <div className="envios-header">

                    <h2>Últimos envíos</h2>

                    <button
                        onClick={() => cambiarMenu("envios")}
                    >
                        Ver todos mis envíos →
                    </button>

                </div>


                <div className="tabla-envios">

                    {cargandoEnvios ? (

                        <p>Cargando envíos...</p>

                    ) : errorEnvios ? (

                        <p>{errorEnvios}</p>

                    ) : envios.length === 0 ? (

                        <p>Aún no tienes envíos registrados.</p>

                    ) : (

                        <table>

                            <thead>

                                <tr>
                                    <th>Código de guía</th>
                                    <th>Tipo de envío</th>
                                    <th>Cantidad</th>
                                    <th>Estado</th>
                                    <th>Paquetes</th>
                                </tr>

                            </thead>


                            <tbody>

                                {envios.slice(0, 4).map((envio) => (

                                    <tr key={envio.id_pedido}>

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

                                            <span
                                                className={`estado estado-${envio.estado
                                                    ?.toLowerCase()
                                                    .replaceAll(" ", "-")}`}
                                            >
                                                {envio.estado}
                                            </span>

                                        </td>

                                        <td>
                                            {envio.paquetes_registrados}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

            </section>

        </>
    );
}

export default PanelUsuario;