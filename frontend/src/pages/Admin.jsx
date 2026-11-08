import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../admin/AdminDashboard';
import AdminEnvios from '../admin/AdminEnvios';
import AdminUsuarios from '../admin/AdminUsuarios';
import AdminVehiculos from '../admin/AdminVehiculos';
import AdminConductores from '../admin/AdminConductores';
import '../Admin.css';

export default function Admin() {
    const [seccionActiva, setSeccionActiva] = useState('dashboard');
    const navigate = useNavigate();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'envios', label: 'Envíos', icon: '📦' },
        { id: 'usuarios', label: 'Usuarios', icon: '👥' },
        { id: 'vehiculos', label: 'Vehículos', icon: '🚛' },
        { id: 'conductores', label: 'Conductores', icon: '👨‍✈️' },
    ];

    return (
        <div className="admin-container">
            {/* SIDEBAR */}
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
                    onClick={() => navigate('/')}
                >
                    ← Salir del Admin
                </button>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
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