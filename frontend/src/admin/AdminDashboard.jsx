import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();

    const stats = [
        { title: 'Envíos Totales', value: '1,247', icon: '📦', active: true },
        { title: 'Envíos Activos', value: '89', icon: '🚚', active: false },
        { title: 'Entregados Hoy', value: '156', icon: '✅', active: false },
        { title: 'Ingresos del Mes', value: '$12.5M', icon: '💰', active: false },
    ];

    const recentShipments = [
        { codigo: 'ONU-ORD-2026-001', cliente: 'Juan García', estado: 'Entregado', fecha: '2026-09-02' },
        { codigo: 'ONU-ORD-2026-002', cliente: 'María Rodríguez', estado: 'En camino', fecha: '2026-09-02' },
        { codigo: 'ONU-ORD-2026-003', cliente: 'Pedro Martínez', estado: 'Pendiente', fecha: '2026-09-01' },
        { codigo: 'ONU-ORD-2026-004', cliente: 'Ana López', estado: 'Entregado', fecha: '2026-09-01' },
        { codigo: 'ONU-ORD-2026-005', cliente: 'Carlos Torres', estado: 'Cancelado', fecha: '2026-08-31' },
    ];

    return (
        <div>
            {/* Header del admin */}
            <div className="admin-header">
                <h1>📊 Dashboard</h1>
                <button className="admin-btn" onClick={() => navigate('/')}>
                    Ver Sitio Principal
                </button>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="admin-stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className={`admin-stat-card ${stat.active ? 'active' : ''}`}>
                        <h3>{stat.icon} {stat.title}</h3>
                        <p>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Tabla de envíos recientes */}
            <div className="admin-section">
                <h2 className="admin-section-title">Últimos Envíos</h2>
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Cliente</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentShipments.map((shipment, index) => (
                                <tr key={index}>
                                    <td>{shipment.codigo}</td>
                                    <td>{shipment.cliente}</td>
                                    <td>
                                        <span className={`status-badge status-${shipment.estado.toLowerCase().replace(' ', '-')}`}>
                                            {shipment.estado}
                                        </span>
                                    </td>
                                    <td>{shipment.fecha}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}