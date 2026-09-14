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

// ============================================
// DEFINICIÓN DE LOS PASOS DEL ASISTENTE
// ============================================

const PASOS = [
    {
        numero: 1,
        icono: "🚚",
        titulo: "Tipo de envío",
        campos: [
            "id_tipenvio",
            "nombre_destinatario",
            "documento_destinatario"
        ]
    },
    {
        numero: 2,
        icono: "📦",
        titulo: "Información del paquete",
        campos: ["descripcion", "peso", "alto", "largo", "ancho"]
    },
    {
        numero: 3,
        icono: "📍",
        titulo: "Dónde es el envío",
        campos: ["origen", "destino"]
    },
    {
        numero: 4,
        icono: "✅",
        titulo: "Confirmación",
        campos: []
    }
];

export default function RegistrarPaquete({
    cargarEnvios
}) {

    // ============================================
    // ESTADOS
    // ============================================

    const [tiposEnvio, setTiposEnvio] = useState([]);
    const [cargandoTipos, setCargandoTipos] = useState(true);

    const [paso, setPaso] = useState(1);

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
    // NAVEGACIÓN ENTRE PASOS
    // ============================================

    const pasoActual = PASOS[paso - 1];

    const pasoEsValido = () => {

    return pasoActual.campos.every((campo) => {

        const valor = formPaquete[campo];

        // La descripción es opcional
        if (campo === "descripcion") {
            return true;
        }

        // Verificar que el campo tenga información
        if (
            valor === null ||
            valor === undefined ||
            String(valor).trim() === ""
        ) {
            return false;
        }

        return true;
    });
};

    const irAlSiguientePaso = () => {

        setErrorPaquete("");

        if (!pasoEsValido()) {

            setErrorPaquete(
                "Por favor completa todos los campos antes de continuar."
            );

            return;
        }

        setPaso((actual) =>
            Math.min(actual + 1, PASOS.length)
        );
    };

    const irAlPasoAnterior = () => {

        setErrorPaquete("");

        setPaso((actual) => Math.max(actual - 1, 1));
    };

    const obtenerNombreTipoEnvio = () => {

        const tipo = tiposEnvio.find(
            (t) =>
                String(t.id_tipenvio) ===
                String(formPaquete.id_tipenvio)
        );

        return tipo ? tipo.descripcion : "—";
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

            // Volver al primer paso del asistente

            setPaso(1);

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

        <section className="wizard-card">

            {/* ==========================================
                ENCABEZADO
            ========================================== */}

            <div className="wizard-top">

                <div className="wizard-intro">

                    <h1>Programa tu envío</h1>

                    <p>
                        Completa el formulario en 4 pasos
                        para registrar tu pedido de forma
                        rápida y segura.
                    </p>

                </div>

                <div className="wizard-truck">
                    🚚
                </div>

            </div>

            {/* ==========================================
                INDICADOR DE PASOS
            ========================================== */}

            <div className="wizard-steps">

                {PASOS.map((p, index) => (

                    <div
                        key={p.numero}
                        style={{
                            display: "flex",
                            alignItems: "center"
                        }}
                    >

                        <div
                            className={
                                "wizard-step-circle" +
                                (p.numero === paso
                                    ? " activo"
                                    : p.numero < paso
                                    ? " completado"
                                    : "")
                            }
                        >
                            {p.numero < paso
                                ? "✓"
                                : p.numero}
                        </div>

                        {index < PASOS.length - 1 && (
                            <div className="wizard-step-line" />
                        )}

                    </div>

                ))}

            </div>

            {/* MENSAJE DE ÉXITO */}

            {mensajePaquete && (

                <div className="wizard-mensaje wizard-mensaje-exito">
                    {mensajePaquete}
                </div>

            )}

            {/* MENSAJE DE ERROR */}

            {errorPaquete && (

                <div className="wizard-mensaje wizard-mensaje-error">
                    {errorPaquete}
                </div>

            )}

            {/* ==========================================
                TÍTULO DEL PASO ACTUAL
            ========================================== */}

            <div className="wizard-seccion-titulo">
                <span>{pasoActual.icono}</span>
                {pasoActual.titulo}
            </div>

            <form
                className="wizard-form"
                onSubmit={enviarPaquete}
            >

                {/* ======================================
                    PASO 1 — TIPO DE ENVÍO
                ====================================== */}

                {paso === 1 && (

                    <div className="wizard-grid">

                        <div>

                            <label>Tipo de envío</label>

                            <select
  name="id_tipenvio"
  value={formPaquete.id_tipenvio || ""}
  onChange={handleChangePaquete}
  required
>
  <option value="" disabled>
    {cargandoTipos ? "Cargando..." : "Selecciona..."}
  </option>

  {!cargandoTipos &&
    tiposEnvio.map((tipo) => (
      <option
        key={tipo.id_tipenvio}
        value={tipo.id_tipenvio}
      >
        {tipo.descripcion}
      </option>
    ))}
</select>


                        </div>

                        <div>

                            <label>
                                Nombre del destinatario
                            </label>

                            <input
                                type="text"
                                name="nombre_destinatario"
                                value={
                                    formPaquete.nombre_destinatario
                                }
                                onChange={handleChangePaquete}
                                placeholder="Nombre completo"
                            />

                        </div>

                        <div>

                            <label>
                                Documento del destinatario
                            </label>

                            <input
                                type="text"
                                name="documento_destinatario"
                                value={
                                    formPaquete.documento_destinatario
                                }
                                onChange={handleChangePaquete}
                                placeholder="Número de documento"
                            />

                        </div>

                    </div>

                )}

                {/* ======================================
                    PASO 2 — INFORMACIÓN DEL PAQUETE
                ====================================== */}

                {paso === 2 && (

                    <div className="wizard-grid">

                        <div style={{ gridColumn: "1 / -1" }}>

                            <label>
                                Descripción del paquete
                            </label>

                            <input
                                type="text"
                                name="descripcion"
                                value={formPaquete.descripcion}
                                onChange={handleChangePaquete}
                                placeholder="Ej: Ropa, computador, lavadora..."
                            />

                        </div>

                        <div>

                            <label>Peso (kg)</label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="peso"
                                value={formPaquete.peso}
                                onChange={handleChangePaquete}
                                placeholder="0.0"
                            />

                        </div>

                        <div>

                            <label>Alto (cm)</label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="alto"
                                value={formPaquete.alto}
                                onChange={handleChangePaquete}
                                placeholder="0"
                            />

                        </div>

                        <div>

                            <label>Largo (cm)</label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="largo"
                                value={formPaquete.largo}
                                onChange={handleChangePaquete}
                                placeholder="0"
                            />

                        </div>

                        <div>

                            <label>Ancho (cm)</label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="ancho"
                                value={formPaquete.ancho}
                                onChange={handleChangePaquete}
                                placeholder="0"
                            />

                        </div>

                    </div>

                )}

                {/* ======================================
                    PASO 3 — DÓNDE ES EL ENVÍO
                ====================================== */}

                {paso === 3 && (

                    <div className="wizard-grid">

                        <div>

                            <label>Origen</label>

                            <input
                                type="text"
                                name="origen"
                                value={formPaquete.origen}
                                onChange={handleChangePaquete}
                                placeholder="Ciudad o dirección de recogida"
                            />

                        </div>

                        <div>

                            <label>Destino</label>

                            <input
                                type="text"
                                name="destino"
                                value={formPaquete.destino}
                                onChange={handleChangePaquete}
                                placeholder="Ciudad o dirección de entrega"
                            />

                        </div>

                    </div>

                )}

                {/* ======================================
                    PASO 4 — CONFIRMACIÓN
                ====================================== */}

                {paso === 4 && (

                    <div className="wizard-resumen">

                        <div className="wizard-resumen-fila">
                            <span>Tipo de envío</span>
                            <span>{obtenerNombreTipoEnvio()}</span>
                        </div>

                        <div className="wizard-resumen-fila">
                            <span>Destinatario</span>
                            <span>
                                {formPaquete.nombre_destinatario}
                            </span>
                        </div>

                        <div className="wizard-resumen-fila">
                            <span>Documento</span>
                            <span>
                                {formPaquete.documento_destinatario}
                            </span>
                        </div>

                        <div className="wizard-resumen-fila">
                            <span>Descripción</span>
                            <span>
                                {formPaquete.descripcion || "—"}
                            </span>
                        </div>

                        <div className="wizard-resumen-fila">
                            <span>Peso / Dimensiones</span>
                            <span>
                                {formPaquete.peso} kg ·{" "}
                                {formPaquete.alto}×
                                {formPaquete.largo}×
                                {formPaquete.ancho} cm
                            </span>
                        </div>

                        <div className="wizard-resumen-fila">
                            <span>Origen</span>
                            <span>{formPaquete.origen}</span>
                        </div>

                        <div className="wizard-resumen-fila">
                            <span>Destino</span>
                            <span>{formPaquete.destino}</span>
                        </div>

                    </div>

                )}

                {/* ======================================
                    BOTONES DE NAVEGACIÓN
                ====================================== */}

                <div className="wizard-botones">

                    <button
                        type="button"
                        className="wizard-btn-atras"
                        onClick={irAlPasoAnterior}
                        disabled={paso === 1}
                        style={{
                            visibility:
                                paso === 1
                                    ? "hidden"
                                    : "visible"
                        }}
                    >
                        ← Atrás
                    </button>

                    {paso < PASOS.length ? (

                        <button
                            type="button"
                            className="wizard-btn-continuar"
                            onClick={irAlSiguientePaso}
                        >
                            Continuar →
                        </button>

                    ) : (

                        <button
                            type="submit"
                            className="wizard-btn-continuar"
                            disabled={enviandoPaquete}
                        >
                            {enviandoPaquete
                                ? "Registrando..."
                                : "Finalizar"}
                        </button>

                    )}

                </div>

            </form>

        </section>
    );
}