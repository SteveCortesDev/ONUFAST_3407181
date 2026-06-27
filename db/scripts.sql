CREATE TABLE ROL (
    id_rol        INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol    VARCHAR(50) NOT NULL
);

CREATE TABLE USUARIO (
    id_usuario  INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    apellido     VARCHAR(100) NOT NULL,
    clave       VARCHAR(20) NOT NULL,
    correo      VARCHAR(100)NOT NULL,
    telefono    VARCHAR(20) NOT NULL,
    direccion    VARCHAR(200) NOT NULL
);

CREATE TABLE JORNADA (
    id_jornada INT AUTO_INCREMENT PRIMARY KEY,
    tipo_jornada VARCHAR(30) NOT NULL
);

CREATE TABLE REMITENTE (
    id_remitente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    correo VARCHAR(100)
);

CREATE TABLE DESTINATARIO (
    id_destinatario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    correo VARCHAR(100)
);


CREATE TABLE DOCUMENTO (
    id_documento INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo_documento VARCHAR(30) NOT NULL,
    numero_documento VARCHAR(50) NOT NULL UNIQUE,
    FOREIGN KEY (id_usuario)
    REFERENCES USUARIO(id_usuario)
);


CREATE TABLE USUARIO_ROLES (
    id_usuario_rol  INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario      INT NOT NULL,
    id_rol          INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    FOREIGN KEY (id_rol)     REFERENCES ROL(id_rol)
);


CREATE TABLE USUARIO_JORNADA (
    id_user_jornada INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_jornada INT NOT NULL,

    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    FOREIGN KEY (id_jornada) REFERENCES JORNADA(id_jornada)
);


CREATE TABLE ESTADO_ENVIO (
    id_esenvio INT AUTO_INCREMENT PRIMARY KEY,
    estado VARCHAR(50) NOT NULL
);

