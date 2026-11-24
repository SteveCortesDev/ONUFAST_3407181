
import { useEffect, useState } from 'react';
import api from '@/shared/api';

export default function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [procesando, setProcesando] = useState(null);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            setCargando(true);
            const res = await api.get('/usuarios/');
            setUsuarios(res.data);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            setMensaje('Error al cargar usuarios ❌');
        } finally {
            setCargando(false);
        }
    };

    const mostrarMensaje = (texto) => {
        setMensaje(texto);
        setTimeout(() => setMensaje(''), 3000);
    };

    const cambiarRol = async (id_usuario, nuevo_rol_id) => {
        try {
            const idRol = parseInt(nuevo_rol_id, 10);

            await api.put(
                `/usuarios/${id_usuario}/rol`,
                null,
                {
                    params: {
                        id_rol: idRol
                    }
                }
            );

            mostrarMensaje('Rol actualizado correctamente ✅');
            await cargarUsuarios();
        } catch (error) {
            console.error('Error al cambiar rol:', error.response?.data || error);
            mostrarMensaje('Error al actualizar rol ❌');
        }
    };

    const cambiarEstado = async (usuario) => {
        const nuevoEstado = !usuario.activo;

        try {
            setProcesando(usuario.id_usuario);

            await api.put(
                `/usuarios/${usuario.id_usuario}/estado`,
                null,
                {
                    params: {
                        activo: nuevoEstado
                    }
                }
            );

            mostrarMensaje(
                nuevoEstado
                    ? 'Usuario activado correctamente ✅'
                    : 'Usuario desactivado correctamente ✅'
            );

            await cargarUsuarios();
        } catch (error) {
            console.error(
                'Error al cambiar estado:',
                error.response?.data || error
            );

            mostrarMensaje(
                error.response?.data?.detail || 'Error al cambiar estado ❌'
            );
        } finally {
            setProcesando(null);
        }
    };

    const usuariosFiltrados = usuarios.filter(u => {
        const nombre = (u.nombre || '').toLowerCase();
        const correo = (u.correo || '').toLowerCase();
        const documento = (u.num_documento || '').toLowerCase();
        const termino = busqueda.toLowerCase();

        return (
            nombre.includes(termino) ||
            correo.includes(termino) ||
            documento.includes(termino)
        );
    });

    if (cargando) return <h2>Cargando usuarios...</h2>;

    return (
        <div style={{ padding: '20px', color: 'white' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    gap: '10px'
                }}
            >
                <h2>Gestión de Usuarios</h2>

                {mensaje && (
                    <span
                        style={{
                            background: '#4ade80',
                            color: '#000',
                            padding: '8px 12px',
                            borderRadius: '5px'
                        }}
                    >
                        {mensaje}
                    </span>
                )}
            </div>

            <input
                type="text"
                placeholder="Buscar por nombre, correo o documento..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '20px',
                    borderRadius: '5px',
                    border: '1px solid #333',
                    background: '#222',
                    color: 'white'
                }}
            />

            <div style={{ overflowX: 'auto' }}>
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        textAlign: 'left',
                        minWidth: '850px'
                    }}
                >
                    <thead>
                        <tr style={{ borderBottom: '1px solid #444' }}>
                            <th style={{ padding: '10px' }}>ID</th>
                            <th style={{ padding: '10px' }}>Nombre</th>
                            <th style={{ padding: '10px' }}>Documento</th>
                            <th style={{ padding: '10px' }}>Correo</th>
                            <th style={{ padding: '10px' }}>Rol Actual</th>
                            <th style={{ padding: '10px' }}>Estado</th>
                            <th style={{ padding: '10px' }}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuariosFiltrados.map(user => {
                            const esAdmin = Number(user.id_rol) === 1;
                            const esActivo = user.activo === true;
                            const estaProcesando =
                                procesando === user.id_usuario;

                            return (
                                <tr
                                    key={user.id_usuario}
                                    style={{
                                        borderBottom: '1px solid #333',
                                        opacity: esActivo ? 1 : 0.65
                                    }}
                                >
                                    <td style={{ padding: '10px' }}>
                                        {user.id_usuario}
                                    </td>

                                    <td style={{ padding: '10px' }}>
                                        {user.nombre} {user.apellido}
                                    </td>

                                    <td style={{ padding: '10px' }}>
                                        {user.num_documento || 'No registrado'}
                                    </td>

                                    <td style={{ padding: '10px' }}>
                                        {user.correo}
                                    </td>

                                    <td style={{ padding: '10px' }}>
                                        <span
                                            style={{
                                                background: Number(user.id_rol) === 1
                                                    ? '#c9252c'
                                                    : Number(user.id_rol) === 3
                                                        ? '#3b82f6'
                                                        : Number(user.id_rol) === 5
                                                            ? '#eab308'
                                                            : '#666',
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                color: 'white'
                                            }}
                                        >
                                            {user.nombre_rol}
                                        </span>
                                    </td>

                                    <td style={{ padding: '10px' }}>
                                        <span
                                            style={{
                                                background: esActivo
                                                    ? '#166534'
                                                    : '#991b1b',
                                                color: 'white',
                                                padding: '5px 9px',
                                                borderRadius: '12px',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {esActivo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>

                                    <td style={{ padding: '10px' }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px'
                                            }}
                                        >
                                            <select
                                                value={user.id_rol ?? ''}
                                                onChange={(e) =>
                                                    cambiarRol(
                                                        user.id_usuario,
                                                        e.target.value
                                                    )
                                                }
                                                disabled={esAdmin || !esActivo}
                                                style={{
                                                    padding: '7px',
                                                    borderRadius: '5px',
                                                    background: esAdmin || !esActivo
                                                        ? '#444'
                                                        : '#222',
                                                    color: esAdmin || !esActivo
                                                        ? '#999'
                                                        : 'white',
                                                    border: '1px solid #555',
                                                    cursor: esAdmin || !esActivo
                                                        ? 'not-allowed'
                                                        : 'pointer'
                                                }}
                                            >
                                                <option value="" disabled>
                                                    Seleccionar rol
                                                </option>
                                                <option value="2">Cliente</option>
                                                <option value="3">Conductor</option>
                                                <option value="5">
                                                    Encargado de Bodega
                                                </option>
                                            </select>

                                            <button
                                                onClick={() => cambiarEstado(user)}
                                                disabled={esAdmin || estaProcesando}
                                                style={{
                                                    padding: '7px 10px',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    background: esActivo
                                                        ? '#dc2626'
                                                        : '#16a34a',
                                                    color: 'white',
                                                    cursor: esAdmin || estaProcesando
                                                        ? 'not-allowed'
                                                        : 'pointer',
                                                    opacity: esAdmin || estaProcesando
                                                        ? 0.5
                                                        : 1
                                                }}
                                            >
                                                {estaProcesando
                                                    ? 'Procesando...'
                                                    : esActivo
                                                        ? 'Desactivar'
                                                        : 'Activar'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {usuariosFiltrados.length === 0 && (
                            <tr>
                                <td
                                    colSpan="7"
                                    style={{
                                        padding: '20px',
                                        textAlign: 'center'
                                    }}
                                >
                                    No se encontraron usuarios.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
