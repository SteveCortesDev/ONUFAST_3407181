
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

CREATE TABLE DOCUMENTO (
    id_documento INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo_documento VARCHAR(30) NOT NULL,
    numero_documento VARCHAR(50) NOT NULL UNIQUE,
    FOREIGN KEY (id_usuario)
    REFERENCES USUARIO(id_usuario)
);

CREATE TABLE JORNADA (
    id_jornada INT AUTO_INCREMENT PRIMARY KEY,
    tipo_jornada VARCHAR(30) NOT NULL
);

CREATE TABLE USUARIO_JORNADA (
    id_user_jornada INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_jornada INT NOT NULL,

    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    FOREIGN KEY (id_jornada) REFERENCES JORNADA(id_jornada)
);

CREATE TABLE USUARIO_ROLES (
    id_usuario_rol  INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario      INT NOT NULL,
    id_rol          INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
    FOREIGN KEY (id_rol)     REFERENCES ROL(id_rol)
);



CREATE TABLE ESTADO_PEDIDO (
    id_espedido  INT AUTO_INCREMENT PRIMARY KEY,
    estado varchar(50) NOT NULL
);


CREATE TABLE TIPO_ENVIO (
    id_tipenvio INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);


CREATE TABLE PEDIDO (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_tipenvio INT NOT NULL,
    id_espedido INT NOT NULL,
    codigo_rastreo VARCHAR(100) NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    cantidad INT DEFAULT 1 NOT NULL,
    FOREIGN KEY (id_usuario)  REFERENCES USUARIO(id_usuario),
    FOREIGN KEY (id_tipenvio) REFERENCES TIPO_ENVIO(id_tipenvio),
    FOREIGN KEY (id_espedido) REFERENCES ESTADO_PEDIDO(id_espedido)
);


CREATE TABLE PAQUETE (
    id_paquete    INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido     INT NOT NULL,
    cod_rastreo   VARCHAR(100) NOT NULL,
    peso          DECIMAL(8,2) NOT NULL,
    alto          DECIMAL(8,2) NOT NULL,
    largo         DECIMAL(8,2) NOT NULL,
    ancho         DECIMAL(8,2) NOT NULL,
    descripcion   VARCHAR(200) ,
    FOREIGN KEY (id_pedido) REFERENCES PEDIDO(id_pedido)
);


CREATE TABLE ESTADO_PAQUETE (
    id_estpaquete INT AUTO_INCREMENT PRIMARY KEY,
    id_paquete   INT NOT NULL,
    id_espedido INT NOT NULL,
    FOREIGN KEY (id_espedido) REFERENCES ESTADO_PEDIDO(id_espedido),
    FOREIGN KEY (id_paquete) REFERENCES PAQUETE(id_paquete)
);


CREATE TABLE FACTURA (
    id_factura      INT AUTO_INCREMENT PRIMARY KEY,
    num_factura     VARCHAR(50) NOT NULL,
    fecha_emision   DATETIME DEFAULT CURRENT_TIMESTAMP,
    subtotal        DECIMAL(12,2) NOT NULL,
    iva             DECIMAL(12,2) NOT NULL,
    total_pago      DECIMAL(12,2) NOT NULL,
    metodo_pago     VARCHAR(50) NOT NULL,
    id_pedido       INT NOT NULL UNIQUE,
    FOREIGN KEY (id_pedido) REFERENCES PEDIDO(id_pedido)
);


CREATE TABLE DETALLE_FACTURA (
    id_detalle      INT AUTO_INCREMENT PRIMARY KEY,
    id_factura      INT NOT NULL,
    descripcion     VARCHAR(255),
    cantidad        INT,
    valor_unitario  DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (id_factura) REFERENCES FACTURA(id_factura)
);




-- TABLA ROL
INSERT INTO ROL (nombre_rol) VALUES
('Administrador'),
('Cliente'),
('Conductor'),
('Conductor auxiliar'),
('Encargado de Bodega'),
('Despachador'),
('Coordinador de Transporte'),
('Atención al Cliente');


-- TABLA JORNADA
INSERT INTO JORNADA (tipo_jornada) VALUES 
("Mañana"),
("Tarde"),
("Noche");




-- TABLA ESTADO_PEDIDO
INSERT INTO ESTADO_PEDIDO (estado) VALUES
('Pendiente'),
('Confirmado'),
('En preparación'),
('Despachado'),
('En tránsito'),
('Entregado'),
('Cancelado'),
('Devuelto');


-- TABLA TIPO_ENVIO
INSERT INTO TIPO_ENVIO (descripcion) VALUES
('Estándar'),
('Express');



