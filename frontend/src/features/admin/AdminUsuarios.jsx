export default function AdminUsuarios() {
    const usuarios = [
        { id: 1, nombre: 'Juan García', tipo: 'Cliente', correo: 'juan@email.com', estado: 'Activo' },
        { id: 2, nombre: 'María Rodríguez', tipo: 'Cliente', correo: 'maria@email.com', estado: 'Activo' },
        { id: 3, nombre: 'Pedro Martínez', tipo: 'Conductor', correo: 'pedro@email.com', estado: 'Activo' },
        { id: 4, nombre: 'Ana López', tipo: 'Encargado Bodega', correo: 'ana@email.com', estado: 'Activo' },
        { id: 5, nombre: 'Carlos Torres', tipo: 'Cliente', correo: 'carlos@email.com', estado: 'Inactivo' },
    ];

    return (
        <div>
            <div className="admin-header">
                <h1>👥 Gestión de Usuarios</h1>
                <button className="admin-btn">+ Nuevo Usuario</button>
            </div>

            <div className="admin-section">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Tipo</th>
                                <th>Correo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.id}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div className="admin-avatar">
                                                {usuario.nombre.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            {usuario.nombre}
                                        </div>
                                    </td>
                                    <td>{usuario.tipo}</td>
                                    <td>{usuario.correo}</td>
                                    <td>
                                        <span className={`status-badge ${usuario.estado === 'Activo' ? 'status-entregado' : 'status-cancelado'}`}>
                                            {usuario.estado}
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