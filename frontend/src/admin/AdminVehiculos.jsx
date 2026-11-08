export default function AdminVehiculos() {
    const vehiculos = [
        { id: 1, placa: 'ABC-123', tipo: 'Camión', capacidad: '5 ton', estado: 'Disponible' },
        { id: 2, placa: 'DEF-456', tipo: 'Camioneta', capacidad: '2 ton', estado: 'En ruta' },
        { id: 3, placa: 'GHI-789', tipo: 'Moto', capacidad: '50 kg', estado: 'Disponible' },
        { id: 4, placa: 'JKL-012', tipo: 'Camión', capacidad: '8 ton', estado: 'Mantenimiento' },
    ];

    return (
        <div>
            <div className="admin-header">
                <h1>🚛 Gestión de Vehículos</h1>
                <button className="admin-btn">+ Agregar Vehículo</button>
            </div>

            <div className="admin-section">
                <div className="admin-grid">
                    {vehiculos.map((vehiculo) => (
                        <div key={vehiculo.id} className="admin-card">
                            <h4>🚛 {vehiculo.tipo}</h4>
                            <p><strong>Placa:</strong> {vehiculo.placa}</p>
                            <p><strong>Capacidad:</strong> {vehiculo.capacidad}</p>
                            <p>
                                <strong>Estado:</strong>{' '}
                                <span className={`status-badge ${
                                    vehiculo.estado === 'Disponible' ? 'status-entregado' :
                                    vehiculo.estado === 'En ruta' ? 'status-en-camino' : 'status-cancelado'
                                }`}>
                                    {vehiculo.estado}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}