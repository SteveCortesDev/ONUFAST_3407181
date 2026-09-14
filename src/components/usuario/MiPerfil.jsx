export default function MiPerfil({
    usuario,
    cargandoPerfil,
    errorPerfil
}) {

    return (

        <section className="usuario-bienvenida">

            <div className="bienvenida-texto">

                <h1>
                    Mi Perfil
                </h1>

                {cargandoPerfil ? (

                    <p>
                        Cargando información...
                    </p>

                ) : errorPerfil ? (

                    <p>
                        {errorPerfil}
                    </p>

                ) : usuario ? (

                    <div className="perfil-datos">

                        <p>
                            <strong>
                                Nombre:
                            </strong>{" "}
                            {usuario.nombre}
                        </p>

                        <p>
                            <strong>
                                Correo:
                            </strong>{" "}
                            {usuario.correo}
                        </p>

                        <p>
                            <strong>
                                Teléfono:
                            </strong>{" "}
                            {usuario.telefono ||
                                "No registrado"}
                        </p>

                        <p>
                            <strong>
                                Tipo de documento:
                            </strong>{" "}
                            {usuario.tipo_documento}
                        </p>

                        <p>
                            <strong>
                                Número de documento:
                            </strong>{" "}
                            {usuario.num_documento}
                        </p>

                        <p>
                            <strong>
                                Dirección:
                            </strong>{" "}
                            {usuario.direccion ||
                                "No registrada"}
                        </p>

                    </div>

                ) : null}

            </div>

            <div className="bienvenida-imagen">

                <div className="paquete-imagen">
                    👤
                </div>

            </div>

        </section>
    );
}