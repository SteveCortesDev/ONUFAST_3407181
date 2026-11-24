
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/shared/api';

export default function AdminDashboard() {
    const navigate = useNavigate();

    const [envios, setEnvios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const normalizar = (texto = '') =>
        texto.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();

    const cargarEnvios = async () => {
        try {
            setCargando(true);
            setError('');

            const respuesta = await api.get('/envios/admin/listado');

            console.log('Datos del Dashboard:', respuesta.data);

            setEnvios(
                Array.isArray(respuesta.data) ? respuesta.data : []
            );
        } catch (err) {
            console.error('Error al cargar el Dashboard:', err);
            setError(
                err.response?.data?.detail ||
                'No fue posible cargar la información del panel.'
            );
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarEnvios();
    }, []);

    const totalEnvios = envios.length;

    const enviosEntregados = envios.filter(
        envio => normalizar(envio.estado) === 'entregado'
    ).length;

    const enviosActivos = envios.filter(envio => {
        const estado = normalizar(envio.estado);
        return !['entregado', 'cancelado', 'devuelto'].includes(estado);
    }).length;

    const ahora = new Date();

    const ingresosMes = envios.reduce((total, envio) => {
        if (!envio.fecha_creacion) return total;

        const fecha = new Date(envio.fecha_creacion);
        const estado = normalizar(envio.estado);

        const esMesActual =
            fecha.getMonth() === ahora.getMonth() &&
            fecha.getFullYear() === ahora.getFullYear();

        if (!esMesActual || ['cancelado', 'devuelto'].includes(estado)) {
            return total;
        }

        return total + Number(envio.paquete?.precio_envio || 0);
    }, 0);

    const formatoMoneda = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    });

    const formatoFecha = fecha => {
        if (!fecha) return 'Sin fecha';

        const fechaConvertida = new Date(fecha);

        if (Number.isNaN(fechaConvertida.getTime())) {
            return 'Fecha no disponible';
        }

        return fechaConvertida.toLocaleDateString('es-CO');
    };

    const enviosRecientes = [...envios]
        .sort((a, b) =>
            new Date(b.fecha_creacion || 0) -
            new Date(a.fecha_creacion || 0)
        )
        .slice(0, 5);

    const stats = [
        {
            title: 'Envíos Totales',
            value: totalEnvios.toLocaleString('es-CO'),
            icon: '📦',
            active: true
        },
        {
            title: 'Envíos Activos',
            value: enviosActivos.toLocaleString('es-CO'),
            icon: '🚚'
        },
        {
            title: 'Envíos Entregados',
            value: enviosEntregados.toLocaleString('es-CO'),
            icon: '✅'
        },
        {
            title: 'Ingresos del Mes',
            value: formatoMoneda.format(ingresosMes),
            icon: '💰'
        }
    ];

    const obtenerClaseEstado = estado =>
        `status-${normalizar(estado || '').replace(/\s+/g, '-')}`;

    return (
        <div>
            <div className="admin-header">
                <h1>📊 Dashboard</h1>
                <button className="admin-btn" onClick={() => navigate('/')}>
                    Ver Sitio Principal
                </button>
            </div>

            <div className="admin-stats-grid">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`admin-stat-card ${stat.active ? 'active' : ''}`}
                    >
                        <h3>{stat.icon} {stat.title}</h3>
                        <p>{cargando ? '...' : stat.value}</p>
                    </div>
                ))}
            </div>

            {error && (
                <div className="admin-dashboard-error">
                    <p>⚠️ {error}</p>
                    <button
                        className="admin-btn-secondary"
                        onClick={cargarEnvios}
                    >
                        Reintentar
                    </button>
                </div>
            )}

            <div className="admin-section">
                <h2 className="admin-section-title">Últimos Envíos</h2>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Cliente</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cargando ? (
                                <tr>
                                    <td colSpan="4" className="admin-dashboard-message">
                                        Cargando envíos...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="4" className="admin-dashboard-message">
                                        No se pudieron cargar los envíos.
                                    </td>
                                </tr>
                            ) : enviosRecientes.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="admin-dashboard-message">
                                        Todavía no hay envíos registrados.
                                    </td>
                                </tr>
                            ) : (
                                enviosRecientes.map(envio => (
                                    <tr key={envio.id_envio}>
                                        <td>{envio.codigo_rastreo}</td>
                                        <td>{envio.cliente || 'Sin cliente'}</td>
                                        <td>
                                            <span className={`status-badge ${obtenerClaseEstado(envio.estado)}`}>
                                                {envio.estado}
                                            </span>
                                        </td>
                                        <td>{formatoFecha(envio.fecha_creacion)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
