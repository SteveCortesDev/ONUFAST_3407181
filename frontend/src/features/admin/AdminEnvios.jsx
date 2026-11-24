
import { useEffect, useMemo, useState } from 'react';
import api from '../../shared/api';

export default function AdminEnvios() {
    const [envios, setEnvios] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('Todos');
    const [envioSeleccionado, setEnvioSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const [nuevoEstado, setNuevoEstado] = useState('');
    const [guardandoEstado, setGuardandoEstado] = useState(false);
    const [eliminando, setEliminando] = useState(false);

    // =====================================================
    // CARGAR ENVÍOS DESDE EL BACKEND
    // =====================================================

    const cargarEnvios = async () => {
        try {
            setCargando(true);
            setError('');

            const respuesta = await api.get('/envios/admin/listado');

            const datos = Array.isArray(respuesta.data)
                ? respuesta.data
                : respuesta.data.envios || [];

            setEnvios(datos);
        } catch (err) {
            console.error('Error al cargar los envíos:', err);

            if (err.response?.status === 401) {
                setError('Tu sesión ha expirado. Inicia sesión nuevamente.');
            } else if (err.response?.status === 403) {
                setError('No tienes permisos de administrador.');
            } else {
                setError(
                    err.response?.data?.detail ||
                    'No fue posible cargar los envíos. Verifica que el servidor esté funcionando.'
                );
            }
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarEnvios();
    }, []);

    // =====================================================
    // FILTRAR Y BUSCAR ENVÍOS
    // =====================================================

    const enviosFiltrados = useMemo(() => {
        return envios.filter((envio) => {
            const texto = busqueda.toLowerCase().trim();

            const coincideBusqueda =
                String(envio.id_envio || '').includes(texto) ||
                (envio.codigo_rastreo || '').toLowerCase().includes(texto) ||
                (envio.cliente || '').toLowerCase().includes(texto) ||
                (envio.origen || '').toLowerCase().includes(texto) ||
                (envio.destino || '').toLowerCase().includes(texto);

            const estado = envio.estado || 'Sin estado';

            const coincideEstado =
                filtroEstado === 'Todos' || estado === filtroEstado;

            return coincideBusqueda && coincideEstado;
        });
    }, [envios, busqueda, filtroEstado]);

    const estadosDisponibles = [
        ...new Set(envios.map((envio) => envio.estado || 'Sin estado'))
    ];

    // =====================================================
    // CLASE CSS PARA LOS ESTADOS
    // =====================================================

    const obtenerClaseEstado = (estado) => {
        return (estado || 'sin-estado')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-');
    };

    // =====================================================
    // FORMATEAR FECHA
    // =====================================================

    const formatearFecha = (fecha) => {
        if (!fecha) return 'No disponible';

        const fechaValida = new Date(fecha);

        if (Number.isNaN(fechaValida.getTime())) {
            return 'No disponible';
        }

        return fechaValida.toLocaleString('es-CO');
    };

    // =====================================================
    // ABRIR DETALLES
    // =====================================================

    const abrirDetalles = (envio) => {
        setEnvioSeleccionado(envio);
        setNuevoEstado(envio.estado || '');
        setError('');
        setMensaje('');
    };

    // =====================================================
    // ACTUALIZAR ESTADO DEL ENVÍO
    // =====================================================

    const actualizarEstado = async () => {
        if (!envioSeleccionado || !nuevoEstado) {
            setError('Selecciona un estado válido.');
            return;
        }

        if (nuevoEstado === envioSeleccionado.estado) {
            setError('El envío ya tiene ese estado.');
            return;
        }

        try {
            setGuardandoEstado(true);
            setError('');
            setMensaje('');

            const respuesta = await api.put(
                `/envios/admin/${envioSeleccionado.id_envio}/estado`,
                {
                    estado: nuevoEstado
                }
            );

            const estadoActualizado =
                respuesta.data.estado || nuevoEstado;

            setEnvios((anteriores) =>
                anteriores.map((envio) =>
                    envio.id_envio === envioSeleccionado.id_envio
                        ? { ...envio, estado: estadoActualizado }
                        : envio
                )
            );

            setEnvioSeleccionado((anterior) => ({
                ...anterior,
                estado: estadoActualizado,
                id_estadoenvio:
                    respuesta.data.id_estadoenvio ??
                    anterior.id_estadoenvio
            }));

            setNuevoEstado(estadoActualizado);
            setMensaje('Estado del envío actualizado correctamente.');
        } catch (err) {
            console.error('Error al actualizar el estado:', err);

            if (err.response?.status === 401) {
                setError('Tu sesión ha expirado. Inicia sesión nuevamente.');
            } else if (err.response?.status === 403) {
                setError('No tienes permisos para actualizar este envío.');
            } else {
                setError(
                    err.response?.data?.detail ||
                    'No fue posible actualizar el estado del envío.'
                );
            }
        } finally {
            setGuardandoEstado(false);
        }
    };

    // =====================================================
    // ELIMINAR ENVÍO
    // =====================================================

    const eliminarEnvio = async () => {
        if (!envioSeleccionado) return;

        const confirmar = window.confirm(
            `¿Estás seguro de eliminar el envío #${envioSeleccionado.id_envio}?\n\n` +
            `Código: ${envioSeleccionado.codigo_rastreo}\n\n` +
            'Esta acción no se puede deshacer.'
        );

        if (!confirmar) return;

        try {
            setEliminando(true);
            setError('');
            setMensaje('');

            await api.delete(
                `/envios/${envioSeleccionado.id_envio}`
            );

            const idEliminado = envioSeleccionado.id_envio;

            setEnvios((anteriores) =>
                anteriores.filter(
                    (envio) => envio.id_envio !== idEliminado
                )
            );

            setEnvioSeleccionado(null);
            setNuevoEstado('');
            setMensaje(`El envío #${idEliminado} fue eliminado correctamente.`);
        } catch (err) {
            console.error('Error al eliminar el envío:', err);

            if (err.response?.status === 401) {
                setError('Tu sesión ha expirado. Inicia sesión nuevamente.');
            } else if (err.response?.status === 403) {
                setError('No tienes permisos para eliminar este envío.');
            } else {
                setError(
                    err.response?.data?.detail ||
                    'No fue posible eliminar el envío. Puede estar relacionado con otros registros.'
                );
            }
        } finally {
            setEliminando(false);
        }
    };

    // =====================================================
    // INTERFAZ
    // =====================================================

    return (
        <div>
            <div className="admin-header">
                <h1>📦 Gestión de Envíos</h1>

                <button
                    className="admin-btn"
                    onClick={cargarEnvios}
                    disabled={cargando}
                >
                    {cargando ? 'Cargando...' : '↻ Actualizar'}
                </button>
            </div>

            <div className="admin-section">

                {/* BUSCADOR Y FILTRO */}

                <div
                    style={{
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap',
                        marginBottom: '20px'
                    }}
                >
                    <input
                        type="text"
                        placeholder="Buscar por código, cliente, origen o destino..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        style={{
                            flex: '1',
                            minWidth: '220px',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc'
                        }}
                    />

                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc'
                        }}
                    >
                        <option value="Todos">Todos los estados</option>

                        {estadosDisponibles.map((estado) => (
                            <option key={estado} value={estado}>
                                {estado}
                            </option>
                        ))}
                    </select>
                </div>

                {/* CONTADOR */}

                <p style={{ marginBottom: '15px' }}>
                    Total de envíos: <strong>{envios.length}</strong>
                    {' | '}
                    Resultados: <strong>{enviosFiltrados.length}</strong>
                </p>

                {/* MENSAJES */}

                {error && (
                    <div
                        style={{
                            padding: '12px',
                            marginBottom: '15px',
                            background: '#ffe5e5',
                            color: '#a00000',
                            borderRadius: '6px'
                        }}
                    >
                        {error}
                    </div>
                )}

                {mensaje && (
                    <div
                        style={{
                            padding: '12px',
                            marginBottom: '15px',
                            background: '#e5ffe9',
                            color: '#176b2c',
                            borderRadius: '6px'
                        }}
                    >
                        {mensaje}
                    </div>
                )}

                {/* TABLA */}

                {cargando ? (
                    <p>Cargando envíos desde la base de datos...</p>
                ) : (
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
                                {enviosFiltrados.length > 0 ? (
                                    enviosFiltrados.map((envio) => (
                                        <tr key={envio.id_envio}>
                                            <td>{envio.id_envio}</td>

                                            <td>
                                                {envio.codigo_rastreo}
                                            </td>

                                            <td>
                                                {envio.cliente || 'No disponible'}
                                            </td>

                                            <td>
                                                {envio.origen || 'Por definir'}
                                            </td>

                                            <td>
                                                {envio.destino || 'Por definir'}
                                            </td>

                                            <td>
                                                <span
                                                    className={`status-badge status-${obtenerClaseEstado(envio.estado)}`}
                                                >
                                                    {envio.estado || 'Sin estado'}
                                                </span>
                                            </td>

                                            <td>
                                                <button
                                                    className="admin-btn-secondary"
                                                    style={{
                                                        padding: '5px 10px',
                                                        fontSize: '12px'
                                                    }}
                                                    onClick={() => abrirDetalles(envio)}
                                                >
                                                    Detalle
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            style={{
                                                textAlign: 'center',
                                                padding: '25px'
                                            }}
                                        >
                                            No se encontraron envíos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* =====================================================
                MODAL DE DETALLES
            ===================================================== */}

            {envioSeleccionado && (
                <div
                    onClick={() => {
                        if (!guardandoEstado && !eliminando) {
                            setEnvioSeleccionado(null);
                        }
                    }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.65)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                        padding: '20px'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: '#fff',
                            color: '#222',
                            padding: '25px',
                            borderRadius: '10px',
                            width: '100%',
                            maxWidth: '600px',
                            maxHeight: '85vh',
                            overflowY: 'auto'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '20px'
                            }}
                        >
                            <h2>Detalle del envío</h2>

                            <button
                                onClick={() => setEnvioSeleccionado(null)}
                                disabled={guardandoEstado || eliminando}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    fontSize: '24px',
                                    cursor: 'pointer'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <h3>Información general</h3>

                        <p>
                            <strong>ID:</strong> {envioSeleccionado.id_envio}
                        </p>

                        <p>
                            <strong>Código de rastreo:</strong>{' '}
                            {envioSeleccionado.codigo_rastreo}
                        </p>

                        <p>
                            <strong>Cliente:</strong>{' '}
                            {envioSeleccionado.cliente || 'No disponible'}
                        </p>

                        <p>
                            <strong>Destinatario:</strong>{' '}
                            {envioSeleccionado.nombre_destinatario || 'No disponible'}
                        </p>

                        <p>
                            <strong>Documento:</strong>{' '}
                            {envioSeleccionado.documento_destinatario || 'No disponible'}
                        </p>

                        <p>
                            <strong>Origen:</strong>{' '}
                            {envioSeleccionado.origen || 'Por definir'}
                        </p>

                        <p>
                            <strong>Destino:</strong>{' '}
                            {envioSeleccionado.destino || 'Por definir'}
                        </p>

                        <p>
                            <strong>Tipo de envío:</strong>{' '}
                            {envioSeleccionado.tipo_envio || 'No disponible'}
                        </p>

                        <p>
                            <strong>Estado actual:</strong>{' '}
                            {envioSeleccionado.estado || 'Sin estado'}
                        </p>

                        <p>
                            <strong>Fecha de creación:</strong>{' '}
                            {formatearFecha(envioSeleccionado.fecha_creacion)}
                        </p>

                        {/* CAMBIAR ESTADO */}

                        <hr style={{ margin: '20px 0' }} />

                        <h3>Actualizar estado del envío</h3>

                        <div
                            style={{
                                display: 'flex',
                                gap: '10px',
                                flexWrap: 'wrap',
                                marginTop: '12px'
                            }}
                        >
                            <select
                                value={nuevoEstado}
                                onChange={(e) => setNuevoEstado(e.target.value)}
                                disabled={guardandoEstado || eliminando}
                                style={{
                                    flex: '1',
                                    minWidth: '180px',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc'
                                }}
                            >
                                {estadosDisponibles.map((estado) => (
                                    <option key={estado} value={estado}>
                                        {estado}
                                    </option>
                                ))}
                            </select>

                            <button
                                className="admin-btn"
                                onClick={actualizarEstado}
                                disabled={
                                    guardandoEstado ||
                                    eliminando ||
                                    !nuevoEstado ||
                                    nuevoEstado === envioSeleccionado.estado
                                }
                            >
                                {guardandoEstado ? 'Guardando...' : 'Guardar estado'}
                            </button>
                        </div>

                        <hr style={{ margin: '20px 0' }} />

                        {/* INFORMACIÓN DEL PAQUETE */}

                        <h3>Información del paquete</h3>

                        {envioSeleccionado.paquete ? (
                            <>
                                <p>
                                    <strong>Descripción:</strong>{' '}
                                    {envioSeleccionado.paquete.descripcion || 'No disponible'}
                                </p>

                                <p>
                                    <strong>Peso:</strong>{' '}
                                    {envioSeleccionado.paquete.peso ?? 'No disponible'}
                                </p>

                                <p>
                                    <strong>Alto:</strong>{' '}
                                    {envioSeleccionado.paquete.alto ?? 'No disponible'}
                                </p>

                                <p>
                                    <strong>Largo:</strong>{' '}
                                    {envioSeleccionado.paquete.largo ?? 'No disponible'}
                                </p>

                                <p>
                                    <strong>Ancho:</strong>{' '}
                                    {envioSeleccionado.paquete.ancho ?? 'No disponible'}
                                </p>

                                <p>
                                    <strong>Dirección:</strong>{' '}
                                    {envioSeleccionado.paquete.direccion || 'No disponible'}
                                </p>

                                <p>
                                    <strong>Barrio:</strong>{' '}
                                    {envioSeleccionado.paquete.barrio || 'No disponible'}
                                </p>

                                <p>
                                    <strong>Teléfono:</strong>{' '}
                                    {envioSeleccionado.paquete.telefono_destinatario || 'No disponible'}
                                </p>

                                <p>
                                    <strong>Referencias:</strong>{' '}
                                    {envioSeleccionado.paquete.referencias || 'No disponible'}
                                </p>

                                <p>
                                    <strong>Precio:</strong>{' '}
                                    {envioSeleccionado.paquete.precio_envio != null
                                        ? `$${Number(envioSeleccionado.paquete.precio_envio).toLocaleString('es-CO')}`
                                        : 'No disponible'}
                                </p>

                                <p>
                                    <strong>Método de pago:</strong>{' '}
                                    {envioSeleccionado.paquete.metodo_pago || 'No disponible'}
                                </p>
                            </>
                        ) : (
                            <p>
                                Este envío no tiene información de paquete registrada.
                            </p>
                        )}

                        {/* BOTONES DE ACCIÓN */}

                        <hr style={{ margin: '20px 0' }} />

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '10px',
                                flexWrap: 'wrap'
                            }}
                        >
                            <button
                                onClick={eliminarEnvio}
                                disabled={guardandoEstado || eliminando}
                                style={{
                                    background: '#c62828',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '10px 15px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    opacity: eliminando ? 0.6 : 1
                                }}
                            >
                                {eliminando ? 'Eliminando...' : '🗑 Eliminar envío'}
                            </button>

                            <button
                                className="admin-btn"
                                onClick={() => setEnvioSeleccionado(null)}
                                disabled={guardandoEstado || eliminando}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
