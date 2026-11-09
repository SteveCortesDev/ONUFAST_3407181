import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminEnvios from './AdminEnvios';
import AdminUsuarios from './AdminUsuarios';
import AdminVehiculos from './AdminVehiculos';
import AdminConductores from './AdminConductores';
import api from '@/shared/api';
import '@/styles/Admin.css';

export default function Admin() {
    const [seccionActiva, setSeccionActiva] = useState('dashboard');
    const [autorizado, setAutorizado] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const verificarAdmin = async () => {
            try {
                const response = await api.get('/usuarios/perfil');
                console.log("Validando acceso admin. Rol:", response.data.id_rol);
                
                // Si el rol es 1 (Administrador), lo dejamos entrar
                if (response.data.id_rol === 1) {
                    setAutorizado(true);
                } else {
                    // Si no es 1, lo devolvemos silenciosamente al panel de usuario
                    navigate('/usuario');
                }
            } catch (error) {
                console.error("Error de autenticación:", error);
                navigate('/');
            }
        };

        verificarAdmin();
    }, [navigate]);

    // Si no está autorizado, no muestra nada (o puedes poner un spinner)
    if (!autorizado) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#111217', color: 'white' }}>
                <h2>Cargando panel de administrador...</h2>
            </div>
        );
    }

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'envios', label: 'Envíos', icon: '📦' },
        { id: 'usuarios', label: 'Usuarios', icon: '👥' },
        { id: 'vehiculos', label: 'Vehículos', icon: '🚛' },
        { id: 'conductores', label: 'Conductores', icon: '👨‍✈️' },
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
                            className={`admin-nav-item ${seccionActiva === item.id ? 'active' : ''}`}
                            onClick={() => setSeccionActiva(item.id)}
                        >
                            <span className="admin-nav-icon">{item.icon}</span>
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
                {seccionActiva === 'usuarios' && <AdminUsuarios />}
                {seccionActiva === 'vehiculos' && <AdminVehiculos />}
                {seccionActiva === 'conductores' && <AdminConductores />}
            </main>
        </div>
    );
}