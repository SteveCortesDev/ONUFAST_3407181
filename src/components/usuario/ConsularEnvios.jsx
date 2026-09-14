import { useState } from "react";
import api from "../services/api";

function extraerMensajeError(error) {
    return (
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Ocurrió un error inesperado."
    );
}

export default function ConsultarEnvios() {
    const [codigoRastreo, setCodigoRastreo] = useState("");
    const [envio, setEnvio] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const consultarEnvio = async (event) => {
        event.preventDefault();

        if (!codigoRastreo.trim()) {
            setError("Digite un código de rastreo.");
            setEnvio(null);
            return;
        }

        setCargando(true);
        setError("");
        setMensaje("");
        setEnvio(null);

        try {
            const respuesta = await api.get(
                `/envios/rastreo/${codigoRastreo.trim()}`
            );

            setEnvio(respuesta.data);
            setMensaje("Envío encontrado correctamente.");
        } catch (error) {
            setError(extraerMensajeError(error));
        } finally {
            setCargando(false);
        }
    };

    return (
        <section className="seccion-contenido">
            <div className="encabezado-seccion">
                <h2>Consultar envío</h2>
                <p>
                    Consulte el estado de su paquete usando el código de
                    rastreo.
                </p>
            </div>

            <form onSubmit={consultarEnvio} className="formulario-rastreo">
                <div className="campo-formulario">
                    <label htmlFor="codigoRastreo">
                        Código de rastreo
                    </label>

                    <input
                        id="codigoRastreo"
                        type="text"
                        value={codigoRastreo}
                        onChange={(event) =>
                            setCodigoRastreo(event.target.value)
                        }
                        placeholder="Ejemplo: ONU-ABC1234567"
                    />
                </div>

                <button type="submit" disabled={cargando}>
                    {cargando ? "Consultando..." : "Consultar envío"}
                </button>
            </form>

            {mensaje && (
                <p className="mensaje-exito">
                    {mensaje}
                </p>
            )}

            {error && (
                <p className="mensaje-error">
                    {error}
                </p>
            )}

            {envio && (
                <div className="resultado-envio">
                    <h3>Información del envío</h3>

                    <p>
                        <strong>Código:</strong>{" "}
                        {envio.codigo_rastreo || envio.cod_rastreo || "No disponible"}
                    </p>

                    <p>
                        <strong>Estado:</strong>{" "}
                        {envio.estado || envio.estado_envio || "No disponible"}
                    </p>

                    <p>
                        <strong>Fecha de creación:</strong>{" "}
                        {envio.fecha_creacion || "No disponible"}
                    </p>

                    <p>
                        <strong>Descripción:</strong>{" "}
                        {envio.descripcion || "No disponible"}
                    </p>
                </div>
            )}
        </section>
    );
}