CREATE TABLE TIPO_ENVIO (
    id_tipenvio INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE ENVIO (
    id_envio INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_tipenvio INT NOT NULL,
    id_esenvio INT NOT NULL,
    id_remitente INT NOT NULL,
    id_destinatario INT NOT NULL,
    codigo_rastreo VARCHAR(100) NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    cantidad INT DEFAULT 1 NOT NULL,

    FOREIGN KEY (id_usuario)
    REFERENCES USUARIO(id_usuario),

    FOREIGN KEY (id_tipenvio)
    REFERENCES TIPO_ENVIO(id_tipenvio),

    FOREIGN KEY (id_esenvio)
    REFERENCES ESTADO_ENVIO(id_esenvio),

    FOREIGN KEY (id_remitente)
    REFERENCES REMITENTE(id_remitente),

    FOREIGN KEY (id_destinatario)
    REFERENCES DESTINATARIO(id_destinatario)
);


CREATE TABLE PAQUETE (
    id_paquete INT AUTO_INCREMENT PRIMARY KEY,
    id_envio INT NOT NULL,
    num_guia VARCHAR(50) UNIQUE NOT NULL,
    cod_rastreo VARCHAR(100) NOT NULL,
    peso DECIMAL(8,2) NOT NULL,
    alto DECIMAL(8,2) NOT NULL,
    largo DECIMAL(8,2) NOT NULL,
    ancho DECIMAL(8,2) NOT NULL,
    descripcion VARCHAR(200),

    FOREIGN KEY (id_envio)
    REFERENCES ENVIO(id_envio)
);

CREATE TABLE ESTADO_PAQUETE (
    id_estpaquete INT AUTO_INCREMENT PRIMARY KEY,
    id_paquete INT NOT NULL,
    id_esenvio INT NOT NULL,

    FOREIGN KEY (id_paquete)
    REFERENCES PAQUETE(id_paquete),

    FOREIGN KEY (id_esenvio)
    REFERENCES ESTADO_ENVIO(id_esenvio)
);

CREATE TABLE FACTURA (
    id_factura      INT AUTO_INCREMENT PRIMARY KEY,
    num_factura     VARCHAR(50) NOT NULL,
    fecha_emision   DATETIME DEFAULT CURRENT_TIMESTAMP,
    subtotal        DECIMAL(12,2) NOT NULL,
    iva             DECIMAL(12,2) NOT NULL,
    total_pago      DECIMAL(12,2) NOT NULL,
    metodo_pago     VARCHAR(50) NOT NULL,
    id_envio       INT NOT NULL UNIQUE,
    FOREIGN KEY (id_envio) REFERENCES envio(id_envio)
);

CREATE TABLE DETALLE_FACTURA (
    id_detalle      INT AUTO_INCREMENT PRIMARY KEY,
    id_factura      INT NOT NULL,
    descripcion     VARCHAR(255),
    cantidad        INT,
    valor_unitario  DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (id_factura) REFERENCES FACTURA(id_factura)
);


-- ===========================
-- TABLA ROL
-- ===========================
INSERT INTO ROL (nombre_rol) VALUES
('Administrador'),
('Cliente'),
('Conductor'),
('Conductor Auxiliar'),
('Encargado de Bodega'),
('Despachador'),
('Coordinador de Transporte'),
('Atención al Cliente');

-- ===========================
-- TABLA JORNADA
-- ===========================
INSERT INTO JORNADA (tipo_jornada) VALUES
('Mañana'),
('Tarde'),
('Noche');

-- ===========================
-- TABLA TIPO_ENVIO
-- ===========================
INSERT INTO TIPO_ENVIO (descripcion) VALUES
('Estándar'),
('Express');

-- ===========================
-- TABLA ESTADO_ENVIO
-- ===========================
INSERT INTO ESTADO_ENVIO (estado) VALUES
('Pendiente'),
('Confirmado'),
('En preparación'),
('Despachado'),
('En tránsito'),
('Entregado'),
('Cancelado'),
('Devuelto');

-- ===========================
-- TABLA USUARIO
-- ===========================
INSERT INTO USUARIO
(nombre,apellido,clave,correo,telefono,direccion)
VALUES
('Juan','Pérez','1234','juan.perez@gmail.com','3001111111','Calle 10 #15-20 Bogotá'),
('Ana','Gómez','1234','ana.gomez@gmail.com','3001111112','Carrera 20 #30-15 Medellín'),
('Luis','Martínez','1234','luis.martinez@gmail.com','3001111113','Calle 45 #12-34 Cali'),
('María','Rodríguez','1234','maria.rodriguez@gmail.com','3001111114','Carrera 18 #25-40 Barranquilla'),
('Carlos','López','1234','carlos.lopez@gmail.com','3001111115','Calle 22 #18-55 Bucaramanga'),
('Laura','Torres','1234','laura.torres@gmail.com','3001111116','Carrera 50 #70-20 Cartagena'),
('Andrés','Ramírez','1234','andres.ramirez@gmail.com','3001111117','Calle 15 #40-80 Cúcuta'),
('Diana','Castro','1234','diana.castro@gmail.com','3001111118','Carrera 12 #10-90 Pereira'),
('Miguel','Herrera','1234','miguel.herrera@gmail.com','3001111119','Calle 8 #25-60 Manizales'),
('Paula','Vargas','1234','paula.vargas@gmail.com','3001111120','Carrera 35 #22-15 Ibagué'),
('Camilo','Suárez','1234','camilo.suarez@gmail.com','3001111121','Calle 30 #45-12 Neiva'),
('Valentina','Moreno','1234','valentina.moreno@gmail.com','3001111122','Carrera 40 #18-10 Villavicencio'),
('Jorge','Rojas','1234','jorge.rojas@gmail.com','3001111123','Calle 5 #60-20 Pasto'),
('Natalia','Ortiz','1234','natalia.ortiz@gmail.com','3001111124','Carrera 14 #36-25 Montería'),
('Santiago','Mendoza','1234','santiago.mendoza@gmail.com','3001111125','Calle 55 #10-45 Armenia'),
('Daniela','Reyes','1234','daniela.reyes@gmail.com','3001111126','Carrera 8 #12-33 Sincelejo'),
('Felipe','Silva','1234','felipe.silva@gmail.com','3001111127','Calle 16 #28-40 Tunja'),
('Karen','Jiménez','1234','karen.jimenez@gmail.com','3001111128','Carrera 22 #17-80 Popayán'),
('David','Pineda','1234','david.pineda@gmail.com','3001111129','Calle 12 #14-25 Santa Marta'),
('Sara','Cruz','1234','sara.cruz@gmail.com','3001111130','Carrera 9 #30-50 Valledupar');

-- ===========================
-- TABLA DOCUMENTO
-- ===========================
INSERT INTO DOCUMENTO
(id_usuario,tipo_documento,numero_documento)
VALUES
(1,'Cédula de Ciudadanía','1000000001'),
(2,'Cédula de Ciudadanía','1000000002'),
(3,'Cédula de Ciudadanía','1000000003'),
(4,'Cédula de Ciudadanía','1000000004'),
(5,'Cédula de Ciudadanía','1000000005'),
(6,'Cédula de Ciudadanía','1000000006'),
(7,'Cédula de Ciudadanía','1000000007'),
(8,'Cédula de Ciudadanía','1000000008'),
(9,'Cédula de Ciudadanía','1000000009'),
(10,'Cédula de Ciudadanía','1000000010'),
(11,'Cédula de Ciudadanía','1000000011'),
(12,'Cédula de Ciudadanía','1000000012'),
(13,'Cédula de Ciudadanía','1000000013'),
(14,'Cédula de Ciudadanía','1000000014'),
(15,'Cédula de Ciudadanía','1000000015'),
(16,'Cédula de Ciudadanía','1000000016'),
(17,'Cédula de Ciudadanía','1000000017'),
(18,'Cédula de Ciudadanía','1000000018'),
(19,'Cédula de Ciudadanía','1000000019'),
(20,'Cédula de Ciudadanía','1000000020');


-- ==========================================
-- TABLA USUARIO_ROLES
-- ==========================================

INSERT INTO USUARIO_ROLES (id_usuario,id_rol) VALUES
(1,1),
(2,2),
(3,3),
(4,4),
(5,5),
(6,6),
(7,7),
(8,8),
(9,2),
(10,3),
(11,4),
(12,5),
(13,6),
(14,7),
(15,8),
(16,2),
(17,3),
(18,4),
(19,5),
(20,6);

-- ==========================================
-- TABLA USUARIO_JORNADA
-- ==========================================

INSERT INTO USUARIO_JORNADA (id_usuario,id_jornada) VALUES
(1,1),
(2,2),
(3,3),
(4,1),
(5,2),
(6,3),
(7,1),
(8,2),
(9,3),
(10,1),
(11,2),
(12,3),
(13,1),
(14,2),
(15,3),
(16,1),
(17,2),
(18,3),
(19,1),
(20,2);

-- ==========================================
-- TABLA REMITENTE
-- ==========================================

INSERT INTO REMITENTE (nombre,telefono,direccion,correo) VALUES
('Juan Pérez','3001234567','Calle 10 #15-20 Bogotá','juan.perez@gmail.com'),
('María Gómez','3012345678','Carrera 20 #30-15 Medellín','maria.gomez@gmail.com'),
('Carlos Rodríguez','3023456789','Calle 45 #12-34 Cali','carlos.rodriguez@gmail.com'),
('Ana Martínez','3034567890','Carrera 18 #25-40 Barranquilla','ana.martinez@gmail.com'),
('Luis Hernández','3045678901','Calle 22 #18-55 Bucaramanga','luis.hernandez@gmail.com'),
('Sofía Ramírez','3056789012','Carrera 50 #70-20 Cartagena','sofia.ramirez@gmail.com'),
('Andrés Torres','3067890123','Calle 15 #40-80 Cúcuta','andres.torres@gmail.com'),
('Valentina Castro','3078901234','Carrera 12 #10-90 Pereira','valentina.castro@gmail.com'),
('Daniel López','3089012345','Calle 8 #25-60 Manizales','daniel.lopez@gmail.com'),
('Laura Díaz','3090123456','Carrera 35 #22-15 Ibagué','laura.diaz@gmail.com'),
('Miguel Herrera','3101234567','Calle 30 #45-12 Neiva','miguel.herrera@gmail.com'),
('Camila Moreno','3112345678','Carrera 40 #18-10 Villavicencio','camila.moreno@gmail.com'),
('Jorge Vargas','3123456789','Calle 5 #60-20 Pasto','jorge.vargas@gmail.com'),
('Paula Sánchez','3134567890','Carrera 14 #36-25 Montería','paula.sanchez@gmail.com'),
('Felipe Rojas','3145678901','Calle 55 #10-45 Armenia','felipe.rojas@gmail.com'),
('Natalia Ruiz','3156789012','Carrera 8 #12-33 Sincelejo','natalia.ruiz@gmail.com'),
('Sebastián Mejía','3167890123','Calle 16 #28-40 Tunja','sebastian.mejia@gmail.com'),
('Juliana Ortiz','3178901234','Carrera 22 #17-80 Popayán','juliana.ortiz@gmail.com'),
('David Silva','3189012345','Calle 12 #14-25 Santa Marta','david.silva@gmail.com'),
('Isabella Navarro','3190123456','Carrera 9 #30-50 Valledupar','isabella.navarro@gmail.com');

-- ==========================================
-- TABLA DESTINATARIO
-- ==========================================

INSERT INTO DESTINATARIO (nombre,telefono,direccion,correo) VALUES
('Ricardo Mendoza','3201234567','Calle 25 #11-20 Bogotá','ricardo.mendoza@gmail.com'),
('Gabriela León','3212345678','Carrera 16 #50-15 Medellín','gabriela.leon@gmail.com'),
('Fernando Cruz','3223456789','Calle 60 #30-10 Cali','fernando.cruz@gmail.com'),
('Alejandra Vega','3234567890','Carrera 7 #18-45 Barranquilla','alejandra.vega@gmail.com'),
('Óscar Pineda','3245678901','Calle 18 #12-35 Bucaramanga','oscar.pineda@gmail.com'),
('Daniela Gil','3256789012','Carrera 24 #45-70 Cartagena','daniela.gil@gmail.com'),
('Kevin Muñoz','3267890123','Calle 40 #20-10 Cúcuta','kevin.munoz@gmail.com'),
('Sara Acosta','3278901234','Carrera 13 #33-28 Pereira','sara.acosta@gmail.com'),
('Mateo Jiménez','3289012345','Calle 11 #44-60 Manizales','mateo.jimenez@gmail.com'),
('Valeria Romero','3290123456','Carrera 17 #55-14 Ibagué','valeria.romero@gmail.com'),
('Cristian Salazar','3301234567','Calle 28 #15-90 Neiva','cristian.salazar@gmail.com'),
('Tatiana Núñez','3312345678','Carrera 9 #42-50 Villavicencio','tatiana.nunez@gmail.com'),
('Mauricio Parra','3323456789','Calle 50 #25-11 Pasto','mauricio.parra@gmail.com'),
('Diana Fuentes','3334567890','Carrera 11 #60-22 Montería','diana.fuentes@gmail.com'),
('Santiago Molina','3345678901','Calle 35 #18-33 Armenia','santiago.molina@gmail.com'),
('Carolina Arias','3356789012','Carrera 19 #27-55 Sincelejo','carolina.arias@gmail.com'),
('Esteban Cárdenas','3367890123','Calle 14 #50-40 Tunja','esteban.cardenas@gmail.com'),
('Angélica Bravo','3378901234','Carrera 28 #13-60 Popayán','angelica.bravo@gmail.com'),
('Juan David Reyes','3389012345','Calle 6 #22-18 Santa Marta','juandavid.reyes@gmail.com'),
('Melissa Quintero','3390123456','Carrera 31 #15-80 Valledupar','melissa.quintero@gmail.com');



-- ==========================================
-- TABLA ENVIO
-- ==========================================

INSERT INTO ENVIO
(id_usuario,id_tipenvio,id_esenvio,id_remitente,id_destinatario,codigo_rastreo,cantidad)
VALUES
(1,1,1,1,1,'TRK0001',1),
(2,2,2,2,2,'TRK0002',2),
(3,1,3,3,3,'TRK0003',1),
(4,2,4,4,4,'TRK0004',3),
(5,1,5,5,5,'TRK0005',2),
(6,2,6,6,6,'TRK0006',1),
(7,1,7,7,7,'TRK0007',2),
(8,2,8,8,8,'TRK0008',1),
(9,1,1,9,9,'TRK0009',3),
(10,2,2,10,10,'TRK0010',2),
(11,1,3,11,11,'TRK0011',1),
(12,2,4,12,12,'TRK0012',2),
(13,1,5,13,13,'TRK0013',4),
(14,2,6,14,14,'TRK0014',1),
(15,1,7,15,15,'TRK0015',2),
(16,2,8,16,16,'TRK0016',1),
(17,1,1,17,17,'TRK0017',5),
(18,2,2,18,18,'TRK0018',3),
(19,1,3,19,19,'TRK0019',2),
(20,2,4,20,20,'TRK0020',1);

-- ==========================================
-- TABLA PAQUETE
-- ==========================================

INSERT INTO PAQUETE
(id_envio,num_guia,cod_rastreo,peso,alto,largo,ancho,descripcion)
VALUES
(1,'GUIA-2026-0001','TRK0001',2.50,20,30,15,'Documentos'),
(2,'GUIA-2026-0002','TRK0002',5.20,25,40,20,'Ropa'),
(3,'GUIA-2026-0003','TRK0003',1.80,15,20,10,'Accesorios'),
(4,'GUIA-2026-0004','TRK0004',8.00,40,50,30,'Electrodoméstico'),
(5,'GUIA-2026-0005','TRK0005',3.50,20,25,20,'Zapatos'),
(6,'GUIA-2026-0006','TRK0006',4.20,25,30,25,'Libros'),
(7,'GUIA-2026-0007','TRK0007',7.30,35,45,30,'Herramientas'),
(8,'GUIA-2026-0008','TRK0008',2.00,15,20,15,'Medicamentos'),
(9,'GUIA-2026-0009','TRK0009',6.50,30,40,25,'Juguetes'),
(10,'GUIA-2026-0010','TRK0010',1.50,10,15,10,'Cosméticos'),
(11,'GUIA-2026-0011','TRK0011',9.00,45,60,40,'Computador portátil'),
(12,'GUIA-2026-0012','TRK0012',3.20,18,28,18,'Celular'),
(13,'GUIA-2026-0013','TRK0013',12.50,50,60,50,'Repuestos'),
(14,'GUIA-2026-0014','TRK0014',2.80,20,25,18,'Medicamentos especiales'),
(15,'GUIA-2026-0015','TRK0015',5.00,25,35,22,'Artículos deportivos'),
(16,'GUIA-2026-0016','TRK0016',4.70,28,32,20,'Electrónica'),
(17,'GUIA-2026-0017','TRK0017',10.00,55,65,45,'Televisor'),
(18,'GUIA-2026-0018','TRK0018',1.20,12,18,10,'Documentos legales'),
(19,'GUIA-2026-0019','TRK0019',6.80,35,40,30,'Herramientas eléctricas'),
(20,'GUIA-2026-0020','TRK0020',2.30,18,25,16,'Perfumes');

-- ==========================================
-- TABLA ESTADO_PAQUETE
-- ==========================================

INSERT INTO ESTADO_PAQUETE
(id_paquete,id_esenvio)
VALUES
(1,1),
(2,2),
(3,3),
(4,4),
(5,5),
(6,6),
(7,7),
(8,8),
(9,1),
(10,2),
(11,3),
(12,4),
(13,5),
(14,6),
(15,7),
(16,8),
(17,1),
(18,2),
(19,3),
(20,4);



-- ==========================================
-- TABLA FACTURA
-- ==========================================

INSERT INTO FACTURA
(num_factura,subtotal,iva,total_pago,metodo_pago,id_envio)
VALUES
('FAC-0001',100000,19000,119000,'Tarjeta',1),
('FAC-0002',150000,28500,178500,'Efectivo',2),
('FAC-0003',120000,22800,142800,'Transferencia',3),
('FAC-0004',200000,38000,238000,'Tarjeta',4),
('FAC-0005',90000,17100,107100,'Nequi',5),
('FAC-0006',130000,24700,154700,'Daviplata',6),
('FAC-0007',175000,33250,208250,'Tarjeta',7),
('FAC-0008',85000,16150,101150,'Efectivo',8),
('FAC-0009',220000,41800,261800,'Transferencia',9),
('FAC-0010',95000,18050,113050,'Tarjeta',10),
('FAC-0011',300000,57000,357000,'Nequi',11),
('FAC-0012',110000,20900,130900,'Daviplata',12),
('FAC-0013',125000,23750,148750,'Tarjeta',13),
('FAC-0014',180000,34200,214200,'Efectivo',14),
('FAC-0015',145000,27550,172550,'Transferencia',15),
('FAC-0016',105000,19950,124950,'Tarjeta',16),
('FAC-0017',260000,49400,309400,'Nequi',17),
('FAC-0018',115000,21850,136850,'Daviplata',18),
('FAC-0019',240000,45600,285600,'Tarjeta',19),
('FAC-0020',135000,25650,160650,'Efectivo',20);

-- ==========================================
-- TABLA DETALLE_FACTURA
-- ==========================================

INSERT INTO DETALLE_FACTURA
(id_factura,descripcion,cantidad,valor_unitario)
VALUES
(1,'Envío estándar - Paquete pequeño',1,15000),
(2,'Seguro de envío',1,5000),
(3,'Envío express - Paquete mediano',1,35000),
(4,'Envío estándar - Paquete grande',1,25000),
(5,'Manejo especial de paquete frágil',1,8000),
(6,'Envío express de documentos',1,20000),
(7,'Envío estándar - Paquete mediano',1,18000),
(8,'Servicio de recogida a domicilio',1,6000),
(9,'Envío express - Paquete grande',1,45000),
(10,'Envío estándar - Caja pequeña',1,12000),
(11,'Envío express - Caja mediana',1,28000),
(12,'Envío estándar de documentos',1,10000),
(13,'Envío express - Paquete pequeño',1,22000),
(14,'Envío estándar - Paquete grande',1,30000),
(15,'Envío de artículos electrónicos',1,50000),
(16,'Envío estándar - Caja mediana',1,17000),
(17,'Envío express - Paquete frágil',1,40000),
(18,'Envío de documentación empresarial',1,12000),
(19,'Servicio prioritario de entrega',1,25000),
(20,'Envío express - Paquete mediano',1,32000);



Al ver los siguientes datos observamos como del mes anterior al presente aumentamos nuestros envios de 45 a 60 y que
aumentamos la covertura de 7 ciudades a 11 ciudades del pais 





