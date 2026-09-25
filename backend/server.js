const express = require("express");
const cors = require("cors");
const path = require("path");

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/api/envios", async (req, res) => {
    try {
        const consulta = `
            SELECT
                e.id_envio,
                e.codigo_rastreo,
                CONCAT(u.nombre, ' ', u.apellido) AS usuario,
                te.descripcion AS tipo_envio,
                ee.estado AS estado_envio,
                r.codigo_ruta,
                r.ciudad_origen,
                r.ciudad_destino,
                r.tiempo_estimado,
                r.distancia_ruta,
                r.tipo_vehiculo,
                p.num_guia,
                p.peso,
                p.descripcion AS descripcion_paquete,
                e.nombre_destinatario,
                e.documento_destinatario,
                e.estado_paquete,
                f.num_factura,
                f.total_pago,
                f.metodo_pago
            FROM envio e
            INNER JOIN usuario u
                ON e.id_usuario = u.id_usuario
            INNER JOIN tipo_envio te
                ON e.id_tipenvio = te.id_tipenvio
            INNER JOIN estado_envio ee
                ON e.id_estadoenvio = ee.id_estadoenvio
            INNER JOIN rutas r
                ON e.id_rutas = r.id_rutas
            INNER JOIN paquete p
                ON e.id_envio = p.id_envio
            INNER JOIN factura f
                ON e.id_envio = f.id_envio
            ORDER BY e.id_envio;
        `;

        const resultado = await pool.query(consulta);

        res.json({
            status: "success",
            code: 200,
            mensaje: "Envíos recuperados exitosamente",
            data: resultado.rows
        });

    } catch (error) {
        console.error("Error en la consulta multitabla:", error);

        res.status(500).json({
            status: "error",
            code: 500,
            mensaje: "No fue posible consultar los envíos",
            error: error.message
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});