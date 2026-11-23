
import { useEffect, useState } from 'react';
import api from '../../shared/api';

export default function AdminVehiculos() {
    const [vehiculos, setVehiculos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    const formularioInicial = {
        placa: '',
        tipo_vehiculo: '',
        marca: '',
        modelo: '',
        capacidad_kg: '',
        estado: 'Disponible'
    };

    const [formulario, setFormulario] = useState(formularioInicial);

    // Cargar vehículos desde el backend
    const cargarVehiculos = async () => {
        try {
            setCargando(true);
            setError('');

            const respuesta = await api.get('/vehiculos/');
            setVehiculos(respuesta.data);

        } catch (err) {
            console.error('Error al cargar vehículos:', err);

            setError(
                err.response?.data?.detail ||
                'No se pudieron cargar los vehículos.'
            );
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarVehiculos();
    }, []);

    // Actualizar los campos del formulario
    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }));
    };

    // Abrir formulario para registrar
    const abrirRegistro = () => {
        setFormulario(formularioInicial);
        setEditando(false);
        setIdEditar(null);
        setMostrarFormulario(true);
        setError('');
        setMensaje('');
    };

    // Abrir formulario para editar
    const abrirEdicion = (vehiculo) => {
        setFormulario({
            placa: vehiculo.placa,
            tipo_vehiculo: vehiculo.tipo_vehiculo,
            marca: vehiculo.marca,
            modelo: vehiculo.modelo,
            capacidad_kg: vehiculo.capacidad_kg,
            estado: vehiculo.estado
        });

        setIdEditar(vehiculo.id_vehiculo);
        setEditando(true);
        setMostrarFormulario(true);
        setError('');
        setMensaje('');
    };

    // Registrar o actualizar vehículo
    const guardarVehiculo = async (e) => {
        e.preventDefault();

        try {
            setError('');
            setMensaje('');

            const datos = {
                placa: formulario.placa.trim().toUpperCase(),
                tipo_vehiculo: formulario.tipo_vehiculo.trim(),
                marca: formulario.marca.trim(),
                modelo: formulario.modelo.trim(),
                capacidad_kg: Number(formulario.capacidad_kg),
                estado: formulario.estado
            };

            if (
                !datos.placa ||
                !datos.tipo_vehiculo ||
                !datos.marca ||
                !datos.modelo ||
                !datos.capacidad_kg ||
                datos.capacidad_kg <= 0
            ) {
                setError('Completa todos los campos con datos válidos.');
                return;
            }

            if (editando) {
                await api.put(`/vehiculos/${idEditar}`, datos);
                setMensaje('Vehículo actualizado correctamente.');
            } else {
                await api.post('/vehiculos/', datos);
                setMensaje('Vehículo registrado correctamente.');
            }

            setMostrarFormulario(false);
            setFormulario(formularioInicial);
            setEditando(false);
            setIdEditar(null);

            await cargarVehiculos();

        } catch (err) {
            console.error('Error al guardar vehículo:', err);

            setError(
                err.response?.data?.detail ||
                'No se pudo guardar el vehículo.'
            );
        }
    };

    // Eliminar vehículo
    const eliminarVehiculo = async (id) => {
        const confirmar = window.confirm(
            '¿Estás seguro de que deseas eliminar este vehículo?'
        );

        if (!confirmar) return;

        try {
            setError('');
            setMensaje('');

            await api.delete(`/vehiculos/${id}`);

            setMensaje('Vehículo eliminado correctamente.');
            await cargarVehiculos();

        } catch (err) {
            console.error('Error al eliminar vehículo:', err);

            setError(
                err.response?.data?.detail ||
                'No se pudo eliminar el vehículo.'
            );
        }
    };

    // Color según el estado
    const obtenerClaseEstado = (estado) => {
        if (estado === 'Disponible') return 'status-entregado';
        if (estado === 'En ruta') return 'status-en-camino';
        return 'status-cancelado';
    };

    return (
        <div>
            <div className="admin-header">
                <h1>🚛 Gestión de Vehículos</h1>

                <button
                    className="admin-btn"
                    onClick={abrirRegistro}
                >
                    + Agregar Vehículo
                </button>
            </div>

            <div className="admin-section">

                {mensaje && (
                    <div className="admin-card">
                        <p style={{ color: 'green' }}>{mensaje}</p>
                    </div>
                )}

                {error && (
                    <div className="admin-card">
                        <p style={{ color: 'red' }}>{error}</p>
                    </div>
                )}

                {mostrarFormulario && (
                    <div className="admin-card" style={{ marginBottom: '20px' }}>
                        <h3>
                            {editando ? 'Editar vehículo' : 'Registrar vehículo'}
                        </h3>

                        <form onSubmit={guardarVehiculo}>
                            <div className="admin-grid">

                                <div>
                                    <label>Placa</label>
                                    <input
                                        type="text"
                                        name="placa"
                                        value={formulario.placa}
                                        onChange={manejarCambio}
                                        placeholder="Ej: ABC123"
                                        maxLength="10"
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Tipo de vehículo</label>
                                    <input
                                        type="text"
                                        name="tipo_vehiculo"
                                        value={formulario.tipo_vehiculo}
                                        onChange={manejarCambio}
                                        placeholder="Ej: Camioneta"
                                        maxLength="30"
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Marca</label>
                                    <input
                                        type="text"
                                        name="marca"
                                        value={formulario.marca}
                                        onChange={manejarCambio}
                                        placeholder="Ej: Chevrolet"
                                        maxLength="50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Modelo</label>
                                    <input
                                        type="text"
                                        name="modelo"
                                        value={formulario.modelo}
                                        onChange={manejarCambio}
                                        placeholder="Ej: N300"
                                        maxLength="50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Capacidad (kg)</label>
                                    <input
                                        type="number"
                                        name="capacidad_kg"
                                        value={formulario.capacidad_kg}
                                        onChange={manejarCambio}
                                        placeholder="Ej: 1200"
                                        min="0.01"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div>
                                    <label>Estado</label>
                                    <select
                                        name="estado"
                                        value={formulario.estado}
                                        onChange={manejarCambio}
                                        required
                                    >
                                        <option value="Disponible">Disponible</option>
                                        <option value="En ruta">En ruta</option>
                                        <option value="Mantenimiento">Mantenimiento</option>
                                    </select>
                                </div>

                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '10px',
                                marginTop: '20px',
                                flexWrap: 'wrap'
                            }}>
                                <button
                                    type="submit"
                                    className="admin-btn"
                                >
                                    {editando ? 'Guardar cambios' : 'Registrar vehículo'}
                                </button>

                                <button
                                    type="button"
                                    className="admin-btn"
                                    onClick={() => setMostrarFormulario(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <h3>Vehículos registrados</h3>

                {cargando ? (
                    <p>Cargando vehículos...</p>
                ) : vehiculos.length === 0 ? (
                    <div className="admin-card">
                        <p>No hay vehículos registrados.</p>
                    </div>
                ) : (
                    <div className="admin-grid">
                        {vehiculos.map((vehiculo) => (
                            <div
                                key={vehiculo.id_vehiculo}
                                className="admin-card"
                            >
                                <h4>🚛 {vehiculo.tipo_vehiculo}</h4>

                                <p>
                                    <strong>Placa:</strong> {vehiculo.placa}
                                </p>

                                <p>
                                    <strong>Marca:</strong> {vehiculo.marca}
                                </p>

                                <p>
                                    <strong>Modelo:</strong> {vehiculo.modelo}
                                </p>

                                <p>
                                    <strong>Capacidad:</strong>{' '}
                                    {vehiculo.capacidad_kg} kg
                                </p>

                                <p>
                                    <strong>Estado:</strong>{' '}
                                    <span className={`status-badge ${obtenerClaseEstado(vehiculo.estado)}`}>
                                        {vehiculo.estado}
                                    </span>
                                </p>

                                <div style={{
                                    display: 'flex',
                                    gap: '10px',
                                    flexWrap: 'wrap',
                                    marginTop: '15px'
                                }}>
                                    <button
                                        className="admin-btn"
                                        onClick={() => abrirEdicion(vehiculo)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="admin-btn"
                                        onClick={() => eliminarVehiculo(vehiculo.id_vehiculo)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
