
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

    // Cargar vehículos
    const cargarVehiculos = async () => {
        try {
            setCargando(true);
            setError('');

            const respuesta = await api.get('/vehiculos/');

            setVehiculos(Array.isArray(respuesta.data) ? respuesta.data : []);

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

    // Manejar cambios
    const manejarCambio = (e) => {
        const { name, value } = e.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: value
        }));
    };

    // Abrir registro
    const abrirRegistro = () => {
        setFormulario(formularioInicial);
        setEditando(false);
        setIdEditar(null);
        setMostrarFormulario(true);
        setError('');
        setMensaje('');
    };

    // Abrir edición
    const abrirEdicion = (vehiculo) => {
        setFormulario({
            placa: vehiculo.placa ?? '',
            tipo_vehiculo: vehiculo.tipo_vehiculo ?? '',
            marca: vehiculo.marca ?? '',
            modelo: vehiculo.modelo ?? '',
            capacidad_kg: vehiculo.capacidad_kg ?? '',
            estado: vehiculo.estado ?? 'Disponible'
        });

        setIdEditar(vehiculo.id_vehiculo);
        setEditando(true);
        setMostrarFormulario(true);
        setError('');
        setMensaje('');
    };

    // Cerrar formulario
    const cerrarFormulario = () => {
        setMostrarFormulario(false);
        setFormulario(formularioInicial);
        setEditando(false);
        setIdEditar(null);
        setError('');
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

            // Validaciones del backend
            if (datos.placa.length < 5 || datos.placa.length > 10) {
                setError('La placa debe tener entre 5 y 10 caracteres.');
                return;
            }

            if (datos.tipo_vehiculo.length < 2 || datos.tipo_vehiculo.length > 30) {
                setError('El tipo de vehículo debe tener entre 2 y 30 caracteres.');
                return;
            }

            if (datos.marca.length < 2 || datos.marca.length > 50) {
                setError('La marca debe tener entre 2 y 50 caracteres.');
                return;
            }

            if (datos.modelo.length < 1 || datos.modelo.length > 50) {
                setError('El modelo debe tener entre 1 y 50 caracteres.');
                return;
            }

            if (!Number.isFinite(datos.capacidad_kg) || datos.capacidad_kg <= 0) {
                setError('La capacidad debe ser un número mayor que cero.');
                return;
            }

            if (!['Disponible', 'En ruta', 'Mantenimiento'].includes(datos.estado)) {
                setError('Selecciona un estado válido.');
                return;
            }

            if (editando) {
                await api.put(`/vehiculos/${idEditar}`, datos);
                setMensaje('Vehículo actualizado correctamente.');
            } else {
                await api.post('/vehiculos/', datos);
                setMensaje('Vehículo registrado correctamente.');
            }

            cerrarFormulario();
            await cargarVehiculos();

        } catch (err) {
            console.error('Error al guardar vehículo:', err);

            const detalle = err.response?.data?.detail;

            setError(
                Array.isArray(detalle)
                    ? detalle.map((item) => item.msg).join(' | ')
                    : detalle || 'No se pudo guardar el vehículo.'
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

    // Clases de estado
    const obtenerClaseEstado = (estado) => {
        if (estado === 'Disponible') return 'vehiculo-disponible';
        if (estado === 'En ruta') return 'vehiculo-en-ruta';
        return 'vehiculo-mantenimiento';
    };

    return (
        <div className="vehiculos-container">

            <div className="vehiculos-encabezado">
                <div>
                    <span className="vehiculos-subtitulo">
                        PANEL DE ADMINISTRACIÓN
                    </span>
                    <h1>Gestión de vehículos</h1>
                    <p>Administra y consulta los vehículos registrados en ONUFAST.</p>
                </div>

                <button
                    className="vehiculos-btn vehiculos-btn-principal"
                    onClick={abrirRegistro}
                >
                    <span>＋</span> Agregar vehículo
                </button>
            </div>

            {mensaje && (
                <div className="vehiculos-alerta vehiculos-alerta-exito">
                    {mensaje}
                </div>
            )}

            {error && (
                <div className="vehiculos-alerta vehiculos-alerta-error">
                    {error}
                </div>
            )}

            {mostrarFormulario && (
                <section className="vehiculos-formulario">

                    <div className="vehiculos-formulario-header">
                        <div>
                            <span className="vehiculos-subtitulo">
                                {editando ? 'ACTUALIZACIÓN' : 'NUEVO REGISTRO'}
                            </span>
                            <h2>
                                {editando ? 'Editar vehículo' : 'Registrar vehículo'}
                            </h2>
                            <p>
                                Ingresa la información correspondiente al vehículo.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="vehiculos-cerrar"
                            onClick={cerrarFormulario}
                            aria-label="Cerrar formulario"
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={guardarVehiculo}>

                        <div className="vehiculos-grupo">
                            <h3>01. Identificación del vehículo</h3>
                            <p>Información básica para identificar el vehículo.</p>

                            <div className="vehiculos-grid-form">
                                <div className="vehiculos-campo">
                                    <label htmlFor="placa">Placa</label>
                                    <input
                                        id="placa"
                                        type="text"
                                        name="placa"
                                        value={formulario.placa}
                                        onChange={manejarCambio}
                                        placeholder="Ej: ABC123"
                                        minLength={5}
                                        maxLength={10}
                                        required
                                    />
                                </div>

                                <div className="vehiculos-campo">
                                    <label htmlFor="tipo_vehiculo">Tipo de vehículo</label>
                                    <input
                                        id="tipo_vehiculo"
                                        type="text"
                                        name="tipo_vehiculo"
                                        value={formulario.tipo_vehiculo}
                                        onChange={manejarCambio}
                                        placeholder="Ej: Camioneta"
                                        minLength={2}
                                        maxLength={30}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="vehiculos-grupo">
                            <h3>02. Características</h3>
                            <p>Datos técnicos y características del vehículo.</p>

                            <div className="vehiculos-grid-form">
                                <div className="vehiculos-campo">
                                    <label htmlFor="marca">Marca</label>
                                    <input
                                        id="marca"
                                        type="text"
                                        name="marca"
                                        value={formulario.marca}
                                        onChange={manejarCambio}
                                        placeholder="Ej: Chevrolet"
                                        minLength={2}
                                        maxLength={50}
                                        required
                                    />
                                </div>

                                <div className="vehiculos-campo">
                                    <label htmlFor="modelo">Modelo</label>
                                    <input
                                        id="modelo"
                                        type="text"
                                        name="modelo"
                                        value={formulario.modelo}
                                        onChange={manejarCambio}
                                        placeholder="Ej: N300"
                                        minLength={1}
                                        maxLength={50}
                                        required
                                    />
                                </div>

                                <div className="vehiculos-campo">
                                    <label htmlFor="capacidad_kg">Capacidad de carga (kg)</label>
                                    <input
                                        id="capacidad_kg"
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

                                <div className="vehiculos-campo">
                                    <label htmlFor="estado">Estado del vehículo</label>
                                    <select
                                        id="estado"
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
                        </div>

                        <div className="vehiculos-formulario-acciones">
                            <button
                                type="button"
                                className="vehiculos-btn vehiculos-btn-secundario"
                                onClick={cerrarFormulario}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="vehiculos-btn vehiculos-btn-principal"
                            >
                                {editando ? 'Guardar cambios' : 'Registrar vehículo'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <div className="vehiculos-listado-header">
                <div>
                    <h2>Vehículos registrados</h2>
                    <p>Consulta y administra la flota de transporte.</p>
                </div>

                <span className="vehiculos-contador">
                    {vehiculos.length} vehículos
                </span>
            </div>

            {cargando ? (
                <div className="vehiculos-vacio">
                    Cargando vehículos...
                </div>
            ) : vehiculos.length === 0 ? (
                <div className="vehiculos-vacio">
                    <h3>No hay vehículos registrados</h3>
                    <p>Agrega un vehículo para comenzar a gestionar la flota.</p>
                </div>
            ) : (
                <div className="vehiculos-grid-tarjetas">
                    {vehiculos.map((vehiculo) => (
                        <article
                            key={vehiculo.id_vehiculo}
                            className="vehiculos-tarjeta"
                        >
                            <div className="vehiculos-tarjeta-header">
                                <div className="vehiculos-icono">🚚</div>

                                <span className={`vehiculos-estado ${obtenerClaseEstado(vehiculo.estado)}`}>
                                    {vehiculo.estado}
                                </span>
                            </div>

                            <h3>{vehiculo.tipo_vehiculo}</h3>

                            <div className="vehiculos-placa">
                                {vehiculo.placa}
                            </div>

                            <div className="vehiculos-datos">
                                <div>
                                    <span>Marca</span>
                                    <strong>{vehiculo.marca}</strong>
                                </div>

                                <div>
                                    <span>Modelo</span>
                                    <strong>{vehiculo.modelo}</strong>
                                </div>

                                <div>
                                    <span>Capacidad</span>
                                    <strong>{vehiculo.capacidad_kg} kg</strong>
                                </div>
                            </div>

                            <div className="vehiculos-tarjeta-acciones">
                                <button
                                    className="vehiculos-btn vehiculos-btn-editar"
                                    onClick={() => abrirEdicion(vehiculo)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="vehiculos-btn vehiculos-btn-eliminar"
                                    onClick={() => eliminarVehiculo(vehiculo.id_vehiculo)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
