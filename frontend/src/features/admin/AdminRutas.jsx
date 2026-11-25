import { useEffect, useMemo, useState } from 'react';
import api from '../../shared/api';

const FORMULARIO_INICIAL = {
    codigo_ruta: '',
    ciudad_origen: '',
    ciudad_destino: '',
    tiempo_estimado: '',
    distancia_ruta: '',
    cantidad_paquetes: 0,
    tipo_vehiculo: '',
    nombre_conductor: '',
    id_conductor: '',
    id_vehiculo: ''
};

export default function AdminRutas() {
    const [rutas, setRutas] = useState([]);
    const [conductores, setConductores] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [procesandoId, setProcesandoId] = useState(null);

    const [busqueda, setBusqueda] = useState('');
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editando, setEditando] = useState(false);
    const [idRutaEditar, setIdRutaEditar] = useState(null);
    const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);

    const [seleccionConductor, setSeleccionConductor] = useState({});
    const [seleccionVehiculo, setSeleccionVehiculo] = useState({});

    const cargarDatos = async (limpiarMensajes = true) => {
        try {
            setCargando(true);
            setError('');
            if (limpiarMensajes) {
                setMensaje('');
            }

            const [resRutas, resConductores, resVehiculos] = await Promise.all([
                api.get('/rutas/'),
                api.get('/usuarios/conductores'),
                api.get('/vehiculos/')
            ]);

            setRutas(Array.isArray(resRutas.data) ? resRutas.data : []);
            setConductores(Array.isArray(resConductores.data) ? resConductores.data : []);
            setVehiculos(Array.isArray(resVehiculos.data) ? resVehiculos.data : []);
        } catch (err) {
            console.error('Error al cargar rutas:', err);
            setError(
                err.response?.data?.detail ||
                'No fue posible cargar las rutas y recursos asociados.'
            );
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormulario((prev) => {
            const actualizado = { ...prev, [name]: value };

            if (name === 'id_conductor') {
                const cond = conductores.find(
                    (c) => String(c.id_usuario) === String(value)
                );
                if (cond) {
                    actualizado.nombre_conductor = cond.nombre || '';
                }
            }

            if (name === 'id_vehiculo') {
                const veh = vehiculos.find(
                    (v) => String(v.id_vehiculo) === String(value)
                );
                if (veh && !actualizado.tipo_vehiculo) {
                    actualizado.tipo_vehiculo = veh.tipo_vehiculo || '';
                }
            }

            return actualizado;
        });
    };

    const abrirNuevaRuta = () => {
        setFormulario(FORMULARIO_INICIAL);
        setEditando(false);
        setIdRutaEditar(null);
        setMostrarFormulario(true);
        setError('');
        setMensaje('');
    };

    const abrirEditarRuta = (ruta) => {
        setFormulario({
            codigo_ruta: ruta.codigo_ruta || '',
            ciudad_origen: ruta.ciudad_origen || '',
            ciudad_destino: ruta.ciudad_destino || '',
            tiempo_estimado: ruta.tiempo_estimado || '',
            distancia_ruta: ruta.distancia_ruta ?? '',
            cantidad_paquetes: ruta.cantidad_paquetes ?? 0,
            tipo_vehiculo: ruta.tipo_vehiculo || '',
            nombre_conductor: ruta.nombre_conductor || '',
            id_conductor: ruta.id_conductor ?? '',
            id_vehiculo: ruta.id_vehiculo ?? ''
        });
        setEditando(true);
        setIdRutaEditar(ruta.id_rutas);
        setMostrarFormulario(true);
        setError('');
        setMensaje('');
    };

    const guardarRuta = async (e) => {
        e.preventDefault();

        const codigoLimpio = formulario.codigo_ruta.trim().toUpperCase();
        if (!codigoLimpio || codigoLimpio === 'SIN-ASIGNAR') {
            setError('Ingresa un código de ruta válido y distinto de SIN-ASIGNAR.');
            return;
        }

        const distanciaNum = Number(formulario.distancia_ruta);
        const cantidadNum = Number(formulario.cantidad_paquetes);

        if (
            !formulario.ciudad_origen.trim() ||
            !formulario.ciudad_destino.trim() ||
            !formulario.tiempo_estimado.trim() ||
            Number.isNaN(distanciaNum) ||
            distanciaNum <= 0 ||
            Number.isNaN(cantidadNum) ||
            cantidadNum < 0
        ) {
            setError('Completa origen, destino, tiempo estimado, distancia válida y cantidad de paquetes.');
            return;
        }

        const idConductorNum = formulario.id_conductor ? Number(formulario.id_conductor) : null;
        const idVehiculoNum = formulario.id_vehiculo ? Number(formulario.id_vehiculo) : null;

        const conductorObj = conductores.find(
            (c) => Number(c.id_usuario) === Number(idConductorNum)
        );
        const vehiculoObj = vehiculos.find(
            (v) => Number(v.id_vehiculo) === Number(idVehiculoNum)
        );

        const payload = {
            codigo_ruta: codigoLimpio,
            ciudad_origen: formulario.ciudad_origen.trim(),
            ciudad_destino: formulario.ciudad_destino.trim(),
            tiempo_estimado: formulario.tiempo_estimado.trim(),
            distancia_ruta: distanciaNum,
            cantidad_paquetes: Math.trunc(cantidadNum),
            tipo_vehiculo:
                formulario.tipo_vehiculo.trim() ||
                vehiculoObj?.tipo_vehiculo ||
                'Por definir',
            nombre_conductor:
                formulario.nombre_conductor.trim() ||
                conductorObj?.nombre ||
                'Sin asignar',
            id_conductor: idConductorNum,
            id_vehiculo: idVehiculoNum
        };

        try {
            setGuardando(true);
            setError('');
            setMensaje('');

            if (editando && idRutaEditar) {
                await api.put(`/rutas/${idRutaEditar}`, payload);
                setMensaje('Ruta actualizada correctamente.');
            } else {
                await api.post('/rutas/', payload);
                setMensaje('Ruta creada correctamente.');
            }

            setMostrarFormulario(false);
            setEditando(false);
            setIdRutaEditar(null);
            setFormulario(FORMULARIO_INICIAL);

            await cargarDatos(false);
        } catch (err) {
            console.error('Error al guardar ruta:', err);
            setError(
                err.response?.data?.detail ||
                'No fue posible guardar la ruta.'
            );
        } finally {
            setGuardando(false);
        }
    };

    const asignarConductorARuta = async (idRuta) => {
        const idConductorElegido = seleccionConductor[idRuta];
        if (!idConductorElegido) {
            setError('Selecciona un conductor antes de asignar.');
            return;
        }

        try {
            setProcesandoId(`cond-${idRuta}`);
            setError('');
            setMensaje('');

            const resp = await api.put(`/rutas/${idRuta}/conductor`, {
                id_conductor: Number(idConductorElegido)
            });

            setSeleccionConductor((prev) => ({ ...prev, [idRuta]: '' }));
            await cargarDatos(false);
            setMensaje(resp.data?.mensaje || 'Conductor asignado a la ruta.');
        } catch (err) {
            console.error('Error al asignar conductor:', err);
            setError(
                err.response?.data?.detail ||
                'No fue posible asignar el conductor a la ruta.'
            );
        } finally {
            setProcesandoId(null);
        }
    };

    const asignarVehiculoARuta = async (idRuta) => {
        const valorElegido = seleccionVehiculo[idRuta];
        if (valorElegido === undefined || valorElegido === '') {
            setError('Selecciona un vehículo o elige retirar vehículo.');
            return;
        }

        const idVehiculoPayload = valorElegido === 'NONE' ? null : Number(valorElegido);

        try {
            setProcesandoId(`veh-${idRuta}`);
            setError('');
            setMensaje('');

            const resp = await api.put(`/rutas/${idRuta}/vehiculo`, {
                id_vehiculo: idVehiculoPayload
            });

            setSeleccionVehiculo((prev) => ({ ...prev, [idRuta]: '' }));
            await cargarDatos(false);
            setMensaje(resp.data?.mensaje || 'Vehículo actualizado en la ruta.');
        } catch (err) {
            console.error('Error al asignar vehículo:', err);
            setError(
                err.response?.data?.detail ||
                'No fue posible actualizar el vehículo de la ruta.'
            );
        } finally {
            setProcesandoId(null);
        }
    };

    const eliminarRuta = async (ruta) => {
        const confirmar = window.confirm(
            `¿Deseas eliminar la ruta ${ruta.codigo_ruta} (#${ruta.id_rutas})?`
        );
        if (!confirmar) return;

        try {
            setProcesandoId(`del-${ruta.id_rutas}`);
            setError('');
            setMensaje('');

            await api.delete(`/rutas/${ruta.id_rutas}`);
            await cargarDatos(false);
            setMensaje(`Ruta ${ruta.codigo_ruta} eliminada correctamente.`);
        } catch (err) {
            console.error('Error al eliminar ruta:', err);
            setError(
                err.response?.data?.detail ||
                'No fue posible eliminar la ruta.'
            );
        } finally {
            setProcesandoId(null);
        }
    };

    const rutasFiltradas = useMemo(() => {
        const q = busqueda.toLowerCase().trim();
        if (!q) return rutas;

        return rutas.filter((r) =>
            String(r.id_rutas || '').includes(q) ||
            (r.codigo_ruta || '').toLowerCase().includes(q) ||
            (r.ciudad_origen || '').toLowerCase().includes(q) ||
            (r.ciudad_destino || '').toLowerCase().includes(q) ||
            (r.nombre_conductor || '').toLowerCase().includes(q) ||
            (r.estado || '').toLowerCase().includes(q)
        );
    }, [rutas, busqueda]);

    const vehiculosDisponiblesParaRuta = (idRutaActual) => {
        const ocupados = new Set(
            rutas
                .filter(
                    (r) =>
                        r.id_vehiculo !== null &&
                        r.id_vehiculo !== undefined &&
                        r.id_rutas !== idRutaActual
                )
                .map((r) => r.id_vehiculo)
        );

        return vehiculos.filter(
            (v) => v.estado === 'Disponible' && !ocupados.has(v.id_vehiculo)
        );
    };

    return (
        <div>
            <div className="admin-header">
                <h1>🗺️ Gestión de Rutas</h1>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                        className="admin-btn-secondary"
                        onClick={() => cargarDatos()}
                        disabled={cargando || guardando}
                    >
                        {cargando ? 'Cargando...' : '↻ Actualizar'}
                    </button>

                    <button
                        className="admin-btn"
                        onClick={abrirNuevaRuta}
                        disabled={guardando}
                    >
                        + Crear Ruta
                    </button>
                </div>
            </div>

            <div className="admin-section">
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

                {mostrarFormulario && (
                    <div className="admin-card" style={{ marginBottom: '20px' }}>
                        <h3>{editando ? `Editar ruta #${idRutaEditar}` : 'Crear nueva ruta'}</h3>

                        <form onSubmit={guardarRuta}>
                            <div className="admin-grid">
                                <div>
                                    <label>Código de ruta</label>
                                    <input
                                        type="text"
                                        name="codigo_ruta"
                                        value={formulario.codigo_ruta}
                                        onChange={manejarCambio}
                                        placeholder="Ej: RUTA-BOG-01"
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Ciudad origen</label>
                                    <input
                                        type="text"
                                        name="ciudad_origen"
                                        value={formulario.ciudad_origen}
                                        onChange={manejarCambio}
                                        placeholder="Ej: Bogotá"
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Ciudad destino</label>
                                    <input
                                        type="text"
                                        name="ciudad_destino"
                                        value={formulario.ciudad_destino}
                                        onChange={manejarCambio}
                                        placeholder="Ej: Medellín"
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Tiempo estimado</label>
                                    <input
                                        type="text"
                                        name="tiempo_estimado"
                                        value={formulario.tiempo_estimado}
                                        onChange={manejarCambio}
                                        placeholder="Ej: 2 horas"
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Distancia (km)</label>
                                    <input
                                        type="number"
                                        name="distancia_ruta"
                                        value={formulario.distancia_ruta}
                                        onChange={manejarCambio}
                                        placeholder="Ej: 25.5"
                                        min="0.1"
                                        step="0.1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Cantidad de paquetes</label>
                                    <input
                                        type="number"
                                        name="cantidad_paquetes"
                                        value={formulario.cantidad_paquetes}
                                        onChange={manejarCambio}
                                        min="0"
                                        step="1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Conductor asignado</label>
                                    <select
                                        name="id_conductor"
                                        value={formulario.id_conductor}
                                        onChange={manejarCambio}
                                    >
                                        <option value="">Sin conductor por ahora</option>
                                        {conductores.map((c) => (
                                            <option key={c.id_usuario} value={c.id_usuario}>
                                                #{c.id_usuario} - {c.nombre} ({c.activo ? 'Activo' : 'Inactivo'})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label>Vehículo asignado</label>
                                    <select
                                        name="id_vehiculo"
                                        value={formulario.id_vehiculo}
                                        onChange={manejarCambio}
                                    >
                                        <option value="">Sin vehículo por ahora</option>
                                        {vehiculos.map((v) => (
                                            <option key={v.id_vehiculo} value={v.id_vehiculo}>
                                                {v.placa} - {v.tipo_vehiculo} ({v.estado})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label>Tipo de vehículo (texto)</label>
                                    <input
                                        type="text"
                                        name="tipo_vehiculo"
                                        value={formulario.tipo_vehiculo}
                                        onChange={manejarCambio}
                                        placeholder="Ej: Camioneta o Moto"
                                    />
                                </div>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    gap: '10px',
                                    marginTop: '18px',
                                    flexWrap: 'wrap'
                                }}
                            >
                                <button
                                    type="submit"
                                    className="admin-btn"
                                    disabled={guardando}
                                >
                                    {guardando
                                        ? 'Guardando...'
                                        : editando
                                            ? 'Guardar cambios'
                                            : 'Registrar ruta'}
                                </button>

                                <button
                                    type="button"
                                    className="admin-btn-secondary"
                                    onClick={() => {
                                        setMostrarFormulario(false);
                                        setEditando(false);
                                        setIdRutaEditar(null);
                                    }}
                                    disabled={guardando}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Buscar por código, origen, destino, conductor o estado..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '15px',
                        borderRadius: '6px',
                        border: '1px solid #333',
                        background: '#222',
                        color: 'white'
                    }}
                />

                {cargando ? (
                    <p>Cargando rutas...</p>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Código</th>
                                    <th>Origen → Destino</th>
                                    <th>Estado</th>
                                    <th>Conductor</th>
                                    <th>Vehículo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rutasFiltradas.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>
                                            No hay rutas registradas. Usa el botón &ldquo;+ Crear Ruta&rdquo;.
                                        </td>
                                    </tr>
                                ) : (
                                    rutasFiltradas.map((ruta) => {
                                        const vehDisponibles = vehiculosDisponiblesParaRuta(ruta.id_rutas);
                                        const vehActual = vehiculos.find(
                                            (v) => v.id_vehiculo === ruta.id_vehiculo
                                        );
                                        const opcionesVeh = [...vehDisponibles];
                                        if (
                                            vehActual &&
                                            !opcionesVeh.some((v) => v.id_vehiculo === vehActual.id_vehiculo)
                                        ) {
                                            opcionesVeh.push(vehActual);
                                        }

                                        return (
                                            <tr key={ruta.id_rutas}>
                                                <td>{ruta.id_rutas}</td>
                                                <td>
                                                    <strong>{ruta.codigo_ruta}</strong>
                                                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                                        {ruta.distancia_ruta ?? '—'} km · {ruta.tiempo_estimado || '—'}
                                                    </div>
                                                </td>
                                                <td>
                                                    {ruta.ciudad_origen} → {ruta.ciudad_destino}
                                                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                                        Paquetes: {ruta.cantidad_paquetes ?? 0}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="status-badge status-en-camino">
                                                        {ruta.estado || 'Pendiente'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ marginBottom: '6px' }}>
                                                        {ruta.nombre_conductor || 'Sin asignar'}
                                                        {ruta.id_conductor ? ` (ID ${ruta.id_conductor})` : ''}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                        <select
                                                            value={seleccionConductor[ruta.id_rutas] ?? ''}
                                                            onChange={(e) =>
                                                                setSeleccionConductor((prev) => ({
                                                                    ...prev,
                                                                    [ruta.id_rutas]: e.target.value
                                                                }))
                                                            }
                                                            style={{ padding: '6px', borderRadius: '5px' }}
                                                        >
                                                            <option value="">Elegir conductor</option>
                                                            {conductores.map((c) => (
                                                                <option
                                                                    key={c.id_usuario}
                                                                    value={c.id_usuario}
                                                                    disabled={!c.activo}
                                                                >
                                                                    #{c.id_usuario} - {c.nombre}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            type="button"
                                                            className="admin-btn-secondary"
                                                            style={{ padding: '6px 10px', fontSize: '12px' }}
                                                            disabled={procesandoId === `cond-${ruta.id_rutas}`}
                                                            onClick={() => asignarConductorARuta(ruta.id_rutas)}
                                                        >
                                                            {procesandoId === `cond-${ruta.id_rutas}`
                                                                ? '...'
                                                                : 'Asignar'}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ marginBottom: '6px' }}>
                                                        {ruta.placa || ruta.tipo_vehiculo || 'Sin vehículo'}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                        <select
                                                            value={seleccionVehiculo[ruta.id_rutas] ?? ''}
                                                            onChange={(e) =>
                                                                setSeleccionVehiculo((prev) => ({
                                                                    ...prev,
                                                                    [ruta.id_rutas]: e.target.value
                                                                }))
                                                            }
                                                            style={{ padding: '6px', borderRadius: '5px' }}
                                                        >
                                                            <option value="">Elegir vehículo</option>
                                                            {opcionesVeh.map((v) => (
                                                                <option key={v.id_vehiculo} value={v.id_vehiculo}>
                                                                    {v.placa} - {v.tipo_vehiculo}
                                                                </option>
                                                            ))}
                                                            {ruta.id_vehiculo && (
                                                                <option value="NONE">Retirar vehículo</option>
                                                            )}
                                                        </select>
                                                        <button
                                                            type="button"
                                                            className="admin-btn-secondary"
                                                            style={{ padding: '6px 10px', fontSize: '12px' }}
                                                            disabled={procesandoId === `veh-${ruta.id_rutas}`}
                                                            onClick={() => asignarVehiculoARuta(ruta.id_rutas)}
                                                        >
                                                            {procesandoId === `veh-${ruta.id_rutas}`
                                                                ? '...'
                                                                : 'Aplicar'}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                        <button
                                                            type="button"
                                                            className="admin-btn-secondary"
                                                            style={{ padding: '6px 10px', fontSize: '12px' }}
                                                            onClick={() => abrirEditarRuta(ruta)}
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                ruta.codigo_ruta === 'SIN-ASIGNAR' ||
                                                                procesandoId === `del-${ruta.id_rutas}`
                                                            }
                                                            onClick={() => eliminarRuta(ruta)}
                                                            style={{
                                                                background: '#c62828',
                                                                color: '#fff',
                                                                border: 'none',
                                                                padding: '6px 10px',
                                                                borderRadius: '6px',
                                                                fontSize: '12px',
                                                                cursor:
                                                                    ruta.codigo_ruta === 'SIN-ASIGNAR'
                                                                        ? 'not-allowed'
                                                                        : 'pointer',
                                                                opacity: ruta.codigo_ruta === 'SIN-ASIGNAR' ? 0.5 : 1
                                                            }}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}