-- TABLA USUARIO
INSERT INTO USUARIO
(nombre, apellido, clave, correo, telefono, direccion)
VALUES
('Juan','Pérez','1234','juan1@gmail.com','3001111111','Calle 1'),
('Ana','Gómez','1234','ana2@gmail.com','3001111112','Calle 2'),
('Luis','Martínez','1234','luis3@gmail.com','3001111113','Calle 3'),
('María','Rodríguez','1234','maria4@gmail.com','3001111114','Calle 4'),
('Carlos','López','1234','carlos5@gmail.com','3001111115','Calle 5'),
('Laura','Torres','1234','laura6@gmail.com','3001111116','Calle 6'),
('Andrés','Ramírez','1234','andres7@gmail.com','3001111117','Calle 7'),
('Diana','Castro','1234','diana8@gmail.com','3001111118','Calle 8'),
('Miguel','Herrera','1234','miguel9@gmail.com','3001111119','Calle 9'),
('Paula','Vargas','1234','paula10@gmail.com','3001111120','Calle 10'),
('Camilo','Suárez','1234','camilo11@gmail.com','3001111121','Calle 11'),
('Valentina','Moreno','1234','vale12@gmail.com','3001111122','Calle 12'),
('Jorge','Rojas','1234','jorge13@gmail.com','3001111123','Calle 13'),
('Natalia','Ortiz','1234','nata14@gmail.com','3001111124','Calle 14'),
('Santiago','Mendoza','1234','santi15@gmail.com','3001111125','Calle 15'),
('Daniela','Reyes','1234','dani16@gmail.com','3001111126','Calle 16'),
('Felipe','Silva','1234','feli17@gmail.com','3001111127','Calle 17'),
('Karen','Jiménez','1234','karen18@gmail.com','3001111128','Calle 18'),
('David','Pineda','1234','david19@gmail.com','3001111129','Calle 19'),
('Sara','Cruz','1234','sara20@gmail.com','3001111130','Calle 20');


-- TABLA DOCUMENTO
INSERT INTO DOCUMENTO (id_usuario, tipo_documento, numero_documento) VALUES
(1, 'Cédula de Ciudadanía', '1234567890'),
(2, 'Cédula de Ciudadanía', '2345678901'),
(3, 'Cédula de Extranjería', '3456789012'),
(4, 'Cédula de Ciudadanía', '4567890123'),
(5, 'Pasaporte', 'AB123456'),
(6, 'Cédula de Ciudadanía', '5678901234'),
(7, 'NIT', '9012345678'),
(8, 'Cédula de Extranjería', '6789012345'),
(9, 'Pasaporte', 'CD789012'),
(10, 'Cédula de Ciudadanía', '7890123456');



-- TABLA USUARIO_ROLES
INSERT INTO USUARIO_ROLES
(id_usuario,id_rol)
VALUES
(1,1),
(2,2),
(3,2),
(4,3),
(5,4),
(6,5),
(7,6),
(8,7),
(9,8),
(10,2),
(11,2),
(12,3),
(13,4),
(14,5),
(15,6),
(16,7),
(17,8),
(18,2),
(19,3),
(20,2);

-- TABLA USUARIO_JORNADA
INSERT INTO USUARIO_JORNADA
(id_usuario,id_jornada)
VALUES
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


-- TABLA PEDIDO
INSERT INTO PEDIDO (id_usuario, id_tipenvio, id_espedido, codigo_rastreo, cantidad)
VALUES
(1,1,1,'TRK0001',1),
(2,2,2,'TRK0002',2),
(3,1,3,'TRK0003',1),
(4,2,4,'TRK0004',3),
(5,1,5,'TRK0005',2),
(6,1,6,'TRK0006',1),
(7,2,1,'TRK0007',4),
(8,1,2,'TRK0008',1),
(9,2,3,'TRK0009',2),
(10,2,4,'TRK0010',1),
(11,2,5,'TRK0011',3),
(12,2,6,'TRK0012',2),
(13,1,1,'TRK0013',1),
(14,2,2,'TRK0014',5),
(15,1,3,'TRK0015',2),
(16,1,4,'TRK0016',1),
(17,2,5,'TRK0017',3),
(18,1,6,'TRK0018',2),
(19,1,1,'TRK0019',1),
(20,1,2,'TRK0020',4);


