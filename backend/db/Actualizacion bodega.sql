-- ============================================================
--  ONUFAST · Actualización para el panel de bodega
--  NO borra nada. Solo agrega lo que falta:
--    · la ruta comodín SIN-ASIGNAR
--    · los estados y tipos de envío básicos
--    · el usuario de bodega (rol "Encargado de Bodega")
--    · convierte las contraseñas "123456" en texto plano a bcrypt
--
--  Se puede ejecutar varias veces sin problema.
--
--  Ejecutar con:
--    psql -U postgres -d onufast -f "backend/db/Actualizacion bodega.sql"
--  (o en pgAdmin: Query Tool → abrir archivo → F5)
-- ============================================================


-- 1) Ruta comodín para los paquetes que aún no tienen despacho
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'rutas'
          AND column_name = 'estado'
    ) THEN
        INSERT INTO rutas
        (
            fecha_creacion,
            tiempo_estimado,
            distancia_ruta,
            ciudad_origen,
            ciudad_destino,
            cantidad_paquetes,
            codigo_ruta,
            tipo_vehiculo,
            nombre_conductor,
            estado
        )
        SELECT
            NOW(),
            'Por definir',
            0,
            'Por definir',
            'Por definir',
            0,
            'SIN-ASIGNAR',
            'Por definir',
            'Sin asignar',
            'Pendiente'
        WHERE NOT EXISTS (
            SELECT 1 FROM rutas WHERE codigo_ruta = 'SIN-ASIGNAR'
        );
    ELSE
        INSERT INTO rutas
        (
            fecha_creacion,
            tiempo_estimado,
            distancia_ruta,
            ciudad_origen,
            ciudad_destino,
            cantidad_paquetes,
            codigo_ruta,
            tipo_vehiculo,
            nombre_conductor
        )
        SELECT
            NOW(),
            'Por definir',
            0,
            'Por definir',
            'Por definir',
            0,
            'SIN-ASIGNAR',
            'Por definir',
            'Sin asignar'
        WHERE NOT EXISTS (
            SELECT 1 FROM rutas WHERE codigo_ruta = 'SIN-ASIGNAR'
        );
    END IF;
END $$;


-- 2) Estados que usa el panel (si ya existen, no hace nada)
INSERT INTO estado_envio (estado)
SELECT 'Pendiente'
WHERE NOT EXISTS (SELECT 1 FROM estado_envio WHERE estado = 'Pendiente');

INSERT INTO estado_envio (estado)
SELECT 'Confirmado'
WHERE NOT EXISTS (SELECT 1 FROM estado_envio WHERE estado = 'Confirmado');

INSERT INTO estado_envio (estado)
SELECT 'En bodega'
WHERE NOT EXISTS (SELECT 1 FROM estado_envio WHERE estado = 'En bodega');

INSERT INTO estado_envio (estado)
SELECT 'En camino'
WHERE NOT EXISTS (SELECT 1 FROM estado_envio WHERE estado = 'En camino');

INSERT INTO estado_envio (estado)
SELECT 'Entregado'
WHERE NOT EXISTS (SELECT 1 FROM estado_envio WHERE estado = 'Entregado');

INSERT INTO estado_envio (estado)
SELECT 'Devuelto'
WHERE NOT EXISTS (SELECT 1 FROM estado_envio WHERE estado = 'Devuelto');

INSERT INTO estado_envio (estado)
SELECT 'Cancelado'
WHERE NOT EXISTS (SELECT 1 FROM estado_envio WHERE estado = 'Cancelado');


-- 3) Tipos de envío básicos
INSERT INTO tipo_envio (descripcion)
SELECT 'Normal'
WHERE NOT EXISTS (SELECT 1 FROM tipo_envio WHERE descripcion = 'Normal');

INSERT INTO tipo_envio (descripcion)
SELECT 'Express'
WHERE NOT EXISTS (SELECT 1 FROM tipo_envio WHERE descripcion = 'Express');


-- 4) Rol "Encargado de Bodega" (por si la tabla rol está vacía)
INSERT INTO rol (nombre_rol)
SELECT 'Encargado de Bodega'
WHERE NOT EXISTS (
    SELECT 1 FROM rol WHERE nombre_rol = 'Encargado de Bodega'
);


-- 5) Usuario de bodega: bodega@onufast.com / 123456
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'usuario'
          AND column_name = 'activo'
    ) THEN
        INSERT INTO usuario
        (nombre, apellido, clave, correo, telefono, jornada, activo)
        SELECT
            'Bodega',
            'Central',
            '$2b$12$dHVO/oXV.4tbgdPLmQi67OQCyOAqSe5ndnMAnfNkf.TQ/W8iESHta',
            'bodega@onufast.com',
            '3009998877',
            'Mañana',
            TRUE
        WHERE NOT EXISTS (
            SELECT 1 FROM usuario WHERE correo = 'bodega@onufast.com'
        );
    ELSE
        INSERT INTO usuario
        (nombre, apellido, clave, correo, telefono, jornada)
        SELECT
            'Bodega',
            'Central',
            '$2b$12$dHVO/oXV.4tbgdPLmQi67OQCyOAqSe5ndnMAnfNkf.TQ/W8iESHta',
            'bodega@onufast.com',
            '3009998877',
            'Mañana'
        WHERE NOT EXISTS (
            SELECT 1 FROM usuario WHERE correo = 'bodega@onufast.com'
        );
    END IF;
END $$;


INSERT INTO documento (tipo_documento, num_documento, id_usuario)
SELECT
    'CC',
    '1001001006',
    u.id_usuario
FROM usuario u
WHERE u.correo = 'bodega@onufast.com'
  AND NOT EXISTS (
      SELECT 1 FROM documento d
      WHERE d.num_documento = '1001001006'
  );


INSERT INTO usuario_roles (id_usuario, id_rol)
SELECT
    u.id_usuario,
    r.id_rol
FROM usuario u, rol r
WHERE u.correo = 'bodega@onufast.com'
  AND r.nombre_rol = 'Encargado de Bodega'
  AND NOT EXISTS (
      SELECT 1 FROM usuario_roles ur
      WHERE ur.id_usuario = u.id_usuario
        AND ur.id_rol = r.id_rol
  );


-- 6) Contraseñas en texto plano -> bcrypt
--    (el login usa bcrypt; si dejabas "123456" escrito, no dejaba entrar)
UPDATE usuario
SET clave = '$2b$12$dHVO/oXV.4tbgdPLmQi67OQCyOAqSe5ndnMAnfNkf.TQ/W8iESHta'
WHERE clave = '123456';


-- 7) Comprobación final
SELECT
    u.id_usuario,
    u.nombre || ' ' || u.apellido AS usuario,
    u.correo,
    r.nombre_rol
FROM usuario u
LEFT JOIN usuario_roles ur ON ur.id_usuario = u.id_usuario
LEFT JOIN rol r ON r.id_rol = ur.id_rol
ORDER BY u.id_usuario;
