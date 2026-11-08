export default function AdminEnvios() {
    const envíos = [
        { id: 1, codigo: 'ONU-ORD-2026-001', cliente: 'Juan García', origen: 'Bogotá', destino: 'Medellín', estado: 'Entregado' },
        { id: 2, codigo: 'ONU-ORD-2026-002', cliente: 'María Rodríguez', origen: 'Bogotá', destino: 'Cali', estado: 'En camino' },
        { id: 3, codigo: 'ONU-ORD-2026-003', cliente: 'Pedro Martínez', origen: 'Medellín', destino: 'Barranquilla', estado: 'Pendiente' },
        { id: 4, codigo: 'ONU-ORD-2026-004', cliente: 'Ana López', origen: 'Cali', destino: 'Bogotá', estado: 'Entregado' },
        { id: 5, codigo: 'ONU-ORD-2026-005', cliente: 'Carlos Torres', origen: 'Barranquilla', destino: 'Cartagena', estado: 'Cancelado' },
    ];

    return (
        <div>
            <div className="admin-header">
                <h1>📦 Gestión de Envíos</h1>
                <button className="admin-btn">+ Nuevo Envío</button>
            </div>

            <div className="admin-section">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Código</th>
                                <th>Cliente</th>
                                <th>Origen</th>
                                <th>Destino</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {envíos.map((envío) => (
                                <tr key={envío.id}>
                                    <td>{envío.id}</td>
                                    <td>{envío.codigo}</td>
                                    <td>{envío.cliente}</td>
                                    <td>{envío.origen}</td>
                                    <td>{envío.destino}</td>
                                    <td>
                                        <span className={`status-badge status-${envío.estado.toLowerCase().replace(' ', '-')}`}>
                                            {envío.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="admin-btn-secondary" style={{ padding: '5px 10px', fontSize: '12px' }}>Detalle</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}