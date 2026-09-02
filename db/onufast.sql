-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-06-2026 a las 22:39:22
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `onufast`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_factura`
--

CREATE TABLE `detalle_factura` (
  `id_detalle` int(11) NOT NULL,
  `id_factura` int(11) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `valor_unitario` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_factura`
--

INSERT INTO `detalle_factura` (`id_detalle`, `id_factura`, `descripcion`, `cantidad`, `valor_unitario`) VALUES
(1, 1, 'Envío estándar - Paquete pequeño', 1, 15000.00),
(2, 2, 'Seguro de envío', 1, 5000.00),
(3, 3, 'Envío express - Paquete mediano', 1, 35000.00),
(4, 4, 'Envío estándar - Paquete grande', 1, 25000.00),
(5, 5, 'Manejo especial (frágil)', 1, 8000.00),
(6, 6, 'Envío express - Documentos', 1, 20000.00),
(7, 7, 'Envío estándar - Paquete mediano', 1, 18000.00),
(8, 8, 'Recogida en domicilio', 1, 6000.00),
(9, 9, 'Envío express - Paquete grande', 1, 45000.00),
(10, 10, 'Envío estándar - Caja pequeña', 1, 12000.00),
(11, 11, 'Envío express - Caja mediana', 1, 28000.00),
(12, 12, 'Envío estándar - Documentos', 1, 10000.00),
(13, 13, 'Envío express - Paquete pequeño', 1, 22000.00),
(14, 14, 'Envío estándar - Paquete grande', 1, 30000.00),
(15, 15, 'Envío express - Artículos electrónicos', 1, 50000.00),
(16, 16, 'Envío estándar - Caja mediana', 1, 17000.00),
(17, 17, 'Envío express - Paquete frágil', 1, 40000.00),
(18, 18, 'Envío estándar - Documentación empresarial', 1, 12000.00),
(19, 19, 'Recogida y entrega prioritaria', 1, 25000.00),
(20, 20, 'Envío express - Paquete mediano', 1, 32000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documento`
--

CREATE TABLE `documento` (
  `id_documento` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo_documento` varchar(30) NOT NULL,
  `numero_documento` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `documento`
--

INSERT INTO `documento` (`id_documento`, `id_usuario`, `tipo_documento`, `numero_documento`) VALUES
(1, 1, 'Cédula de Ciudadanía', '1234567890'),
(2, 2, 'Cédula de Ciudadanía', '2345678901'),
(3, 3, 'Cédula de Extranjería', '3456789012'),
(4, 4, 'Cédula de Ciudadanía', '4567890123'),
(5, 5, 'Pasaporte', 'AB123456'),
(6, 6, 'Cédula de Ciudadanía', '5678901234'),
(7, 7, 'NIT', '9012345678'),
(8, 8, 'Cédula de Extranjería', '6789012345'),
(9, 9, 'Pasaporte', 'CD789012'),
(10, 10, 'Cédula de Ciudadanía', '7890123456');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_paquete`
--

CREATE TABLE `estado_paquete` (
  `id_estpaquete` int(11) NOT NULL,
  `id_paquete` int(11) NOT NULL,
  `id_espedido` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_paquete`
--

INSERT INTO `estado_paquete` (`id_estpaquete`, `id_paquete`, `id_espedido`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5),
(6, 6, 6),
(7, 7, 1),
(8, 8, 2),
(9, 9, 3),
(10, 10, 4),
(11, 11, 5),
(12, 12, 6),
(13, 13, 1),
(14, 14, 2),
(15, 15, 3),
(16, 16, 4),
(17, 17, 5),
(18, 18, 6),
(19, 19, 1),
(20, 20, 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_pedido`
--

CREATE TABLE `estado_pedido` (
  `id_espedido` int(11) NOT NULL,
  `estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_pedido`
--

INSERT INTO `estado_pedido` (`id_espedido`, `estado`) VALUES
(1, 'Pendiente'),
(2, 'Confirmado'),
(3, 'En preparación'),
(4, 'Despachado'),
(5, 'En tránsito'),
(6, 'Entregado'),
(7, 'Cancelado'),
(8, 'Devuelto');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura`
--

CREATE TABLE `factura` (
  `id_factura` int(11) NOT NULL,
  `num_factura` varchar(50) NOT NULL,
  `fecha_emision` datetime DEFAULT current_timestamp(),
  `subtotal` decimal(12,2) NOT NULL,
  `iva` decimal(12,2) NOT NULL,
  `total_pago` decimal(12,2) NOT NULL,
  `metodo_pago` varchar(50) NOT NULL,
  `id_pedido` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `factura`
--

INSERT INTO `factura` (`id_factura`, `num_factura`, `fecha_emision`, `subtotal`, `iva`, `total_pago`, `metodo_pago`, `id_pedido`) VALUES
(1, 'FAC0001', '2026-06-17 13:31:18', 100000.00, 19000.00, 119000.00, 'Tarjeta', 1),
(2, 'FAC0002', '2026-06-17 13:31:18', 150000.00, 28500.00, 178500.00, 'Efectivo', 2),
(3, 'FAC0003', '2026-06-17 13:31:18', 120000.00, 22800.00, 142800.00, 'Transferencia', 3),
(4, 'FAC0004', '2026-06-17 13:31:18', 200000.00, 38000.00, 238000.00, 'Tarjeta', 4),
(5, 'FAC0005', '2026-06-17 13:31:18', 90000.00, 17100.00, 107100.00, 'Nequi', 5),
(6, 'FAC0006', '2026-06-17 13:31:18', 130000.00, 24700.00, 154700.00, 'Daviplata', 6),
(7, 'FAC0007', '2026-06-17 13:31:18', 175000.00, 33250.00, 208250.00, 'Tarjeta', 7),
(8, 'FAC0008', '2026-06-17 13:31:18', 85000.00, 16150.00, 101150.00, 'Efectivo', 8),
(9, 'FAC0009', '2026-06-17 13:31:18', 220000.00, 41800.00, 261800.00, 'Transferencia', 9),
(10, 'FAC0010', '2026-06-17 13:31:18', 95000.00, 18050.00, 113050.00, 'Tarjeta', 10),
(11, 'FAC0011', '2026-06-17 13:31:18', 300000.00, 57000.00, 357000.00, 'Nequi', 11),
(12, 'FAC0012', '2026-06-17 13:31:18', 110000.00, 20900.00, 130900.00, 'Daviplata', 12),
(13, 'FAC0013', '2026-06-17 13:31:18', 125000.00, 23750.00, 148750.00, 'Tarjeta', 13),
(14, 'FAC0014', '2026-06-17 13:31:18', 180000.00, 34200.00, 214200.00, 'Efectivo', 14),
(15, 'FAC0015', '2026-06-17 13:31:18', 145000.00, 27550.00, 172550.00, 'Transferencia', 15),
(16, 'FAC0016', '2026-06-17 13:31:18', 105000.00, 19950.00, 124950.00, 'Tarjeta', 16),
(17, 'FAC0017', '2026-06-17 13:31:18', 260000.00, 49400.00, 309400.00, 'Nequi', 17),
(18, 'FAC0018', '2026-06-17 13:31:18', 115000.00, 21850.00, 136850.00, 'Daviplata', 18),
(19, 'FAC0019', '2026-06-17 13:31:18', 240000.00, 45600.00, 285600.00, 'Tarjeta', 19),
(20, 'FAC0020', '2026-06-17 13:31:18', 135000.00, 25650.00, 160650.00, 'Efectivo', 20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jornada`
--

CREATE TABLE `jornada` (
  `id_jornada` int(11) NOT NULL,
  `tipo_jornada` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `jornada`
--

INSERT INTO `jornada` (`id_jornada`, `tipo_jornada`) VALUES
(1, 'Mañana'),
(2, 'Tarde'),
(3, 'Noche');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paquete`
--

CREATE TABLE `paquete` (
  `id_paquete` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `cod_rastreo` varchar(100) NOT NULL,
  `peso` decimal(8,2) NOT NULL,
  `alto` decimal(8,2) NOT NULL,
  `largo` decimal(8,2) NOT NULL,
  `ancho` decimal(8,2) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `paquete`
--

INSERT INTO `paquete` (`id_paquete`, `id_pedido`, `cod_rastreo`, `peso`, `alto`, `largo`, `ancho`, `descripcion`) VALUES
(1, 1, 'TRK0001', 2.50, 20.00, 30.00, 15.00, 'Documentos'),
(2, 2, 'TRK0002', 5.20, 25.00, 40.00, 20.00, 'Ropa'),
(3, 3, 'TRK0003', 1.80, 15.00, 20.00, 10.00, 'Accesorios'),
(4, 4, 'TRK0004', 8.00, 40.00, 50.00, 30.00, 'Electrodoméstico'),
(5, 5, 'TRK0005', 3.50, 20.00, 25.00, 20.00, 'Zapatos'),
(6, 6, 'TRK0006', 4.20, 25.00, 30.00, 25.00, 'Libros'),
(7, 7, 'TRK0007', 7.30, 35.00, 45.00, 30.00, 'Herramientas'),
(8, 8, 'TRK0008', 2.00, 15.00, 20.00, 15.00, 'Medicamentos'),
(9, 9, 'TRK0009', 6.50, 30.00, 40.00, 25.00, 'Juguetes'),
(10, 10, 'TRK0010', 1.50, 10.00, 15.00, 10.00, 'Cosméticos'),
(11, 11, 'TRK0011', 9.00, 45.00, 60.00, 35.00, 'Computador'),
(12, 12, 'TRK0012', 3.80, 20.00, 30.00, 20.00, 'Papelería'),
(13, 13, 'TRK0013', 2.40, 18.00, 25.00, 15.00, 'Repuestos'),
(14, 14, 'TRK0014', 5.90, 28.00, 38.00, 22.00, 'Artículos deportivos'),
(15, 15, 'TRK0015', 4.70, 24.00, 34.00, 18.00, 'Utensilios'),
(16, 16, 'TRK0016', 1.90, 14.00, 20.00, 12.00, 'Regalos'),
(17, 17, 'TRK0017', 8.60, 40.00, 55.00, 30.00, 'Monitor'),
(18, 18, 'TRK0018', 2.80, 16.00, 24.00, 16.00, 'Audífonos'),
(19, 19, 'TRK0019', 6.10, 32.00, 42.00, 26.00, 'Impresora'),
(20, 20, 'TRK0020', 3.20, 20.00, 28.00, 18.00, 'Artículos varios');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `id_pedido` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_tipenvio` int(11) NOT NULL,
  `id_espedido` int(11) NOT NULL,
  `codigo_rastreo` varchar(100) NOT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `cantidad` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`id_pedido`, `id_usuario`, `id_tipenvio`, `id_espedido`, `codigo_rastreo`, `fecha_creacion`, `cantidad`) VALUES
(1, 1, 1, 1, 'TRK0001', '2026-06-17 13:31:18', 1),
(2, 2, 2, 2, 'TRK0002', '2026-06-17 13:31:18', 2),
(3, 3, 1, 3, 'TRK0003', '2026-06-17 13:31:18', 1),
(4, 4, 2, 4, 'TRK0004', '2026-06-17 13:31:18', 3),
(5, 5, 1, 5, 'TRK0005', '2026-06-17 13:31:18', 2),
(6, 6, 1, 6, 'TRK0006', '2026-06-17 13:31:18', 1),
(7, 7, 2, 1, 'TRK0007', '2026-06-17 13:31:18', 4),
(8, 8, 1, 2, 'TRK0008', '2026-06-17 13:31:18', 1),
(9, 9, 2, 3, 'TRK0009', '2026-06-17 13:31:18', 2),
(10, 10, 2, 4, 'TRK0010', '2026-06-17 13:31:18', 1),
(11, 11, 2, 5, 'TRK0011', '2026-06-17 13:31:18', 3),
(12, 12, 2, 6, 'TRK0012', '2026-06-17 13:31:18', 2),
(13, 13, 1, 1, 'TRK0013', '2026-06-17 13:31:18', 1),
(14, 14, 2, 2, 'TRK0014', '2026-06-17 13:31:18', 5),
(15, 15, 1, 3, 'TRK0015', '2026-06-17 13:31:18', 2),
(16, 16, 1, 4, 'TRK0016', '2026-06-17 13:31:18', 1),
(17, 17, 2, 5, 'TRK0017', '2026-06-17 13:31:18', 3),
(18, 18, 1, 6, 'TRK0018', '2026-06-17 13:31:18', 2),
(19, 19, 1, 1, 'TRK0019', '2026-06-17 13:31:18', 1),
(20, 20, 1, 2, 'TRK0020', '2026-06-17 13:31:18', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL,
  `nombre_rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id_rol`, `nombre_rol`) VALUES
(1, 'Administrador'),
(2, 'Cliente'),
(3, 'Conductor'),
(4, 'Conductor auxiliar'),
(5, 'Encargado de Bodega'),
(6, 'Despachador'),
(7, 'Coordinador de Transporte'),
(8, 'Atención al Cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_envio`
--

CREATE TABLE `tipo_envio` (
  `id_tipenvio` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_envio`
--

INSERT INTO `tipo_envio` (`id_tipenvio`, `descripcion`) VALUES
(1, 'Estándar'),
(2, 'Express');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `clave` varchar(20) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `direccion` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellido`, `clave`, `correo`, `telefono`, `direccion`) VALUES
(1, 'Juan', 'Pérez', '1234', 'juan1@gmail.com', '3001111111', 'Calle 1'),
(2, 'Ana', 'Gómez', '1234', 'ana2@gmail.com', '3001111112', 'Calle 2'),
(3, 'Luis', 'Martínez', '1234', 'luis3@gmail.com', '3001111113', 'Calle 3'),
(4, 'María', 'Rodríguez', '1234', 'maria4@gmail.com', '3001111114', 'Calle 4'),
(5, 'Carlos', 'López', '1234', 'carlos5@gmail.com', '3001111115', 'Calle 5'),
(6, 'Laura', 'Torres', '1234', 'laura6@gmail.com', '3001111116', 'Calle 6'),
(7, 'Andrés', 'Ramírez', '1234', 'andres7@gmail.com', '3001111117', 'Calle 7'),
(8, 'Diana', 'Castro', '1234', 'diana8@gmail.com', '3001111118', 'Calle 8'),
(9, 'Miguel', 'Herrera', '1234', 'miguel9@gmail.com', '3001111119', 'Calle 9'),
(10, 'Paula', 'Vargas', '1234', 'paula10@gmail.com', '3001111120', 'Calle 10'),
(11, 'Camilo', 'Suárez', '1234', 'camilo11@gmail.com', '3001111121', 'Calle 11'),
(12, 'Valentina', 'Moreno', '1234', 'vale12@gmail.com', '3001111122', 'Calle 12'),
(13, 'Jorge', 'Rojas', '1234', 'jorge13@gmail.com', '3001111123', 'Calle 13'),
(14, 'Natalia', 'Ortiz', '1234', 'nata14@gmail.com', '3001111124', 'Calle 14'),
(15, 'Santiago', 'Mendoza', '1234', 'santi15@gmail.com', '3001111125', 'Calle 15'),
(16, 'Daniela', 'Reyes', '1234', 'dani16@gmail.com', '3001111126', 'Calle 16'),
(17, 'Felipe', 'Silva', '1234', 'feli17@gmail.com', '3001111127', 'Calle 17'),
(18, 'Karen', 'Jiménez', '1234', 'karen18@gmail.com', '3001111128', 'Calle 18'),
(19, 'David', 'Pineda', '1234', 'david19@gmail.com', '3001111129', 'Calle 19'),
(20, 'Sara', 'Cruz', '1234', 'sara20@gmail.com', '3001111130', 'Calle 20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_jornada`
--

CREATE TABLE `usuario_jornada` (
  `id_user_jornada` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_jornada` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario_jornada`
--

INSERT INTO `usuario_jornada` (`id_user_jornada`, `id_usuario`, `id_jornada`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 1),
(5, 5, 2),
(6, 6, 3),
(7, 7, 1),
(8, 8, 2),
(9, 9, 3),
(10, 10, 1),
(11, 11, 2),
(12, 12, 3),
(13, 13, 1),
(14, 14, 2),
(15, 15, 3),
(16, 16, 1),
(17, 17, 2),
(18, 18, 3),
(19, 19, 1),
(20, 20, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_roles`
--

CREATE TABLE `usuario_roles` (
  `id_usuario_rol` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario_roles`
--

INSERT INTO `usuario_roles` (`id_usuario_rol`, `id_usuario`, `id_rol`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 2),
(4, 4, 3),
(5, 5, 4),
(6, 6, 5),
(7, 7, 6),
(8, 8, 7),
(9, 9, 8),
(10, 10, 2),
(11, 11, 2),
(12, 12, 3),
(13, 13, 4),
(14, 14, 5),
(15, 15, 6),
(16, 16, 7),
(17, 17, 8),
(18, 18, 2),
(19, 19, 3),
(20, 20, 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalle_factura`
--
ALTER TABLE `detalle_factura`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_factura` (`id_factura`);

--
-- Indices de la tabla `documento`
--
ALTER TABLE `documento`
  ADD PRIMARY KEY (`id_documento`),
  ADD UNIQUE KEY `numero_documento` (`numero_documento`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `estado_paquete`
--
ALTER TABLE `estado_paquete`
  ADD PRIMARY KEY (`id_estpaquete`),
  ADD KEY `id_espedido` (`id_espedido`),
  ADD KEY `id_paquete` (`id_paquete`);

--
-- Indices de la tabla `estado_pedido`
--
ALTER TABLE `estado_pedido`
  ADD PRIMARY KEY (`id_espedido`);

--
-- Indices de la tabla `factura`
--
ALTER TABLE `factura`
  ADD PRIMARY KEY (`id_factura`),
  ADD UNIQUE KEY `id_pedido` (`id_pedido`);

--
-- Indices de la tabla `jornada`
--
ALTER TABLE `jornada`
  ADD PRIMARY KEY (`id_jornada`);

--
-- Indices de la tabla `paquete`
--
ALTER TABLE `paquete`
  ADD PRIMARY KEY (`id_paquete`),
  ADD KEY `id_pedido` (`id_pedido`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_tipenvio` (`id_tipenvio`),
  ADD KEY `id_espedido` (`id_espedido`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `tipo_envio`
--
ALTER TABLE `tipo_envio`
  ADD PRIMARY KEY (`id_tipenvio`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `usuario_jornada`
--
ALTER TABLE `usuario_jornada`
  ADD PRIMARY KEY (`id_user_jornada`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_jornada` (`id_jornada`);

--
-- Indices de la tabla `usuario_roles`
--
ALTER TABLE `usuario_roles`
  ADD PRIMARY KEY (`id_usuario_rol`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `detalle_factura`
--
ALTER TABLE `detalle_factura`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `documento`
--
ALTER TABLE `documento`
  MODIFY `id_documento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `estado_paquete`
--
ALTER TABLE `estado_paquete`
  MODIFY `id_estpaquete` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `estado_pedido`
--
ALTER TABLE `estado_pedido`
  MODIFY `id_espedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `factura`
--
ALTER TABLE `factura`
  MODIFY `id_factura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `jornada`
--
ALTER TABLE `jornada`
  MODIFY `id_jornada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `paquete`
--
ALTER TABLE `paquete`
  MODIFY `id_paquete` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `tipo_envio`
--
ALTER TABLE `tipo_envio`
  MODIFY `id_tipenvio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `usuario_jornada`
--
ALTER TABLE `usuario_jornada`
  MODIFY `id_user_jornada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `usuario_roles`
--
ALTER TABLE `usuario_roles`
  MODIFY `id_usuario_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_factura`
--
ALTER TABLE `detalle_factura`
  ADD CONSTRAINT `detalle_factura_ibfk_1` FOREIGN KEY (`id_factura`) REFERENCES `factura` (`id_factura`);

--
-- Filtros para la tabla `documento`
--
ALTER TABLE `documento`
  ADD CONSTRAINT `documento_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `estado_paquete`
--
ALTER TABLE `estado_paquete`
  ADD CONSTRAINT `estado_paquete_ibfk_1` FOREIGN KEY (`id_espedido`) REFERENCES `estado_pedido` (`id_espedido`),
  ADD CONSTRAINT `estado_paquete_ibfk_2` FOREIGN KEY (`id_paquete`) REFERENCES `paquete` (`id_paquete`);

--
-- Filtros para la tabla `factura`
--
ALTER TABLE `factura`
  ADD CONSTRAINT `factura_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`);

--
-- Filtros para la tabla `paquete`
--
ALTER TABLE `paquete`
  ADD CONSTRAINT `paquete_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`);

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `pedido_ibfk_2` FOREIGN KEY (`id_tipenvio`) REFERENCES `tipo_envio` (`id_tipenvio`),
  ADD CONSTRAINT `pedido_ibfk_3` FOREIGN KEY (`id_espedido`) REFERENCES `estado_pedido` (`id_espedido`);

--
-- Filtros para la tabla `usuario_jornada`
--
ALTER TABLE `usuario_jornada`
  ADD CONSTRAINT `usuario_jornada_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `usuario_jornada_ibfk_2` FOREIGN KEY (`id_jornada`) REFERENCES `jornada` (`id_jornada`);

--
-- Filtros para la tabla `usuario_roles`
--
ALTER TABLE `usuario_roles`
  ADD CONSTRAINT `usuario_roles_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `usuario_roles_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
