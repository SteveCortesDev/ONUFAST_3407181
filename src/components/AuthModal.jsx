import { useState } from 'react';
import api from '../api';

export default function AuthModal({ isOpen, onClose, onLogin }) {

    const [activeTab, setActiveTab] = useState('login');

    // LOGIN
    const [nombre, setNombre] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [direccion, setDireccion] = useState('');

    // REGISTRO
    const [regNombre, setRegNombre] = useState('');
    const [regApellido, setRegApellido] = useState('');
    const [regTipoDocumento, setRegTipoDocumento] = useState('CC');
    const [regNumDocumento, setRegNumDocumento] = useState('');
    const [regCorreo, setRegCorreo] = useState('');
    const [regContrasena, setRegContrasena] = useState('');
    const [regTelefono, setRegTelefono] = useState('');

    const [error, setError] = useState('');
    const [errorRegistro, setErrorRegistro] = useState('');
    const [mensajeRegistro, setMensajeRegistro] = useState('');
    const [cargando, setCargando] = useState(false);
    const [cargandoRegistro, setCargandoRegistro] = useState(false);


    if (!isOpen) return null;


    // Helper para leer errores de FastAPI (string o lista de validación)
    const extraerMensajeError = (error) => {
        const detail = error.response?.data?.detail;
        if (typeof detail === "string") return detail;
        if (Array.isArray(detail)) {
            return detail.map((d) => d.msg).join(", ");
        }
        return "Ocurrió un error inesperado.";
    };


    // ═══════════════════════════════════════════════
    // LOGIN
    // ═══════════════════════════════════════════════

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            const response = await api.post('/auth/login', {
                nombre: nombre,
                contrasena: contrasena,
                direccion: direccion
            });

            const data = response.data;

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('id_usuario', data.id_usuario);
            localStorage.setItem('nombre_usuario', data.nombre);

            onLogin(data);
            onClose();

        } catch (error) {
            console.error(error);
            setError(extraerMensajeError(error));
        } finally {
            setCargando(false);
        }
    };


    // ═══════════════════════════════════════════════
    // REGISTRO
    // ═══════════════════════════════════════════════

    const handleRegistro = async (e) => {
        e.preventDefault();

        setErrorRegistro('');
        setMensajeRegistro('');
        setCargandoRegistro(true);

        try {
            const response = await api.post('/auth/registro', {
                nombre: regNombre,
                apellido: regApellido,
                tipo_documento: regTipoDocumento,
                num_documento: regNumDocumento,
                correo: regCorreo,
                contrasena: regContrasena,
                telefono: regTelefono || null
            });

            setMensajeRegistro(
                `¡Cuenta creada, ${response.data.nombre}! Ahora inicia sesión.`
            );

            // Limpiar formulario
            setRegNombre('');
            setRegApellido('');
            setRegTipoDocumento('CC');
            setRegNumDocumento('');
            setRegCorreo('');
            setRegContrasena('');
            setRegTelefono('');

            // Pre-llenar el nombre completo en el tab de login
            setNombre(`${response.data.nombre}`);

            // Cambiar a la pestaña de login después de 1.5s
            setTimeout(() => {
                setActiveTab('login');
                setMensajeRegistro('');
            }, 1500);

        } catch (error) {
            console.error(error);
            setErrorRegistro(extraerMensajeError(error));
        } finally {
            setCargandoRegistro(false);
        }
    };


    return (

        <div className="modal-overlay" onClick={onClose}>

            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className="modal-header-black">
                    <img src="/LOGO_ONUFAST.jpg" alt="Onufast Logo" className="modal-logo" />
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>

                {/* TABS */}
                <div className="modal-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('register'); setError(''); setErrorRegistro(''); }}
                    >
                        Registrarse
                    </button>

                    <button
                        className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('login'); setError(''); setErrorRegistro(''); }}
                    >
                        Iniciar Sesión
                    </button>
                </div>


                {/* ═══════════════ LOGIN ═══════════════ */}
                {activeTab === 'login' ? (

                    <form className="modal-form" onSubmit={handleLogin}>

                        <div className="input-group">
                            <label>Nombre completo</label>
                            <input
                                type="text"
                                placeholder="Ej: María López"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Dirección</label>
                            <input
                                type="text"
                                placeholder="Dirección de entrega"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                required
                            />
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <button type="submit" className="btn-submit" disabled={cargando}>
                            {cargando ? 'Iniciando...' : 'Iniciar'}
                        </button>

                    </form>

                ) : (

                    /* ═══════════════ REGISTRO ═══════════════ */

                    <form className="modal-form" onSubmit={handleRegistro}>

                        <div className="input-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                placeholder="Ej: María"
                                value={regNombre}
                                onChange={(e) => setRegNombre(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Apellido</label>
                            <input
                                type="text"
                                placeholder="Ej: López"
                                value={regApellido}
                                onChange={(e) => setRegApellido(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Tipo de documento</label>
                            <select
                                value={regTipoDocumento}
                                onChange={(e) => setRegTipoDocumento(e.target.value)}
                                required
                            >
                                <option value="CC">Cédula de ciudadanía</option>
                                <option value="TI">Tarjeta de identidad</option>
                                <option value="CE">Cédula de extranjería</option>
                                <option value="Pasaporte">Pasaporte</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Número de documento</label>
                            <input
                                type="text"
                                placeholder="Ej: 1029384756"
                                value={regNumDocumento}
                                onChange={(e) => setRegNumDocumento(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Correo</label>
                            <input
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={regCorreo}
                                onChange={(e) => setRegCorreo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={regContrasena}
                                onChange={(e) => setRegContrasena(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="input-group">
                            <label>Teléfono (opcional)</label>
                            <input
                                type="text"
                                placeholder="Ej: 3001234567"
                                value={regTelefono}
                                onChange={(e) => setRegTelefono(e.target.value)}
                            />
                        </div>

                        {mensajeRegistro && (
                            <div className="auth-error" style={{ background: "#1e3a2f", color: "#4ade80" }}>
                                {mensajeRegistro}
                            </div>
                        )}

                        {errorRegistro && <div className="auth-error">{errorRegistro}</div>}

                        <button type="submit" className="btn-submit" disabled={cargandoRegistro}>
                            {cargandoRegistro ? 'Creando cuenta...' : 'Registrarme'}
                        </button>

                    </form>

                )}

            </div>

        </div>

    );
}