-- TABLA PAQUETE
INSERT INTO PAQUETE
(id_pedido, cod_rastreo, peso, alto, largo, ancho, descripcion)
VALUES
(1,'TRK0001',2.50,20,30,15,'Documentos'),
(2,'TRK0002',5.20,25,40,20,'Ropa'),
(3,'TRK0003',1.80,15,20,10,'Accesorios'),
(4,'TRK0004',8.00,40,50,30,'Electrodoméstico'),
(5,'TRK0005',3.50,20,25,20,'Zapatos'),
(6,'TRK0006',4.20,25,30,25,'Libros'),
(7,'TRK0007',7.30,35,45,30,'Herramientas'),
(8,'TRK0008',2.00,15,20,15,'Medicamentos'),
(9,'TRK0009',6.50,30,40,25,'Juguetes'),
(10,'TRK0010',1.50,10,15,10,'Cosméticos'),
(11,'TRK0011',9.00,45,60,35,'Computador'),
(12,'TRK0012',3.80,20,30,20,'Papelería'),
(13,'TRK0013',2.40,18,25,15,'Repuestos'),
(14,'TRK0014',5.90,28,38,22,'Artículos deportivos'),
(15,'TRK0015',4.70,24,34,18,'Utensilios'),
(16,'TRK0016',1.90,14,20,12,'Regalos'),
(17,'TRK0017',8.60,40,55,30,'Monitor'),
(18,'TRK0018',2.80,16,24,16,'Audífonos'),
(19,'TRK0019',6.10,32,42,26,'Impresora'),
(20,'TRK0020',3.20,20,28,18,'Artículos varios');


-- TABLA ESTADO_PAQUETE
INSERT INTO ESTADO_PAQUETE
(id_paquete, id_espedido)
VALUES
(1,1),
(2,2),
(3,3),
(4,4),
(5,5),
(6,6),
(7,1),
(8,2),
(9,3),
(10,4),
(11,5),
(12,6),
(13,1),
(14,2),
(15,3),
(16,4),
(17,5),
(18,6),
(19,1),
(20,8);


-- TABLA FACTURA
INSERT INTO FACTURA (num_factura, subtotal, iva, total_pago, metodo_pago, id_pedido)
VALUES
('FAC0001',100000,19000,119000,'Tarjeta',1),
('FAC0002',150000,28500,178500,'Efectivo',2),
('FAC0003',120000,22800,142800,'Transferencia',3),
('FAC0004',200000,38000,238000,'Tarjeta',4),
('FAC0005',90000,17100,107100,'Nequi',5),
('FAC0006',130000,24700,154700,'Daviplata',6),
('FAC0007',175000,33250,208250,'Tarjeta',7),
('FAC0008',85000,16150,101150,'Efectivo',8),
('FAC0009',220000,41800,261800,'Transferencia',9),
('FAC0010',95000,18050,113050,'Tarjeta',10),
('FAC0011',300000,57000,357000,'Nequi',11),
('FAC0012',110000,20900,130900,'Daviplata',12),
('FAC0013',125000,23750,148750,'Tarjeta',13),
('FAC0014',180000,34200,214200,'Efectivo',14),
('FAC0015',145000,27550,172550,'Transferencia',15),
('FAC0016',105000,19950,124950,'Tarjeta',16),
('FAC0017',260000,49400,309400,'Nequi',17),
('FAC0018',115000,21850,136850,'Daviplata',18),
('FAC0019',240000,45600,285600,'Tarjeta',19),
('FAC0020',135000,25650,160650,'Efectivo',20);


-- TABLA DETALLE_FACTURA
INSERT INTO DETALLE_FACTURA (id_factura, descripcion, cantidad, valor_unitario) VALUES
(1,'Envío estándar - Paquete pequeño', 1, 15000.00),
(2, 'Seguro de envío', 1, 5000.00),
(3, 'Envío express - Paquete mediano', 1, 35000.00),
( 4,'Envío estándar - Paquete grande', 1, 25000.00),
(5, 'Manejo especial (frágil)', 1, 8000.00),
(6, 'Envío express - Documentos', 1, 20000.00),
(7, 'Envío estándar - Paquete mediano', 1, 18000.00),
(8, 'Recogida en domicilio', 1, 6000.00),
(9, 'Envío express - Paquete grande', 1, 45000.00),
(10, 'Envío estándar - Caja pequeña', 1, 12000.00),

(11,'Envío express - Caja mediana', 1, 28000.00),
(12, 'Envío estándar - Documentos', 1, 10000.00),
(13, 'Envío express - Paquete pequeño', 1, 22000.00),
(14, 'Envío estándar - Paquete grande', 1, 30000.00),
(15, 'Envío express - Artículos electrónicos', 1, 50000.00),
(16, 'Envío estándar - Caja mediana', 1, 17000.00),
(17, 'Envío express - Paquete frágil', 1, 40000.00),
(18, 'Envío estándar - Documentación empresarial', 1, 12000.00),
(19, 'Recogida y entrega prioritaria', 1, 25000.00),
(20, 'Envío express - Paquete mediano', 1, 32000.00);








SELECT * FROM ROL;
SELECT * FROM USUARIO;
SELECT * FROM USUARIO_ROLES;
SELECT * FROM PEDIDO;
SELECT * FROM PAQUETE;
SELECT * FROM FACTURA;
SELECT * FROM DETALLE_FACTURA;
SELECT * FROM JORNADA;
SELECT * FROM USUARIO_JORNADA;
SELECT * FROM ESTADO_PAQUETE;
SELECT * FROM ESTADO_PEDIDO;






