
import { useEffect, useState } from 'react';
import api from '../../shared/api';

export default function AdminConductores() {
    const [conductores, setConductores] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [rutas, setRutas] = useState([]);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const [rutaExpandida, setRutaExpandida] = useState(null);
    const [vehiculosSeleccionados, setVehiculosSeleccionados] = useState({});
    const [asignando, setAsignando] = useState(null);

    // ========================================================
    // CARGAR CONDUCTORES, VEHÍCULOS Y RUTAS
    // ========================================================

    const cargarConductores = async () => {
        try {
            setCargando(true);
            setError('');
            setMensaje('');

            const [respuestaConductores, respuestaVehiculos, respuestaRutas] =
                await Promise.all([
                    api.get('/usuarios/conductores'),
                    api.get('/vehiculos/'),
                    api.get('/rutas/')
                ]);

            setConductores(respuestaConductores.data);
            setVehiculos(respuestaVehiculos.data);
            setRutas(respuestaRutas.data);

        } catch (err) {
            console.error('Error al cargar información:', err);

            setError(
                err.response?.data?.detail ||
                'No fue posible cargar la información. Verifica tu conexión.'
            );

        } finally {
            setCargando(false);
        }
    };

    // ========================================================
    // CARGAR INFORMACIÓN AL ABRIR EL COMPONENTE
    // ========================================================

    useEffect(() => {
        cargarConductores();
    }, []);

    // ========================================================
    // OBTENER INICIALES DEL CONDUCTOR
    // ========================================================

    const obtenerIniciales = (nombre) => {
        if (!nombre) return 'C';

        return nombre
            .split(' ')
            .filter(Boolean)
            .map(palabra => palabra[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    // ========================================================
    // ESTADO DEL CONDUCTOR
    // ========================================================

    const obtenerEstadoConductor = (activo) => {
        return activo ? 'Activo' : 'Inactivo';
    };

    // ========================================================
    // MOSTRAR / OCULTAR RUTAS
    // ========================================================

    const alternarRutas = (idUsuario) => {
        setRutaExpandida(
            rutaExpandida === idUsuario ? null : idUsuario
        );
    };

    // ========================================================
    // VEHÍCULOS YA ASIGNADOS A OTRAS RUTAS
    // ========================================================

    const obtenerVehiculosDisponibles = (idRutaActual) => {
        const vehiculosAsignados = new Set(
            rutas
                .filter(ruta =>
                    ruta.id_vehiculo !== null &&
                    ruta.id_vehiculo !== undefined &&
                    ruta.id_rutas !== idRutaActual
                )
                .map(ruta => ruta.id_vehiculo)
        );

        return vehiculos.filter(vehiculo => {
            const disponible = vehiculo.estado === 'Disponible';
            const noAsignado = !vehiculosAsignados.has(
                vehiculo.id_vehiculo
            );

            return disponible && noAsignado;
        });
    };

    // ========================================================
    // SELECCIONAR VEHÍCULO PARA UNA RUTA
    // ========================================================

    const seleccionarVehiculo = (idRuta, idVehiculo) => {
        setVehiculosSeleccionados(anterior => ({
            ...anterior,
            [idRuta]: idVehiculo
        }));
    };

    // ========================================================
    // ASIGNAR VEHÍCULO A UNA RUTA
    // ========================================================

    const asignarVehiculo = async (ruta) => {
        const idVehiculo = vehiculosSeleccionados[ruta.id_rutas];

        if (!idVehiculo) {
            setError('Selecciona un vehículo antes de asignarlo.');
            return;
        }

        try {
            setAsignando(ruta.id_rutas);
            setError('');
            setMensaje('');

            const respuesta = await api.put(
                `/rutas/${ruta.id_rutas}/vehiculo`,
                {
                    id_vehiculo: Number(idVehiculo)
                }
            );

            setMensaje(
                respuesta.data.mensaje ||
                'Vehículo asignado correctamente.'
            );

            setVehiculosSeleccionados(anterior => ({
                ...anterior,
                [ruta.id_rutas]: ''
            }));

            await cargarConductores();

        } catch (err) {
            console.error('Error al asignar vehículo:', err);

            setError(
                err.response?.data?.detail ||
                'No fue posible asignar el vehículo.'
            );

        } finally {
            setAsignando(null);
        }
    };

    // ========================================================
    // ESTILOS
    // ========================================================

    const estiloBoton = {
        padding: '8px 12px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600'
    };

    const estiloSelect = {
        padding: '9px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        minWidth: '190px',
        maxWidth: '100%'
    };

    return (
        <div>

            {/* ENCABEZADO */}
            <div className="admin-header">
                <h1>👨‍✈️ Gestión de Conductores</h1>

                <button
                    className="admin-btn"
                    onClick={cargarConductores}
                    disabled={cargando}
                >
                    {cargando ? 'Cargando...' : '↻ Actualizar'}
                </button>
            </div>

            <div className="admin-section">

                {/* MENSAJE DE ERROR */}
                {error && (
                    <div
                        role="alert"
                        style={{
                            padding: '12px',
                            marginBottom: '15px',
                            borderRadius: '8px',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b'
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* MENSAJE DE ÉXITO */}
                {mensaje && (
                    <div
                        role="status"
                        style={{
                            padding: '12px',
                            marginBottom: '15px',
                            borderRadius: '8px',
                            backgroundColor: '#dcfce7',
                            color: '#166534'
                        }}
                    >
                        {mensaje}
                    </div>
                )}

                <div className="admin-table-container">

                    <table className="admin-table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Conductor</th>
                                <th>Teléfono</th>
                                <th>Vehículo principal</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>

                            {/* CARGANDO */}
                            {cargando && (
                                <tr>
                                    <td
                                        colSpan="7"
                                        style={{
                                            textAlign: 'center',
                                            padding: '25px'
                                        }}
                                    >
                                        Cargando conductores...
                                    </td>
                                </tr>
                            )}

                            {/* SIN CONDUCTORES */}
                            {!cargando && !error && conductores.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="7"
                                        style={{
                                            textAlign: 'center',
                                            padding: '25px'
                                        }}
                                    >
                                        No hay conductores registrados.
                                    </td>
                                </tr>
                            )}

                            {/* LISTADO DE CONDUCTORES */}
                            {!cargando && conductores.map(conductor => {

                                const tieneRutas =
                                    conductor.rutas &&
                                    conductor.rutas.length > 0;

                                return (
                                    <>
                                        <tr key={conductor.id_usuario}>

                                            <td>{conductor.id_usuario}</td>

                                            <td>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px'
                                                    }}
                                                >
                                                    <div className="admin-avatar">
                                                        {obtenerIniciales(conductor.nombre)}
                                                    </div>

                                                    {conductor.nombre}
                                                </div>
                                            </td>

                                            <td>
                                                {conductor.telefono || 'No registrado'}
                                            </td>

                                            <td>
                                                {conductor.placa || 'Sin vehículo asignado'}
                                            </td>

                                            <td>
                                                {conductor.nombre_rol}
                                            </td>

                                            <td>
                                                <span
                                                    className={`status-badge ${
                                                        conductor.activo
                                                            ? 'status-entregado'
                                                            : 'status-en-camino'
                                                    }`}
                                                >
                                                    {obtenerEstadoConductor(conductor.activo)}
                                                </span>
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => alternarRutas(conductor.id_usuario)}
                                                    style={{
                                                        ...estiloBoton,
                                                        backgroundColor: '#252525',
                                                        color: '#fff'
                                                    }}
                                                >
                                                    {rutaExpandida === conductor.id_usuario
                                                        ? 'Ocultar rutas'
                                                        : 'Ver rutas'}
                                                </button>
                                            </td>

                                        </tr>

                                        {/* DETALLE DE RUTAS */}
                                        {rutaExpandida === conductor.id_usuario && (
                                            <tr key={`rutas-${conductor.id_usuario}`}>
                                                <td colSpan="7">

                                                    <div style={{
                                                        padding: '15px',
                                                        backgroundColor: '#f8fafc',
                                                        borderRadius: '8px'
                                                    }}>

                                                        <h3 style={{
                                                            marginTop: '0',
                                                            marginBottom: '15px'
                                                        }}>
                                                            Rutas de {conductor.nombre}
                                                        </h3>

                                                        {!tieneRutas && (
                                                            <p>
                                                                Este conductor no tiene rutas asignadas.
                                                            </p>
                                                        )}

                                                        {tieneRutas && (
                                                            <div style={{
                                                                width: '100%',
                                                                overflowX: 'auto'
                                                            }}>

                                                                <table style={{
                                                                    width: '100%',
                                                                    borderCollapse: 'collapse',
                                                                    minWidth: '750px'
                                                                }}>

                                                                    <thead>
                                                                        <tr style={{
                                                                            backgroundColor: '#e2e8f0'
                                                                        }}>
                                                                            <th style={{ padding: '10px' }}>Ruta</th>
                                                                            <th style={{ padding: '10px' }}>Origen</th>
                                                                            <th style={{ padding: '10px' }}>Destino</th>
                                                                            <th style={{ padding: '10px' }}>Vehículo</th>
                                                                            <th style={{ padding: '10px' }}>Asignación</th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody>

                                                                        {conductor.rutas.map(ruta => {

                                                                            const disponibles =
                                                                                obtenerVehiculosDisponibles(ruta.id_rutas);

                                                                            const vehiculoActual = vehiculos.find(
                                                                                v => v.id_vehiculo === ruta.id_vehiculo
                                                                            );

                                                                            const opcionesVehiculo = [
                                                                                ...disponibles
                                                                            ];

                                                                            if (
                                                                                vehiculoActual &&
                                                                                !opcionesVehiculo.some(
                                                                                    v => v.id_vehiculo === vehiculoActual.id_vehiculo
                                                                                )
                                                                            ) {
                                                                                opcionesVehiculo.push(vehiculoActual);
                                                                            }

                                                                            return (
                                                                                <tr key={ruta.id_rutas} style={{
                                                                                    borderBottom: '1px solid #ddd'
                                                                                }}>

                                                                                    <td style={{ padding: '10px' }}>
                                                                                        <strong>
                                                                                            {ruta.codigo_ruta || `Ruta ${ruta.id_rutas}`}
                                                                                        </strong>
                                                                                    </td>

                                                                                    <td style={{ padding: '10px' }}>
                                                                                        {ruta.ciudad_origen}
                                                                                    </td>

                                                                                    <td style={{ padding: '10px' }}>
                                                                                        {ruta.ciudad_destino}
                                                                                    </td>

                                                                                    <td style={{ padding: '10px' }}>
                                                                                        <div>
                                                                                            <strong>
                                                                                                {ruta.placa}
                                                                                            </strong>

                                                                                            <div style={{
                                                                                                fontSize: '12px',
                                                                                                color: '#64748b',
                                                                                                marginTop: '4px'
                                                                                            }}>
                                                                                                {ruta.tipo_vehiculo}
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>

                                                                                    <td style={{
                                                                                        padding: '10px',
                                                                                        minWidth: '230px'
                                                                                    }}>

                                                                                        <div style={{
                                                                                            display: 'flex',
                                                                                            gap: '8px',
                                                                                            flexWrap: 'wrap'
                                                                                        }}>

                                                                                            <select
                                                                                                value={
                                                                                                    vehiculosSeleccionados[ruta.id_rutas] ?? ''
                                                                                                }
                                                                                                onChange={e =>
                                                                                                    seleccionarVehiculo(
                                                                                                        ruta.id_rutas,
                                                                                                        e.target.value
                                                                                                    )
                                                                                                }
                                                                                                style={estiloSelect}
                                                                                                disabled={
                                                                                                    asignando === ruta.id_rutas
                                                                                                }
                                                                                            >

                                                                                                <option value="">
                                                                                                    Seleccionar vehículo
                                                                                                </option>

                                                                                                {opcionesVehiculo.map(vehiculo => (
                                                                                                    <option
                                                                                                        key={vehiculo.id_vehiculo}
                                                                                                        value={vehiculo.id_vehiculo}
                                                                                                    >
                                                                                                        {vehiculo.placa} - {vehiculo.tipo_vehiculo}
                                                                                                    </option>
                                                                                                ))}

                                                                                            </select>

                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => asignarVehiculo(ruta)}
                                                                                                disabled={
                                                                                                    !vehiculosSeleccionados[ruta.id_rutas] ||
                                                                                                    asignando === ruta.id_rutas
                                                                                                }
                                                                                                style={{
                                                                                                    ...estiloBoton,
                                                                                                    backgroundColor:
                                                                                                        vehiculosSeleccionados[ruta.id_rutas]
                                                                                                            ? '#16a34a'
                                                                                                            : '#94a3b8',
                                                                                                    color: '#fff',
                                                                                                    cursor:
                                                                                                        vehiculosSeleccionados[ruta.id_rutas]
                                                                                                            ? 'pointer'
                                                                                                            : 'not-allowed'
                                                                                                }}
                                                                                            >
                                                                                                {asignando === ruta.id_rutas
                                                                                                    ? 'Asignando...'
                                                                                                    : 'Asignar'}
                                                                                            </button>

                                                                                        </div>

                                                                                        {opcionesVehiculo.length === 0 && (
                                                                                            <small style={{
                                                                                                display: 'block',
                                                                                                marginTop: '6px',
                                                                                                color: '#b45309'
                                                                                            }}>
                                                                                                No hay vehículos disponibles.
                                                                                            </small>
                                                                                        )}

                                                                                    </td>

                                                                                </tr>
                                                                            );
                                                                        })}

                                                                    </tbody>
                                                                </table>

                                                            </div>
                                                        )}

                                                    </div>

                                                </td>
                                            </tr>
                                        )}

                                    </>
                                );
                            })}

                        </tbody>
                    </table>

                </div>

                {/* TOTAL DE CONDUCTORES */}
                {!cargando && !error && (
                    <p style={{ marginTop: '15px' }}>
                        Total de conductores:{' '}
                        <strong>{conductores.length}</strong>
                    </p>
                )}

                {/* TOTAL DE VEHÍCULOS */}
                {!cargando && !error && (
                    <p>
                        Total de vehículos registrados:{' '}
                        <strong>{vehiculos.length}</strong>
                    </p>
                )}

            </div>
        </div>
    );
}
