import { useEffect, useState } from 'react';
import api from '@/shared/api';

export default function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            setCargando(true);
            const res = await api.get('/usuarios/');
            setUsuarios(res.data);
        } catch (error) {
            console.error("Error al cargar usuarios", error);
        } finally {
            setCargando(false);
        }
    };

    const cambiarRol = async (id_usuario, nuevo_rol_id) => {
        try {
            await api.put(`/usuarios/${id_usuario}/rol`, { id_rol: parseInt(nuevo_rol_id) });
            setMensaje('Rol actualizado correctamente ✅');
            cargarUsuarios(); 
            setTimeout(() => setMensaje(''), 3000);
        } catch (error) {
            console.error("Error al cambiar rol", error);
            setMensaje('Error al actualizar rol ❌');
            setTimeout(() => setMensaje(''), 3000);
        }
    };

    // Filtramos por nombre, correo o documento
    const usuariosFiltrados = usuarios.filter(u => 
        u.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        u.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.num_documento.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (cargando) return <h2>Cargando usuarios...</h2>;

    return (
        <div style={{ padding: '20px', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Gestión de Usuarios</h2>
                {mensaje && <span style={{ background: '#4ade80', color: '#000', padding: '5px 10px', borderRadius: '5px' }}>{mensaje}</span>}
            </div>

            <input 
                type="text" 
                placeholder="Buscar por nombre, correo o documento..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: 'white' }}
            />

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #444' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Nombre</th>
                        <th style={{ padding: '10px' }}>Documento</th> {/* Nueva Columna */}
                        <th style={{ padding: '10px' }}>Correo</th>
                        <th style={{ padding: '10px' }}>Rol Actual</th>
                        <th style={{ padding: '10px' }}>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {usuariosFiltrados.map(user => {
                        const esAdmin = user.id_rol === 1; // Validamos si es admin
                        
                        return (
                            <tr key={user.id_usuario} style={{ borderBottom: '1px solid #333' }}>
                                <td style={{ padding: '10px' }}>{user.id_usuario}</td>
                                <td style={{ padding: '10px' }}>{user.nombre}</td>
                                <td style={{ padding: '10px' }}>{user.num_documento}</td> {/* Mostramos el documento */}
                                <td style={{ padding: '10px' }}>{user.correo}</td>
                                <td style={{ padding: '10px' }}>
                                    <span style={{ 
                                        background: user.id_rol === 1 ? '#c9252c' : user.id_rol === 3 ? '#3b82f6' : user.id_rol === 5 ? '#eab308' : '#666',
                                        padding: '4px 8px', borderRadius: '12px', fontSize: '12px'
                                    }}>
                                        {user.nombre_rol}
                                    </span>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <select 
                                        value={user.id_rol} 
                                        onChange={(e) => cambiarRol(user.id_usuario, e.target.value)}
                                        disabled={esAdmin} // Bloquea el selector si es admin
                                        style={{ padding: '5px', borderRadius: '5px', background: esAdmin ? '#444' : '#222', color: esAdmin ? '#999' : 'white', border: '1px solid #555', cursor: esAdmin ? 'not-allowed' : 'pointer' }}
                                    >
                                        <option value="2">Cliente</option>
                                        <option value="3">Conductor</option>
                                        <option value="5">Encargado de Bodega</option>
                                    </select>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}