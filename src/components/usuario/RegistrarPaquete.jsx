import { useEffect, useState } from "react";
import api from "../../api";

const extraerMensajeError = (error) => {
    const detail = error.response?.data?.detail;

    if (typeof detail === "string") return detail;

    if (Array.isArray(detail)) {
        return detail.map((d) => d.msg).join(", ");
    }

    return "Ocurrió un error inesperado.";
};

export default function RegistrarPaquete({
    cargarEnvios
}) {

    // ============================================
    // ESTADOS
    // ============================================

    const [tiposEnvio, setTiposEnvio] = useState([]);
    const [cargandoTipos, setCargandoTipos] = useState(true);

    const [formPaquete, setFormPaquete] = useState({
        id_tipenvio: "",
        nombre_destinatario: "",
        documento_destinatario: "",
        peso: "",
        alto: "",
        largo: "",
        ancho: "",
        descripcion: "",
        origen: "",
        destino: ""
    });

    const [enviandoPaquete, setEnviandoPaquete] = useState(false);
    const [mensajePaquete, setMensajePaquete] = useState("");
    const [errorPaquete, setErrorPaquete] = useState("");

    // ============================================
    // CARGAR TIPOS DE ENVÍO
    // ============================================

    useEffect(() => {
        cargarTiposEnvio();
    }, []);

    const cargarTiposEnvio = async () => {

        try {

            setCargandoTipos(true);

            const response = await api.get("/tipos-envio/");

            setTiposEnvio(response.data);

        } catch (error) {

            console.error(
                "Error al cargar tipos de envío:",
                error
            );

            setErrorPaquete(
                "No se pudieron cargar los tipos de envío."
            );

        } finally {

            setCargandoTipos(false);
        }
    };

    // ============================================
    // CAMBIAR DATOS DEL FORMULARIO
    // ============================================

    const handleChangePaquete = (e) => {

        const { name, value } = e.target;

        setFormPaquete((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // ============================================
    // REGISTRAR PAQUETE
    // ============================================

    const enviarPaquete = async (e) => {

        e.preventDefault();

        setEnviandoPaquete(true);
        setErrorPaquete("");
        setMensajePaquete("");

        try {

            const response = await api.post(
                "/envios/registrar-paquete",
                {
                    id_tipenvio: Number(
                        formPaquete.id_tipenvio
                    ),

                    nombre_destinatario:
                        formPaquete.nombre_destinatario,

                    documento_destinatario:
                        formPaquete.documento_destinatario,

                    peso: Number(formPaquete.peso),

                    alto: Number(formPaquete.alto),

                    largo: Number(formPaquete.largo),

                    ancho: Number(formPaquete.ancho),

                    descripcion:
                        formPaquete.descripcion || null,

                    origen: formPaquete.origen,

                    destino: formPaquete.destino
                }
            );

            setMensajePaquete(
                `¡Paquete registrado! Código de rastreo: ${response.data.codigo_rastreo}`
            );

            // Limpiar formulario

            setFormPaquete({
                id_tipenvio: "",
                nombre_destinatario: "",
                documento_destinatario: "",
                peso: "",
                alto: "",
                largo: "",
                ancho: "",
                descripcion: "",
                origen: "",
                destino: ""
            });

            // Actualizar lista de envíos

            if (cargarEnvios) {
                cargarEnvios();
            }

        } catch (error) {

            console.error(
                "Error al registrar paquete:",
                error
            );

            setErrorPaquete(
                extraerMensajeError(error)
            );

        } finally {

            setEnviandoPaquete(false);
        }
    };

    // ============================================
    // RENDER
    // ============================================

    return (

        <section className="usuario-bienvenida">

            <div
                className="bienvenida-texto"
                style={{ width: "100%" }}
            >

                <h1>Registrar Paquete</h1>

                <p>
                    Completa los datos del destinatario
                    y del paquete para generar tu envío.
                </p>

                {/* MENSAJE DE ÉXITO */}

                {mensajePaquete && (

                    <div
                        style={{
                            background: "#1e3a2f",
                            color: "#4ade80",
                            padding: "12px 16px",
                            borderRadius: "8px",
                            marginBottom: "15px"
                        }}
                    >
                        {mensajePaquete}
                    </div>

                )}

                {/* MENSAJE DE ERROR */}

                {errorPaquete && (

                    <div
                        style={{
                            background: "#3a1e1e",
                            color: "#f87171",
                            padding: "12px 16px",
                            borderRadius: "8px",
                            marginBottom: "15px"
                        }}
                    >
                        {errorPaquete}
                    </div>

                )}

                <form onSubmit={enviarPaquete}>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "15px"
                        }}
                    >

                        {/* TIPO DE ENVÍO */}

                        <div>

                            <label>
                                Tipo de envío
                            </label>

                            <br />

                            <select
                                name="id_tipenvio"
                                value={
                                    formPaquete.id_tipenvio
                                }
                                onChange={
                                    handleChangePaquete
                                }
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px"
                                }}
                            >

                                <option value="">
                                    {cargandoTipos
                                        ? "Cargando..."
                                        : "Selecciona..."
                                    }
                                </option>

                                {tiposEnvio.map((tipo) => (

                                    <option
                                        key={
                                            tipo.id_tipenvio
                                        }
                                        value={
                                            tipo.id_tipenvio
                                        }
                                    >
                                        {tipo.descripcion}
                                    </option>

                                ))}

                            </select>

                        </div>

                        {/* DESTINATARIO */}

                        <div>

                            <label>
                                Nombre del destinatario
                            </label>

                            <br />

                            <input
                                type="text"
                                name="nombre_destinatario"
                                value={
                                    formPaquete.nombre_destinatario
                                }
                                onChange={
                                    handleChangePaquete
                                }
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px"
                                }}
                            />

                        </div>

                        {/* DOCUMENTO */}

                        <div>

                            <label>
                                Documento del destinatario
                            </label>

                            <br />

                            <input
                                type="text"
                                name="documento_destinatario"
                                value={
                                    formPaquete.documento_destinatario
                                }
                                onChange={
                                    handleChangePaquete
                                }
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px"
                                }}
                            />

                        </div>

                        {/* DESCRIPCIÓN */}

                        <div>

                            <label>
                                Descripción del paquete
                            </label>

                            <br />

                            <input
                                type="text"
                                name="descripcion"
                                value={
                                    formPaquete.descripcion
                                }
                                onChange={
                                    handleChangePaquete
                                }
                                style={{
                                    width: "100%",
                                    padding: "10px"
                                }}
                            />

                        </div>

                        {/* ORIGEN */}

                        <div>

                            <label>
                                Origen
                            </label>

                            <br />

                            <input
                                type="text"
                                name="origen"
                                value={
                                    formPaquete.origen
                                }
                                onChange={
                                    handleChangePaquete
                                }
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px"
                                }}
                            />

                        </div>

                        {/* DESTINO */}

                        <div>

                            <label>
                                Destino
                            </label>

                            <br />

                            <input
                                type="text"
                                name="destino"
                                value={
                                    formPaquete.destino
                                }
                                onChange={
                                    handleChangePaquete
                                }
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px"
                                }}
                            />

                        </div>

                        {/* PESO */}

                        <div>

                            <label>
                                Peso (kg)
                            </label>

                            <br />

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="peso"
                                value={
                                    formPaquete.peso
                                }
                                onChange={
                                    handleChangePaquete
                                }
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px"
                                }}
                            />

                        </div>

                        {/* ALTO */}

                        <div>

                            <label>
                                Alto (cm)
                            </label>

                            <br />

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="alto"
                                value={
                                    formPaquete.alto
                                }
                                onChange={
                                    handleChangePaquete
                                }
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px"
                                }}
                            />

                        </div>

                        {/* LARGO */}

                        <div>

                            <label>
                                Largo (cm)
                            </label>

                            <br />

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="largo"
                                value={
                                    formPaquete.largo
                                }
                                onChange={
                                    handleChangePaquete
                                }
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px"
                                }}
                            />

                        </div>

                        {/* ANCHO */}

                        <div>

                            <label>
                                Ancho (cm)
                            </label>

                            <br />

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="ancho"
                                value={
                                    formPaquete.ancho
                                }
                                onChange={
                                    handleChangePaquete
                                }
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px"
                                }}
                            />

                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={enviandoPaquete}
                        className="admin-btn"
                        style={{
                            marginTop: "20px"
                        }}
                    >
                        {enviandoPaquete
                            ? "Registrando..."
                            : "Registrar Paquete"
                        }
                    </button>

                </form>

            </div>

        </section>
    );
}