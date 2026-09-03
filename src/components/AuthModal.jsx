import { useState } from 'react';
import api from '../api';

export default function AuthModal({ isOpen, onClose, onLogin }) {

    const [activeTab, setActiveTab] = useState('login');

    const [nombre, setNombre] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [direccion, setDireccion] = useState('');

    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);


    if (!isOpen) return null;


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


            // Guardar token

            localStorage.setItem(
                'token',
                data.access_token
            );


            // Guardar información del usuario

            localStorage.setItem(
                'id_usuario',
                data.id_usuario
            );

            localStorage.setItem(
                'nombre_usuario',
                data.nombre
            );


            // Avisar a App.jsx que el login fue exitoso

            onLogin(data);

            onClose();


        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.detail ||
                'No se pudo iniciar sesión.'
            );

        } finally {

            setCargando(false);

        }
    };


    return (

        <div
            className="modal-overlay"
            onClick={onClose}
        >

            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >

                {/* HEADER */}

                <div className="modal-header-black">

                    <img
                        src="/LOGO_ONUFAST.jpg"
                        alt="Onufast Logo"
                        className="modal-logo"
                    />

                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                    >
                        &times;
                    </button>

                </div>


                {/* TABS */}

                <div className="modal-tabs">

                    <button
                        className={`tab-btn ${
                            activeTab === 'register'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() => {
                            setActiveTab('register');
                            setError('');
                        }}
                    >
                        Registrarse
                    </button>


                    <button
                        className={`tab-btn ${
                            activeTab === 'login'
                                ? 'active'
                                : ''
                        }`}
                        onClick={() => {
                            setActiveTab('login');
                            setError('');
                        }}
                    >
                        Iniciar Sesión
                    </button>

                </div>


                {/* ═══════════════════════════════════
                    LOGIN
                ═══════════════════════════════════ */}

                {activeTab === 'login' ? (

                    <form
                        className="modal-form"
                        onSubmit={handleLogin}
                    >

                        <div className="input-group">

                            <label>
                                Nombre completo
                            </label>

                            <input
                                type="text"
                                placeholder="Ej: María López"
                                value={nombre}
                                onChange={(e) =>
                                    setNombre(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="input-group">

                            <label>
                                Contraseña
                            </label>

                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={contrasena}
                                onChange={(e) =>
                                    setContrasena(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="input-group">

                            <label>
                                Dirección
                            </label>

                            <input
                                type="text"
                                placeholder="Dirección de entrega"
                                value={direccion}
                                onChange={(e) =>
                                    setDireccion(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="auth-error">
                                {error}
                            </div>

                        )}


                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={cargando}
                        >

                            {cargando
                                ? 'Iniciando...'
                                : 'Iniciar'
                            }

                        </button>

                    </form>

                ) : (

                    /* ═══════════════════════════════════
                       REGISTRO
                    ═══════════════════════════════════ */

                    <div className="modal-form">

                        <p>
                            El registro lo conectaremos
                            con tu endpoint `/auth/registro`.
                        </p>

                        <button
                            type="button"
                            className="btn-submit"
                            onClick={() => setActiveTab('login')}
                        >
                            Ir a iniciar sesión
                        </button>

                    </div>

                )}

            </div>

        </div>

    );
}