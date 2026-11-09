import { useEffect, useState } from "react";
import api from "@/shared/api";
import { barriosBogota } from "@/features/envios/barriosBogota";

const extraerMensajeError = (error) => {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
        return detail.map((d) => d.msg).join(", ");
    }
    return "Ocurrió un error inesperado.";
};

const PASOS = [
    { numero: 1, icono: "🚚", titulo: "Tipo de envío", campos: ["id_tipenvio", "nombre_destinatario", "documento_destinatario", "telefono_destinatario"] },
    { numero: 2, icono: "📦", titulo: "Información del paquete", campos: ["descripcion", "peso", "alto", "largo", "ancho"] },
    { numero: 3, icono: "📍", titulo: "Dónde es el envío", campos: ["origen", "destino", "direccion", "barrio"] },
    { numero: 4, icono: "💳", titulo: "Pago y Confirmación", campos: [] } 
];

export default function RegistrarPaquete({ cargarEnvios }) {
    const [tiposEnvio, setTiposEnvio] = useState([]);
    const [cargandoTipos, setCargandoTipos] = useState(true);
    const [paso, setPaso] = useState(1);

    const [formPaquete, setFormPaquete] = useState({
        id_tipenvio: "",
        nombre_destinatario: "",
        documento_destinatario: "",
        telefono_destinatario: "",
        peso: "",
        alto: "",
        largo: "",
        ancho: "",
        descripcion: "",
        origen: "Bogotá",
        destino: "Bogotá",
        direccion: "",
        barrio: "",
        referencias: "",
        metodo_pago: "Efectivo",
        precio_envio: 0
    });

    const [enviandoPaquete, setEnviandoPaquete] = useState(false);
    const [mensajePaquete, setMensajePaquete] = useState("");
    const [errorPaquete, setErrorPaquete] = useState("");
    const [pagoExitoso, setPagoExitoso] = useState(null); 

    useEffect(() => {
        cargarTiposEnvio();
    }, []);

    useEffect(() => {
        const peso = parseFloat(formPaquete.peso) || 0;
        const tipo = parseInt(formPaquete.id_tipenvio) || 0;
        
        if (peso > 0 && tipo > 0) {
            let precioBase = tipo === 1 ? 35000 : 15000; 
            let precioPeso = peso * 1500; 
            let total = precioBase + precioPeso;
            
            setFormPaquete(prev => ({ ...prev, precio_envio: total }));
        }
    }, [formPaquete.peso, formPaquete.id_tipenvio]);

    const cargarTiposEnvio = async () => {
        try {
            setCargandoTipos(true);
            const response = await api.get("/tipos-envio/");
            setTiposEnvio(response.data);
        } catch (error) {
            setErrorPaquete("No se pudieron cargar los tipos de envío.");
        } finally {
            setCargandoTipos(false);
        }
    };

    const handleChangePaquete = (e) => {
        const { name, value } = e.target;
        setFormPaquete((prev) => ({ ...prev, [name]: value }));
    };

    const pasoActual = PASOS[paso - 1];

    const pasoEsValido = () => {
        if (pasoActual.campos.length === 0) return true;

        return pasoActual.campos.every((campo) => {
            const valor = formPaquete[campo];
            if (campo === "descripcion" || campo === "referencias") return true;
            if (valor === null || valor === undefined || String(valor).trim() === "") return false;
            return true;
        });
    };

    const irAlSiguientePaso = () => {
        setErrorPaquete("");
        if (!pasoEsValido()) {
            setErrorPaquete("Por favor completa todos los campos antes de continuar.");
            return;
        }
        setPaso((actual) => Math.min(actual + 1, PASOS.length));
    };

    const irAlPasoAnterior = () => {
        setErrorPaquete("");
        setPaso((actual) => Math.max(actual - 1, 1));
    };

    const obtenerNombreTipoEnvio = () => {
        const tipo = tiposEnvio.find((t) => String(t.id_tipenvio) === String(formPaquete.id_tipenvio));
        return tipo ? tipo.descripcion : "—";
    };

            const enviarPaquete = async (e) => {
        if (e) e.preventDefault();
        
        setEnviandoPaquete(true);
        setErrorPaquete("");
        setMensajePaquete("");

        try {
            // Simulamos que el banco valida la tarjeta (1.5 segundos)
            await new Promise(resolve => setTimeout(resolve, 1500));

            const response = await api.post("/envios/registrar-paquete", {
                id_tipenvio: Number(formPaquete.id_tipenvio),
                nombre_destinatario: formPaquete.nombre_destinatario,
                documento_destinatario: formPaquete.documento_destinatario,
                telefono_destinatario: formPaquete.telefono_destinatario,
                peso: Number(formPaquete.peso),
                alto: Number(formPaquete.alto),
                largo: Number(formPaquete.largo),
                ancho: Number(formPaquete.ancho),
                descripcion: formPaquete.descripcion || null,
                origen: formPaquete.origen,
                destino: formPaquete.destino,
                direccion: formPaquete.direccion,
                barrio: formPaquete.barrio,
                referencias: formPaquete.referencias || null,
                precio_envio: Number(formPaquete.precio_envio),
                metodo_pago: formPaquete.metodo_pago
            });

            // Guardamos el código generado en el estado y mostramos la pantalla de éxito
            setPagoExitoso(response.data.codigo_rastreo);
            if (cargarEnvios) cargarEnvios();
            
        } catch (error) {
            setErrorPaquete(extraerMensajeError(error));
        } finally {
            setEnviandoPaquete(false);
        }
    };

        // SI EL PAGO FUE EXITOSO, MOSTRAMOS ESTA PANTALLA
    if (pagoExitoso) {
        return (
            <section className="wizard-card" style={{ textAlign: "center", padding: "50px 20px" }}>
                <div style={{ fontSize: "60px", marginBottom: "20px" }}>🎉</div>
                <h1 style={{ color: "#2e7d32", marginBottom: "10px" }}>¡Pago Exitoso!</h1>
                <p style={{ fontSize: "18px", color: "#555", marginBottom: "30px" }}>
                    Tu paquete ha sido registrado en nuestro sistema.
                </p>
                
                <div style={{ background: "#f0f2f5", padding: "20px", borderRadius: "10px", display: "inline-block", marginBottom: "30px" }}>
                    <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#666" }}>Tu código de rastreo es:</p>
                    <h2 style={{ margin: 0, fontSize: "28px", letterSpacing: "2px", color: "#c9252c" }}>
                        {pagoExitoso}
                    </h2>
                </div>

                <br />
                
                <button 
                    className="wizard-btn-continuar" 
                    onClick={() => {
                        // Limpiamos todo para crear otro paquete
                        setPagoExitoso(null);
                        setFormPaquete({
                            id_tipenvio: "", nombre_destinatario: "", documento_destinatario: "", telefono_destinatario: "",
                            peso: "", alto: "", largo: "", ancho: "", descripcion: "", origen: "Bogotá", destino: "Bogotá",
                            direccion: "", barrio: "", referencias: "", metodo_pago: "Efectivo", precio_envio: 0
                        });
                        setPaso(1);
                    }}
                    style={{ padding: "12px 30px", fontSize: "16px" }}
                >
                    + Crear otro paquete
                </button>
            </section>
        );
    }

    return (
        <section className="wizard-card">
            <div className="wizard-top">
                <div className="wizard-intro">
                    <h1>Programa tu envío</h1>
                    <p>Completa el formulario en 4 pasos para registrar tu pedido de forma rápida y segura.</p>
                </div>
                <div className="wizard-truck">🚚</div>
            </div>

            <div className="wizard-steps">
                {PASOS.map((p, index) => (
                    <div key={p.numero} style={{ display: "flex", alignItems: "center" }}>
                        <div className={"wizard-step-circle" + (p.numero === paso ? " activo" : p.numero < paso ? " completado" : "")}>
                            {p.numero < paso ? "✓" : p.numero}
                        </div>
                        {index < PASOS.length - 1 && <div className="wizard-step-line" />}
                    </div>
                ))}
            </div>

            {mensajePaquete && <div className="wizard-mensaje wizard-mensaje-exito">{mensajePaquete}</div>}
            {errorPaquete && <div className="wizard-mensaje wizard-mensaje-error">{errorPaquete}</div>}

            <div className="wizard-seccion-titulo">
                <span>{pasoActual.icono}</span> {pasoActual.titulo}
            </div>

            <form className="wizard-form" onSubmit={enviarPaquete}>
                
                {paso === 1 && (
                    <div className="wizard-grid">
                        <div>
                            <label>Tipo de envío</label>
                            <select name="id_tipenvio" value={formPaquete.id_tipenvio} onChange={handleChangePaquete} required>
                                <option value="" disabled>{cargandoTipos ? "Cargando..." : "Selecciona..."}</option>
                                {!cargandoTipos && tiposEnvio.map((tipo) => (
                                    <option key={tipo.id_tipenvio} value={tipo.id_tipenvio}>{tipo.descripcion}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Nombre del destinatario</label>
                            <input type="text" name="nombre_destinatario" value={formPaquete.nombre_destinatario} onChange={handleChangePaquete} placeholder="Nombre completo" />
                        </div>
                        <div>
                            <label>Documento del destinatario</label>
                            <input type="text" name="documento_destinatario" value={formPaquete.documento_destinatario} onChange={handleChangePaquete} placeholder="Número de documento" />
                        </div>
                        <div>
                            <label>Teléfono del destinatario</label>
                            <input type="text" name="telefono_destinatario" value={formPaquete.telefono_destinatario} onChange={handleChangePaquete} placeholder="Ej: 3001234567" />
                        </div>
                    </div>
                )}

                {paso === 2 && (
                    <div className="wizard-grid">
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label>Descripción del paquete</label>
                            <input type="text" name="descripcion" value={formPaquete.descripcion} onChange={handleChangePaquete} placeholder="Ej: Ropa, computador, lavadora..." />
                        </div>
                        <div><label>Peso (kg)</label><input type="number" step="0.01" min="0" name="peso" value={formPaquete.peso} onChange={handleChangePaquete} placeholder="0.0" /></div>
                        <div><label>Alto (cm)</label><input type="number" step="0.01" min="0" name="alto" value={formPaquete.alto} onChange={handleChangePaquete} placeholder="0" /></div>
                        <div><label>Largo (cm)</label><input type="number" step="0.01" min="0" name="largo" value={formPaquete.largo} onChange={handleChangePaquete} placeholder="0" /></div>
                        <div><label>Ancho (cm)</label><input type="number" step="0.01" min="0" name="ancho" value={formPaquete.ancho} onChange={handleChangePaquete} placeholder="0" /></div>
                    </div>
                )}

                {paso === 3 && (
                    <div className="wizard-grid">
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label>Dirección exacta</label>
                            <input type="text" name="direccion" value={formPaquete.direccion} onChange={handleChangePaquete} placeholder="Ej: Calle 123 # 45 - 67 Apto 201" />
                        </div>
                        <div>
                            <label>Barrio (Bogotá)</label>
                            <select name="barrio" value={formPaquete.barrio} onChange={handleChangePaquete}>
                                <option value="">Selecciona tu barrio...</option>
                                {barriosBogota.map((b, i) => <option key={i} value={b}>{b}</option>)}
                                <option value="Otro">Otro (Escribir abajo)</option>
                            </select>
                        </div>
                        <div>
                            <label>Referencias (Opcional)</label>
                            <input type="text" name="referencias" value={formPaquete.referencias} onChange={handleChangePaquete} placeholder="Ej: Casa de rejas negras" />
                        </div>
                    </div>
                )}

                {paso === 4 && (
                    <div className="wizard-grid" style={{ gap: "30px" }}>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            
                            <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px", border: "1px solid #ddd" }}>
                                <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>📍 Detalles de Entrega</h4>
                                <p style={{ margin: "5px 0", fontSize: "14px" }}><strong>Destinatario:</strong> {formPaquete.nombre_destinatario}</p>
                                <p style={{ margin: "5px 0", fontSize: "14px" }}><strong>Teléfono:</strong> {formPaquete.telefono_destinatario}</p>
                                <p style={{ margin: "5px 0", fontSize: "14px" }}><strong>Dirección:</strong> {formPaquete.direccion}</p>
                                <p style={{ margin: "5px 0", fontSize: "14px" }}><strong>Barrio:</strong> {formPaquete.barrio}</p>
                            </div>

                            <div>
                                <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Método de pago</label>
                                <select 
                                    name="metodo_pago" 
                                    value={formPaquete.metodo_pago} 
                                    onChange={handleChangePaquete}
                                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                                >
                                    <option value="Efectivo">Efectivo contra entrega</option>
                                    <option value="Transferencia">Transferencia / Nequi / Daviplata</option>
                                    <option value="Tarjeta">Tarjeta de Crédito/Débito (Simulado)</option>
                                    <option value="PSE">PSE (Simulado)</option>
                                </select>
                            </div>

                            {formPaquete.metodo_pago === "Tarjeta" && (
                                <div style={{ background: "#e3f2fd", padding: "15px", borderRadius: "8px", border: "1px dashed #2196f3" }}>
                                    <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#1565c0" }}>💳 Pasarela de pago (Simulación)</p>
                                    <input type="text" placeholder="Número de tarjeta" style={{ width: "100%", padding: "8px", marginBottom: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <input type="text" placeholder="MM/YY" style={{ width: "50%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
                                        <input type="text" placeholder="CVC" style={{ width: "50%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f0f2f5", borderRadius: "12px", padding: "20px" }}>
                            
                            <div style={{ perspective: "1000px", margin: "20px 0" }}>
                                <div style={{
                                    width: "120px", height: "120px",
                                    background: "linear-gradient(135deg, #e0c293, #c49a6c)",
                                    transform: "rotateX(-20deg) rotateY(30deg)",
                                    boxShadow: "10px 20px 30px rgba(0,0,0,0.2)",
                                    border: "2px solid #8d5a2b",
                                    position: "relative",
                                    display: "flex", justifyContent: "center", alignItems: "center",
                                    transition: "all 0.5s ease"
                                }}>
                                    <span style={{ fontSize: "40px", transform: "rotateY(-30deg)" }}>📦</span>
                                    <div style={{ position: "absolute", top: "50%", width: "100%", height: "20px", background: "#8d5a2b", opacity: 0.3 }}></div>
                                    <div style={{ position: "absolute", left: "50%", width: "20px", height: "100%", background: "#8d5a2b", opacity: 0.3 }}></div>
                                </div>
                            </div>
                            
                            <p style={{ margin: "0 0 15px 0", fontSize: "14px", color: "#666", textAlign: "center" }}>
                                <strong>Dimensiones:</strong><br/>
                                {formPaquete.alto}cm x {formPaquete.largo}cm x {formPaquete.ancho}cm<br/>
                                Peso: {formPaquete.peso} kg
                            </p>

                            <div style={{ width: "100%", borderTop: "2px dashed #ccc", margin: "15px 0" }}></div>

                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "14px" }}>
                                <span>Tarifa base ({obtenerNombreTipoEnvio()}):</span>
                                <span>${(Number(formPaquete.id_tipenvio) === 1 ? 35000 : 15000).toLocaleString('es-CO')}</span>
                            </div>
                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "14px" }}>
                                <span>Recargo por peso:</span>
                                <span>${(Number(formPaquete.peso) * 1500).toLocaleString('es-CO')}</span>
                            </div>

                            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                                <span style={{ fontSize: "16px", fontWeight: "bold" }}>Total a Pagar:</span>
                                <span style={{ fontSize: "22px", fontWeight: "bold", color: "#c9252c" }}>
                                    ${Number(formPaquete.precio_envio).toLocaleString('es-CO')} COP
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                                <div className="wizard-botones">
                    <button 
                        type="button" 
                        className="wizard-btn-atras" 
                        onClick={irAlPasoAnterior} 
                        disabled={paso === 1 || enviandoPaquete} 
                        style={{ visibility: paso === 1 ? "hidden" : "visible" }}
                    >
                        ← Atrás
                    </button>
                    
                    {paso < PASOS.length ? (
                        <button type="button" className="wizard-btn-continuar" onClick={irAlSiguientePaso}>
                            Continuar →
                        </button>
                    ) : (
                        <button 
                            type="button" 
                            className="wizard-btn-continuar" 
                            onClick={enviarPaquete} 
                            disabled={enviandoPaquete}
                        >
                            {enviandoPaquete ? "Procesando pago... ⏳" : "Pagar y Generar Guía"}
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}