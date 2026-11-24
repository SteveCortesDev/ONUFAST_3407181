
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminDashboard from './AdminDashboard';
import AdminEnvios from './AdminEnvios';
import AdminUsuarios from './AdminUsuarios';
import AdminVehiculos from './AdminVehiculos';
import AdminConductores from './AdminConductores';
import AdminBodega from './AdminBodega';

import api from '@/shared/api';
import '@/styles/Admin.css';

export default function Admin() {
    const [seccionActiva, setSeccionActiva] = useState('dashboard');
    const [autorizado, setAutorizado] = useState(false);

    const navigate = useNavigate();

    // Verificar que el usuario tenga permisos de administrador
    useEffect(() => {
        const verificarAdmin = async () => {
            try {
                const response = await api.get('/usuarios/perfil');

                console.log(
                    'Validando acceso admin. Rol:',
                    response.data.id_rol
                );

                if (response.data.id_rol === 1) {
                    setAutorizado(true);
                } else {
                    navigate('/usuario');
                }

            } catch (error) {
                console.error('Error de autenticación:', error);
                navigate('/');
            }
        };

        verificarAdmin();
    }, [navigate]);

    // Mostrar pantalla de carga mientras se verifica el acceso
    if (!autorizado) {
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
                <h2>Cargando panel de administrador...</h2>
            </div>
        );
    }

    // Opciones del menú lateral
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'envios', label: 'Envíos', icon: '📦' },
        { id: 'usuarios', label: 'Usuarios', icon: '👥' },
        { id: 'vehiculos', label: 'Vehículos', icon: '🚛' },
        { id: 'conductores', label: 'Conductores', icon: '👨‍✈️' },
        { id: 'bodega', label: 'Personal de bodega', icon: '🏭' },
    ];

    return (
        <div className="admin-container">

            {/* MENÚ LATERAL */}
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

                {/* CERRAR SESIÓN */}
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

            {/* CONTENIDO PRINCIPAL */}
            <main className="admin-main">

                {seccionActiva === 'dashboard' && <AdminDashboard />}

                {seccionActiva === 'envios' && <AdminEnvios />}

                {seccionActiva === 'usuarios' && <AdminUsuarios />}

                {seccionActiva === 'vehiculos' && <AdminVehiculos />}

                {seccionActiva === 'conductores' && <AdminConductores />}

                {seccionActiva === 'bodega' && <AdminBodega />}

            </main>

        </div>
    );
}
