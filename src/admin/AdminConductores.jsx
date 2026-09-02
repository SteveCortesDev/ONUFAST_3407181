export default function AdminConductores() {
    const conductores = [
        { id: 1, nombre: 'Pedro Martínez', telefono: '3001234567', vehiculo: 'ABC-123', estado: 'Disponible' },
        { id: 2, nombre: 'Luis Gómez', telefono: '3007654321', vehiculo: 'DEF-456', estado: 'En ruta' },
        { id: 3, nombre: 'José Ramírez', telefono: '3012345678', vehiculo: 'GHI-789', estado: 'Disponible' },
    ];

    return (
        <div>
            <div className="admin-header">
                <h1>👨‍✈️ Gestión de Conductores</h1>
                <button className="admin-btn">+ Agregar Conductor</button>
            </div>

            <div className="admin-section">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Conductor</th>
                                <th>Teléfono</th>
                                <th>Vehículo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {conductores.map((conductor) => (
                                <tr key={conductor.id}>
                                    <td>{conductor.id}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div className="admin-avatar">
                                                {conductor.nombre.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            {conductor.nombre}
                                        </div>
                                    </td>
                                    <td>{conductor.telefono}</td>
                                    <td>{conductor.vehiculo}</td>
                                    <td>
                                        <span className={`status-badge ${
                                            conductor.estado === 'Disponible' ? 'status-entregado' : 'status-en-camino'
                                        }`}>
                                            {conductor.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="admin-btn-secondary" style={{ padding: '5px 10px', fontSize: '12px' }}>Editar</button>
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