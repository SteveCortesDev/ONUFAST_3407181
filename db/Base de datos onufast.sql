




CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL
);



CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    clave VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    jornada VARCHAR(20) NOT NULL
);



CREATE TABLE usuario_roles (
    id_usuario_rol SERIAL PRIMARY KEY,

    id_usuario INT NOT NULL,
    id_rol INT NOT NULL,

    CONSTRAINT fk_usuario_roles_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),

    CONSTRAINT fk_usuario_roles_rol
        FOREIGN KEY (id_rol)
        REFERENCES rol(id_rol)
);



CREATE TABLE documento (
    id_documento SERIAL PRIMARY KEY,

    tipo_documento VARCHAR(30) NOT NULL,
    num_documento VARCHAR(50) UNIQUE NOT NULL,

    id_usuario INT NOT NULL,

    CONSTRAINT fk_documento_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
);




CREATE TABLE tipo_envio (
    id_tipenvio SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);




CREATE TABLE estado_envio (
    id_estadoenvio SERIAL PRIMARY KEY,
    estado VARCHAR(50) NOT NULL
);



CREATE TABLE rutas (
    id_rutas SERIAL PRIMARY KEY,

    fecha_creacion TIMESTAMP NOT NULL,
    tiempo_estimado VARCHAR(50) NOT NULL,
    distancia_ruta DECIMAL(10,2) NOT NULL,

    ciudad_origen VARCHAR(100) NOT NULL,
    ciudad_destino VARCHAR(100) NOT NULL,

    cantidad_paquetes INT NOT NULL,

    codigo_ruta VARCHAR(50) UNIQUE,

   tipo_vehiculo VARCHAR(30) NOT NULL,

	nombre_conductor varchar(50) NOT NULL
);




CREATE TABLE envio (
    id_envio SERIAL PRIMARY KEY,

    id_usuario INT NOT NULL,
    id_tipenvio INT NOT NULL,
    id_estadoenvio INT NOT NULL,
    id_rutas INT NOT NULL,

    codigo_rastreo VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,

    nombre_destinatario VARCHAR(100) NOT NULL,
    documento_destinatario VARCHAR(50) NOT NULL,

    estado_paquete VARCHAR(30) NOT NULL,

    CONSTRAINT fk_envio_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),

    CONSTRAINT fk_envio_tipo
        FOREIGN KEY (id_tipenvio)
        REFERENCES tipo_envio(id_tipenvio),

    CONSTRAINT fk_envio_estado
        FOREIGN KEY (id_estadoenvio)
        REFERENCES estado_envio(id_estadoenvio),

    CONSTRAINT fk_envio_ruta
        FOREIGN KEY (id_rutas)
        REFERENCES rutas(id_rutas)
);



CREATE TABLE paquete (
    id_paquete SERIAL PRIMARY KEY,

    id_envio INT NOT NULL,

    num_guia VARCHAR(50) UNIQUE,
    cod_rastreo VARCHAR(100) NOT NULL,

    peso DECIMAL(8,2) NOT NULL,
    alto DECIMAL(8,2) NOT NULL,
    largo DECIMAL(8,2) NOT NULL,
    ancho DECIMAL(8,2) NOT NULL,

    descripcion VARCHAR(200),

    origen VARCHAR(100),
    destino VARCHAR(100),

    CONSTRAINT fk_paquete_envio
        FOREIGN KEY (id_envio)
        REFERENCES envio(id_envio)
);




CREATE TABLE factura (
    id_factura SERIAL PRIMARY KEY,

    id_envio INT NOT NULL,

    num_factura VARCHAR(50) NOT NULL,
    fecha_emision TIMESTAMP,

    subtotal DECIMAL(12,2) NOT NULL,
    iva DECIMAL(12,2) NOT NULL,
    total_pago DECIMAL(12,2) NOT NULL,

    metodo_pago VARCHAR(50) NOT NULL,

    CONSTRAINT fk_factura_envio
        FOREIGN KEY (id_envio)
        REFERENCES envio(id_envio)
);








INSERT INTO rol (nombre_rol)
VALUES
('Administrador'),
('Cliente'),
('Conductor'),
('Conductor Auxiliar'),
('Encargado de Bodega'),
('Despachador'),
('Atención al Cliente');


INSERT INTO usuario
(nombre, apellido, clave, correo, telefono, jornada)
VALUES
('Sofia', 'Ramirez', '123456', 'sofia@gmail.com', '3001112233', 'Mañana'),
('Laura', 'Gomez', '123456', 'laura@gmail.com', '3002223344', 'Tarde'),
('Carlos', 'Rodriguez', '123456', 'carlos@gmail.com', '3003334455', 'Noche'),
('Daniel', 'Martinez', '123456', 'daniel@gmail.com', '3004445566', 'Mañana'),
('Ana', 'Torres', '123456', 'ana@gmail.com', '3005556677', 'Tarde');


INSERT INTO documento
(tipo_documento, num_documento, id_usuario)
VALUES
('CC', '1001001001', 1),
('CC', '1001001002', 2),
('CC', '1001001003', 3),
('CC', '1001001004', 4),
('CC', '1001001005', 5);



