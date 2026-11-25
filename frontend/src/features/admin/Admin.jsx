import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminDashboard from './AdminDashboard';
import AdminEnvios from './AdminEnvios';
import AdminUsuarios from './AdminUsuarios';
import AdminVehiculos from './AdminVehiculos';
import AdminConductores from './AdminConductores';
import AdminBodega from './AdminBodega';
import AdminRutas from './AdminRutas';

import api from '@/shared/api';
import '@/styles/Admin.css';

export default function Admin() {
    const [seccionActiva, setSeccionActiva] = useState('dashboard');
    const [autorizado, setAutorizado] = useState(false);
    const [verificando, setVerificando] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        let activo = true;

        const verificarAdmin = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('No existe un token de autenticación.');
                navigate('/');
                return;
            }

            try {
                const response = await api.get('/usuarios/perfil');

                console.log('Perfil recibido:', response.data);

                const idRol = Number(response.data.id_rol);

                if (idRol === 1) {
                    if (activo) {
                        setAutorizado(true);
                    }
                } else {
                    console.warn('El usuario no tiene permisos de administrador.');
                    navigate('/usuario');
                }

            } catch (error) {
                console.error(
                    'Error al validar el administrador:',
                    error.response?.data || error.message
                );

                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('id_usuario');
                    localStorage.removeItem('nombre_usuario');
                    localStorage.removeItem('id_rol');
                    localStorage.removeItem('nombre_rol');
                }

                navigate('/');

            } finally {
                if (activo) {
                    setVerificando(false);
                }
            }
        };

        verificarAdmin();

        return () => {
            activo = false;
        };
    }, [navigate]);

    if (verificando) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: '#111217',
                    color: 'white'
                }}
            >
                <h2>Verificando acceso al panel...</h2>
            </div>
        );
    }

    if (!autorizado) {
        return null;
    }

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'envios', label: 'Envíos', icon: '📦' },
        { id: 'rutas', label: 'Rutas', icon: '🗺️' },
        { id: 'usuarios', label: 'Usuarios', icon: '👥' },
        { id: 'vehiculos', label: 'Vehículos', icon: '🚛' },
        { id: 'conductores', label: 'Conductores', icon: '👨‍✈️' },
        { id: 'bodega', label: 'Personal de bodega', icon: '🏭' },
    ];

    return (
        <div className="admin-container">

            <aside className="admin-sidebar">

                <div className="admin-logo">
                    <img src="/LOGO_ONUFAST.jpg" alt="ONUFAST" />
                    <span>ONUFAST Admin</span>
                </div>

                <nav className="admin-nav">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            className={`admin-nav-item ${
                                seccionActiva === item.id ? 'active' : ''
                            }`}
                            onClick={() => setSeccionActiva(item.id)}
                        >
                            <span className="admin-nav-icon">
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <button
                    className="admin-btn"
                    style={{ marginTop: 'auto' }}
                    onClick={() => {
                        localStorage.clear();
                        navigate('/');
                    }}
                >
                    ← Cerrar Sesión
                </button>

            </aside>

            <main className="admin-main">

                {seccionActiva === 'dashboard' && <AdminDashboard />}

                {seccionActiva === 'envios' && <AdminEnvios />}

                {seccionActiva === 'rutas' && <AdminRutas />}

                {seccionActiva === 'usuarios' && <AdminUsuarios />}

                {seccionActiva === 'vehiculos' && <AdminVehiculos />}

                {seccionActiva === 'conductores' && <AdminConductores />}

                {seccionActiva === 'bodega' && <AdminBodega />}

            </main>

        </div>
    );
}
