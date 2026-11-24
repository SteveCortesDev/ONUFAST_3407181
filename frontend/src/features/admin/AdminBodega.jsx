
import { useEffect, useMemo, useState } from 'react';
import api from '@/shared/api';

const estilos = {
    contenedor: {
        padding: '25px',
        color: '#f5f5f5',
        width: '100%',
        boxSizing: 'border-box'
    },
    encabezado: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '25px'
    },
    titulo: {
        margin: 0,
        fontSize: '26px'
    },
    descripcion: {
        color: '#a1a1aa',
        marginTop: '8px'
    },
    boton: {
        background: '#dc2626',
        color: 'white',
        border: 'none',
        padding: '11px 18px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    tarjetas: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '15px',
        marginBottom: '25px'
    },
    tarjeta: {
        background: '#1a1b22',
        border: '1px solid #30313a',
        borderRadius: '10px',
        padding: '20px'
    },
    numero: {
        fontSize: '28px',
        fontWeight: 'bold',
        margin: '8px 0'
    },
    busqueda: {
        width: '100%',
        maxWidth: '400px',
        padding: '12px',
        background: '#1a1b22',
        color: 'white',
        border: '1px solid #383943',
        borderRadius: '8px',
        outline: 'none',
        boxSizing: 'border-box'
    },
    tablaContenedor: {
        overflowX: 'auto',
        background: '#1a1b22',
        border: '1px solid #30313a',
        borderRadius: '10px',
        marginTop: '20px'
    },
    tabla: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '750px'
    },
    celda: {
        padding: '14px',
        textAlign: 'left',
        borderBottom: '1px solid #30313a',
        fontSize: '14px'
    }
};

export default function AdminBodega() {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [error, setError] = useState('');

    // Cargar encargados de bodega desde el backend
    const cargarEncargados = async () => {
        try {
            setCargando(true);
            setError('');

            const respuesta = await api.get('/usuarios/');

            // Comprobar la información recibida
            console.log('Respuesta completa:', respuesta.data);

            const listaUsuarios = Array.isArray(respuesta.data)
                ? respuesta.data
                : [];

            const encargados = listaUsuarios.filter(
                usuario => Number(usuario.id_rol) === 5
            );

            console.log('Encargados encontrados:', encargados);
            console.log('Cantidad de encargados:', encargados.length);

            setUsuarios(encargados);

        } catch (err) {
            console.error('Error al cargar encargados de bodega:', err);

            setError(
                err.response?.data?.detail ||
                'No fue posible cargar los encargados de bodega.'
            );

            setUsuarios([]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarEncargados();
    }, []);

    // Filtrar encargados por los datos ingresados
    const encargadosFiltrados = useMemo(() => {
        const termino = busqueda.toLowerCase().trim();

        if (!termino) return usuarios;

        return usuarios.filter(usuario => {
            const nombre = `${usuario.nombre || ''} ${usuario.apellido || ''}`;

            return (
                nombre.toLowerCase().includes(termino) ||
                String(usuario.id_usuario || '').includes(termino) ||
                String(usuario.num_documento || '').toLowerCase().includes(termino) ||
                (usuario.correo || '').toLowerCase().includes(termino) ||
                String(usuario.telefono || '').toLowerCase().includes(termino)
            );
        });
    }, [usuarios, busqueda]);

    // Calcular indicadores
    const totalEncargados = usuarios.length;

    const activos = usuarios.filter(
        usuario => usuario.activo === true || usuario.activo === 1
    ).length;

    const inactivos = totalEncargados - activos;

    return (
        <div style={estilos.contenedor}>

            {/* ENCABEZADO */}
            <div style={estilos.encabezado}>
                <div>
                    <h1 style={estilos.titulo}>
                        Personal de bodega
                    </h1>

                    <p style={estilos.descripcion}>
                        Supervisión de usuarios con el rol Encargado de Bodega.
                    </p>
                </div>

                <button
                    style={{
                        ...estilos.boton,
                        opacity: cargando ? 0.6 : 1
                    }}
                    onClick={cargarEncargados}
                    disabled={cargando}
                >
                    {cargando ? 'Actualizando...' : 'Actualizar información'}
                </button>
            </div>

            {/* INDICADORES */}
            <div style={estilos.tarjetas}>

                <div style={estilos.tarjeta}>
                    <span style={{ color: '#a1a1aa' }}>
                        Total de encargados
                    </span>

                    <p style={estilos.numero}>
                        {cargando ? '...' : totalEncargados}
                    </p>
                </div>

                <div style={estilos.tarjeta}>
                    <span style={{ color: '#a1a1aa' }}>
                        Personal activo
                    </span>

                    <p style={{ ...estilos.numero, color: '#22c55e' }}>
                        {cargando ? '...' : activos}
                    </p>
                </div>

                <div style={estilos.tarjeta}>
                    <span style={{ color: '#a1a1aa' }}>
                        Personal inactivo
                    </span>

                    <p style={{ ...estilos.numero, color: '#ef4444' }}>
                        {cargando ? '...' : inactivos}
                    </p>
                </div>

            </div>

            {/* BUSCADOR */}
            <input
                type="text"
                placeholder="Buscar por nombre, documento, correo o teléfono..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                style={estilos.busqueda}
            />

            {/* MENSAJE DE ERROR */}
            {error && (
                <p style={{ color: '#f87171', marginTop: '20px' }}>
                    {error}
                </p>
            )}

            {/* TABLA */}
            {cargando ? (
                <p style={{ color: '#a1a1aa', marginTop: '25px' }}>
                    Cargando personal de bodega...
                </p>
            ) : (
                <div style={estilos.tablaContenedor}>
                    <table style={estilos.tabla}>
                        <thead>
                            <tr style={{ background: '#252630' }}>
                                {[
                                    'ID',
                                    'Nombre',
                                    'Documento',
                                    'Correo',
                                    'Teléfono',
                                    'Jornada',
                                    'Estado'
                                ].map(titulo => (
                                    <th key={titulo} style={estilos.celda}>
                                        {titulo}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {encargadosFiltrados.map(usuario => {
                                const estaActivo =
                                    usuario.activo === true ||
                                    usuario.activo === 1;

                                return (
                                    <tr key={usuario.id_usuario}>
                                        <td style={estilos.celda}>
                                            {usuario.id_usuario}
                                        </td>

                                        <td style={estilos.celda}>
                                            {usuario.nombre} {usuario.apellido}
                                        </td>

                                        <td style={estilos.celda}>
                                            {usuario.num_documento || 'No registrado'}
                                        </td>

                                        <td style={estilos.celda}>
                                            {usuario.correo || 'No registrado'}
                                        </td>

                                        <td style={estilos.celda}>
                                            {usuario.telefono || 'No registrado'}
                                        </td>

                                        <td style={estilos.celda}>
                                            {usuario.jornada || 'Sin asignar'}
                                        </td>

                                        <td style={estilos.celda}>
                                            <span
                                                style={{
                                                    color: estaActivo
                                                        ? '#22c55e'
                                                        : '#ef4444',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {estaActivo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}

                            {encargadosFiltrados.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="7"
                                        style={{
                                            ...estilos.celda,
                                            textAlign: 'center',
                                            color: '#a1a1aa'
                                        }}
                                    >
                                        {usuarios.length === 0
                                            ? 'No hay encargados de bodega registrados.'
                                            : 'No se encontraron resultados.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}