INSERT INTO usuario_roles
(id_usuario, id_rol)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 2),
(5, 2);


INSERT INTO tipo_envio
(descripcion)
VALUES
('Express'),
('Normal');


INSERT INTO estado_envio
(estado)
VALUES
('Cancelado'),
('Confirmado'),
('En bodega'),
('En camino'),
('Entregado'),
('Devuelto');



INSERT INTO rutas
(
    fecha_creacion,
    tiempo_estimado,
    distancia_ruta,
    ciudad_origen,
    ciudad_destino,
    cantidad_paquetes,
    codigo_ruta,
    tipo_vehiculo
)
VALUES
(
    '2026-08-31 08:00:00',
    '2 horas',
    120.50,
    'Bogota',
    'Tunja',
    2,
    'RUTA-001',
    'Camion'
),
(
    '2026-08-31 09:00:00',
    '3 horas',
    180.00,
    'Bogota',
    'Ibague',
    3,
    'RUTA-002',
    'Camion'
),
(
    '2026-08-31 10:00:00',
    '1 hora',
    45.80,
    'Bogota',
    'Chia',
    1,
    'RUTA-003',
    'Moto'
),
(
    '2026-08-31 11:00:00',
    '4 horas',
    250.75,
    'Medellin',
    'Manizales',
    2,
    'RUTA-004',
    'Camion'
);


INSERT INTO envio
(
    id_usuario,
    id_tipenvio,
    id_estadoenvio,
    id_rutas,
    codigo_rastreo,
    fecha_creacion,
    nombre_destinatario,
    documento_destinatario,
    estado_paquete
)
VALUES
(
    2,
    1,
    2,
    1,
    'ONUF-0001',
    '2026-08-31 08:30:00',
    'Pedro Lopez',
    '1010101010',
    'Intacto'
),
(
    4,
    2,
    3,
    2,
    'ONUF-0002',
    '2026-08-31 09:00:00',
    'Maria Perez',
    '1010101011',
    'Intacto'
),
(
    5,
    1,
    4,
    3,
    'ONUF-0003',
    '2026-08-31 09:30:00',
    'Juan Hernandez',
    '1010101012',
    'Abierto'
),
(
    2,
    2,
    5,
    4,
    'ONUF-0004',
    '2026-08-31 10:00:00',
    'Camila Vargas',
    '1010101013',
    'Intacto'
),
(
    4,
    1,
    4,
    2,
    'ONUF-0005',
    '2026-08-31 10:30:00',
    'Andres Castro',
    '1010101014',
    'Dañado'
);





INSERT INTO paquete
(
    id_envio,
    num_guia,
    cod_rastreo,
    peso,
    alto,
    largo,
    ancho,
    descripcion,
    origen,
    destino
)
VALUES
(
    1,
    'GUIA-0001',
    'ONUF-0001',
    2.50,
    20.00,
    30.00,
    15.00,
    'Caja con documentos',
    'Bogota',
    'Tunja'
),
(
    2,
    'GUIA-0002',
    'ONUF-0002',
    5.00,
    30.00,
    40.00,
    25.00,
    'Caja mediana',
    'Bogota',
    'Ibague'
),
(
    3,
    'GUIA-0003',
    'ONUF-0003',
    1.20,
    15.00,
    20.00,
    10.00,
    'Paquete pequeno',
    'Bogota',
    'Chia'
),
(
    4,
    'GUIA-0004',
    'ONUF-0004',
    8.50,
    40.00,
    50.00,
    35.00,
    'Caja grande',
    'Medellin',
    'Manizales'
),
(
    5,
    'GUIA-0005',
    'ONUF-0005',
    3.75,
    25.00,
    35.00,
    20.00,
    'Paquete fragil',
    'Bogota',
    'Ibague'
);












INSERT INTO factura
(
    id_envio,
    num_factura,
    fecha_emision,
    subtotal,
    iva,
    total_pago,
    metodo_pago
)
VALUES
(
    1,
    'FAC-0001',
    '2026-08-31 09:00:00',
    25000.00,
    4750.00,
    29750.00,
    'Tarjeta'
),
(
    2,
    'FAC-0002',
    '2026-08-31 09:30:00',
    35000.00,
    6650.00,
    41650.00,
    'Efectivo'
),
(
    3,
    'FAC-0003',
    '2026-08-31 10:00:00',
    18000.00,
    3420.00,
    21420.00,
    'Transferencia'
),
(
    4,
    'FAC-0004',
    '2026-08-31 10:30:00',
    50000.00,
    9500.00,
    59500.00,
    'Tarjeta'
),
(
    5,
    'FAC-0005',
    '2026-08-31 11:00:00',
    30000.00,
    5700.00,
    35700.00,
    'Transferencia'
);









SELECT * FROM rol;
SELECT * FROM usuario;
SELECT * FROM documento;
SELECT * FROM usuario_roles;
SELECT * FROM tipo_envio;
SELECT * FROM estado_envio;
SELECT * FROM rutas;
SELECT * FROM envio;
SELECT * FROM paquete;
SELECT * FROM factura;

