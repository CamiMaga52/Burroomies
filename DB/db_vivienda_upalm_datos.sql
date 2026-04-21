-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dbBurroomies
-- ------------------------------------------------------
-- Server version	8.0.44

USE dbBurroomies;

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

-- -----------------------------------------------------
-- 1. DATOS DE CATÁLOGOS
-- -----------------------------------------------------

-- Insertar unidades académicas de nivel superior del IPN
INSERT INTO `unidad_academica` (`unidadAcademicaNombre`, `unidadAcademicaClave`) VALUES
('Escuela Superior de Cómputo', 'ESCOM'),
('Escuela Superior de Ingeniería Mecánica y Eléctrica', 'ESIME'),
('Unidad Profesional Interdisciplinaria de Ingeniería y Ciencias Sociales y Administrativas', 'UPIICSA'),
('Unidad Profesional Interdisciplinaria de Biotecnología', 'UPIBI'),
('Escuela Superior de Turismo', 'EST'),
('Escuela Superior de Comercio y Administración', 'ESCA'),
('Escuela Superior de Economía', 'ESE'),
('Escuela Superior de Ingeniería Química e Industrias Extractivas', 'ESIQIE'),
('Escuela Superior de Medicina', 'ESM'),
('Escuela Superior de Enfermería y Obstetricia', 'ESEO'),
('Escuela Superior de Física y Matemáticas', 'ESFM');

INSERT INTO `carrera` (`carreraNombre`, `carreraClave`, `idUnidadAcademica`) VALUES
('Ingeniería en Sistemas Computacionales', 'ISC', 1),
('Ingeniería en Inteligencia Artificial', 'IIA', 1),
('Licenciatura en Ciencia de Datos', 'LCD', 1),
('Ingeniería en Comunicaciones y Electrónica', 'ICE', 2),
('Ingeniería en Control y Automatización', 'ICA', 2),
('Ingeniería en Computación', 'ICO', 2),
('Ingeniería Eléctrica', 'IE', 2),
('Ingeniería Mecánica', 'IM', 2),
('Ingeniería Robótica Industrial', 'IRI', 2),
('Ingeniería en Transporte', 'IT', 3),
('Ingeniería en Informática', 'II', 3),
('Ingeniería Industrial', 'IInd', 3),
('Licenciatura en Administración Industrial', 'LAI', 3),
('Licenciatura en Contaduría Pública', 'LCP', 3),
('Ingeniería Biotecnológica', 'IBT', 4),
('Ingeniería en Sistemas Biológicos', 'ISB', 4),
('Ingeniería en Alimentos', 'IA', 4),
('Ingeniería Biomédica', 'IBM', 4),
('Licenciatura en Turismo', 'LT', 5),
('Licenciatura en Administración Turística', 'LAT', 5),
('Licenciatura en Administración', 'LA', 6),
('Licenciatura en Contaduría y Finanzas Públicas', 'LCFP', 6),
('Licenciatura en Negocios Internacionales', 'LNI', 6),
('Licenciatura en Informática Administrativa', 'LIA', 6),
('Licenciatura en Administración y Desarrollo Empresarial', 'LADE', 6),
('Licenciatura en Relaciones Comerciales', 'LRC', 6),
('Licenciatura en Economía', 'LE', 7),
('Ingeniería Química', 'IQ', 8),
('Ingeniería Química Industrial', 'IQI', 8),
('Ingeniería en Metalurgia y Materiales', 'IMM', 8),
('Ingeniería Química Petrolera', 'IQP', 8),
('Médico Cirujano y Partero', 'MCP', 9),
('Licenciatura en Enfermería', 'LEF', 10),
('Licenciatura en Enfermería y Obstetricia', 'LEO', 10),
('Ingeniería en Física Aplicada', 'IFA', 11),
('Ingeniería en Matemáticas Aplicadas', 'IMA', 11),
('Licenciatura en Física y Matemáticas', 'LFM', 11);


-- Insertar servicios disponibles (estilo Airbnb)
INSERT INTO `servicio` (`servicioNombre`, `servicioCategoria`) VALUES
('Agua potable', 'Basico'),
('Electricidad', 'Basico'),
('Gas natural', 'Basico'),
('Wi-Fi', 'Basico'),
('Calefacción', 'Basico'),
('Aire acondicionado', 'Basico'),
('Cocina individual', 'Basico'),
('Cocina compartida', 'Basico'),
('Refrigerador', 'Basico'),
('Microondas', 'Basico'),
('Cafetera', 'Basico'),
('Utensilios de cocina', 'Basico'),
('Vajilla y cubiertos', 'Basico'),
('Televisión', 'Entretenimiento'),
('Televisión por cable', 'Entretenimiento'),
('Servicios de streaming', 'Entretenimiento'),
('Estacionamiento', 'Adicional'),
('Lavadora', 'Adicional'),
('Secadora', 'Adicional'),
('Lavandería en el edificio', 'Adicional'),
('Escritorio o espacio de trabajo', 'Adicional'),
('Balcón', 'Adicional'),
('Patio', 'Adicional'),
('Terraza', 'Adicional'),
('Jardín o áreas verdes', 'Adicional'),
('Gimnasio', 'Adicional'),
('Lavavajillas', 'Adicional'),
('Lavandería cercana', 'Adicional'),
('Se permiten mascotas', 'Adicional'),
('Acceso para silla de ruedas', 'Adicional'),
('Ascensor', 'Adicional'),
('Servicio de limpieza incluido', 'Adicional'),
('Cámaras de seguridad', 'Adicional'),
('Alarma contra incendios', 'Adicional'),
('Alarma anti-robo', 'Adicional'),
('Vigilancia 24/7', 'Adicional'),
('Control de acceso', 'Adicional');

-- -----------------------------------------------------
-- 2. DATOS DE LAS DEMAS TABLAS
-- -----------------------------------------------------

-- =====================================================
-- 2. TABLA direccion (10 direcciones con CP_idCP)
-- =====================================================
INSERT INTO `direccion` (`direccionCalle`, `direccionNumExt`, `direccionNumInt`, `CP_idCP`) VALUES
('Av. Insurgentes Sur', '1234', 'A', 1),
('Calle de Tacuba', '15', NULL, 2),
('Av. Paseo de la Reforma', '265', 'PH', 3),
('Calle Madero', '45', '2B', 4),
('Av. Universidad', '2000', NULL, 5),
('Calle Patriotismo', '72', '101', 6),
('Av. División del Norte', '3421', 'C', 7),
('Calle Durango', '189', '3', 8),
('Av. Coyoacán', '103', NULL, 9),
('Calle Liverpool', '123', '402', 10);

-- =====================================================
-- 3. TABLA usuario (10 usuarios)
-- =====================================================
-- Nota: usuarioContra debe ser hash en producción (ej: SHA2('password', 256))
INSERT INTO `usuario` (`usuarioNom`, `usuarioApePat`, `usuarioApeMat`, `usuarioCorreo`, `usuarioTel`, `usuarioCurp`, `usuarioUser`, `usuarioContra`, `usuarioFechaNac`, `usuarioFechaRegis`, `usuarioCodigo`, `usuarioCorreoVerificado`, `usuarioCodigoFecha`) VALUES
('Juan Carlos', 'Pérez', 'González', 'juan.perez@gmail.com', '5512345678', 'PEGJ950315HDFRRN07', 'juan123', 'hash_juan123', '1995-03-15', NOW(), 'ABCD1234', 1, NOW()),
('María Fernanda', 'López', 'Martínez', 'maria.lopez@gmail.com', '5523456789', 'LOMM980722MDFRRN04', 'maria456', 'hash_maria456', '1998-07-22', NOW(), 'EFGH5678', 1, NOW()),
('Carlos Alberto', 'Rodríguez', 'Sánchez', 'carlos.rodriguez@hotmail.com', '5534567890', 'ROSC931110HDFRRN01', 'carlos789', 'hash_carlos789', '1993-11-10', NOW(), 'IJKL9012', 1, NOW()),
('Ana Sofía', 'Hernández', 'Díaz', 'ana.hernandez@outlook.com', '5545678901', 'HEDA000505MDFRRN09', 'ana321', 'hash_ana321', '2000-05-05', NOW(), 'MNOP3456', 1, NOW()),
('Diego Alejandro', 'García', 'Ramírez', 'diego.garcia@gmail.com', '5556789012', 'GARD960918HDFRRN02', 'diego654', 'hash_diego654', '1996-09-18', NOW(), 'QRST7890', 1, NOW()),
('Valentina', 'Martínez', 'Torres', 'valentina.mt@hotmail.com', '5567890123', 'MATV991201MDFRRN06', 'vale987', 'hash_vale987', '1999-12-01', NOW(), 'UVWX1234', 1, NOW()),
('Santiago', 'Sánchez', 'Cruz', 'santiago.scruz@gmail.com', '5578901234', 'SACS940425HDFRRN03', 'santi555', 'hash_santi555', '1994-04-25', NOW(), 'YZAB5678', 1, NOW()),
('Renata', 'Flores', 'Morales', 'renata.flores@outlook.com', '5589012345', 'FOMR970814MDFRRN08', 'renata777', 'hash_renata777', '1997-08-14', NOW(), 'CDEF9012', 1, NOW()),
('Luis Miguel', 'Torres', 'Vega', 'luis.torres@gmail.com', '5590123456', 'TOVL920228HDFRRN05', 'luis333', 'hash_luis333', '1992-02-28', NOW(), 'GHIJ3456', 1, NOW()),
('Camila', 'Rojas', 'Mendoza', 'camila.rojas@hotmail.com', '5501234567', 'ROMC010630MDFRRN10', 'camila111', 'hash_camila111', '2001-06-30', NOW(), 'KLMN7890', 1, NOW());

-- =====================================================
-- 4. TABLA propiedad (10 propiedades)
-- =====================================================
INSERT INTO `propiedad` (`propiedadTitulo`, `propiedadDescripcion`, `propiedadTipo`, `propiedadLugares`, `propiedadPrecio`, `propiedadEstatus`, `propiedadFechaRegis`, `direccion_idDireccion`) VALUES
('Departamento en la Roma', 'Bonito departamento cerca de restaurantes', 'Departamento', 3, 8500.00, 'Disponible', NOW(), 1),
('Casa en Coyoacán', 'Casa amplia con jardín', 'Casa', 5, 15000.00, 'Disponible', NOW(), 2),
('Loft en el Centro', 'Loft moderno en pleno centro histórico', 'Loft', 2, 6000.00, 'Disponible', NOW(), 3),
('Habitación en Polanco', 'Habitación amueblada en zona exclusiva', 'Habitación', 1, 4500.00, 'Disponible', NOW(), 4),
('Departamento en la Nápoles', 'Departamento con excelente ubicación', 'Departamento', 4, 12000.00, 'Sin Disponibilidad', NOW(), 5),
('Casa en Tlalpan', 'Casa con estacionamiento', 'Casa', 6, 18000.00, 'Disponible', NOW(), 6),
('Estudio en la Condesa', 'Estudio acogedor cerca de parques', 'Estudio', 2, 7500.00, 'Disponible', NOW(), 7),
('Habitación en Santa Fe', 'Habitación con baño privado', 'Habitación', 1, 5500.00, 'Desactivada', NOW(), 8),
('Departamento en Del Valle', 'Departamento con terraza', 'Departamento', 3, 9500.00, 'Disponible', NOW(), 9),
('Casa en San Ángel', 'Casa histórica reformada', 'Casa', 7, 22000.00, 'Disponible', NOW(), 10);

-- =====================================================
-- 5. TABLA fotos (20 fotos para las propiedades)
-- =====================================================
-- Nota: idFotos es AUTO_INCREMENT, no se especifica
INSERT INTO `fotos` (`fotosURL`, `propiedad_idPropiedad`) VALUES
('https://ejemplo.com/fotos/prop1_fachada.jpg', 1),
('https://ejemplo.com/fotos/prop1_sala.jpg', 1),
('https://ejemplo.com/fotos/prop2_jardin.jpg', 2),
('https://ejemplo.com/fotos/prop2_cocina.jpg', 2),
('https://ejemplo.com/fotos/prop3_interior.jpg', 3),
('https://ejemplo.com/fotos/prop4_habitacion.jpg', 4),
('https://ejemplo.com/fotos/prop4_baño.jpg', 4),
('https://ejemplo.com/fotos/prop5_sala_comedor.jpg', 5),
('https://ejemplo.com/fotos/prop6_terraza.jpg', 6),
('https://ejemplo.com/fotos/prop6_jardin.jpg', 6),
('https://ejemplo.com/fotos/prop7_estudio.jpg', 7),
('https://ejemplo.com/fotos/prop8_habitacion.jpg', 8),
('https://ejemplo.com/fotos/prop9_vista.jpg', 9),
('https://ejemplo.com/fotos/prop9_sala.jpg', 9),
('https://ejemplo.com/fotos/prop9_cocina.jpg', 9),
('https://ejemplo.com/fotos/prop10_fachada.jpg', 10),
('https://ejemplo.com/fotos/prop10_patio.jpg', 10),
('https://ejemplo.com/fotos/prop10_interior.jpg', 10),
('https://ejemplo.com/fotos/prop1_recamara.jpg', 1),
('https://ejemplo.com/fotos/prop5_cocina.jpg', 5);

-- =====================================================
-- 6. TABLA arrendatario (10 estudiantes)
-- =====================================================
INSERT INTO `arrendatario` (`arrendatarioBoleta`, `arrendatarioFechaV`, `usuario_idUsuario`, `carrera_idCarrera`) VALUES
('2024123456', NULL, 1, 1),
('2024234567', NULL, 2, 4),
('2023345678', NULL, 3, 7),
('2024456789', NULL, 4, 10),
('2023567890', NULL, 5, 2),
('2024678901', NULL, 6, 5),
('2024789012', NULL, 7, 8),
('2023890123', NULL, 8, 11),
('2024901234', NULL, 9, 3),
('2024012345', NULL, 10, 6);

-- =====================================================
-- 7. TABLA arrendador (10 dueños)
-- =====================================================
INSERT INTO `arrendador` (`arrendadorRFC`, `usuario_idUsuario`, `direccion_idDireccion`) VALUES
('PEGJ950315XXX', 1, 1),
('LOMF980722XXX', 2, 2),
('RSCA931110XXX', 3, 3),
('HEDA000505XXX', 4, 4),
('GARD960918XXX', 5, 5),
('MTV991201XXX', 6, 6),
('SCC940425XXX', 7, 7),
('FMR970814XXX', 8, 8),
('TVL920228XXX', 9, 9),
('ROM010630XXX', 10, 10);

-- =====================================================
-- 8. TABLA servicio_has_propiedad (servicios por propiedad)
-- =====================================================
INSERT INTO `servicio_has_propiedad` (`servicio_idServicio`, `propiedad_idPropiedad`) VALUES
-- Propiedad 1
(1, 1), (2, 1), (4, 1), (24, 1), (28, 1),
-- Propiedad 2
(1, 2), (2, 2), (3, 2), (5, 2), (9, 2), (24, 2), (29, 2), (31, 2),
-- Propiedad 3
(1, 3), (2, 3), (4, 3), (6, 3), (10, 3), (23, 3),
-- Propiedad 4
(1, 4), (2, 4), (4, 4), (7, 4), (24, 4),
-- Propiedad 5
(1, 5), (2, 5), (3, 5), (4, 5), (8, 5), (25, 5), (30, 5),
-- Propiedad 6
(1, 6), (2, 6), (3, 6), (5, 6), (9, 6), (11, 6), (26, 6), (32, 6),
-- Propiedad 7
(1, 7), (2, 7), (4, 7), (6, 7), (12, 7), (24, 7),
-- Propiedad 8
(1, 8), (2, 8), (4, 8), (7, 8), (13, 8),
-- Propiedad 9
(1, 9), (2, 9), (3, 9), (4, 9), (14, 9), (27, 9), (33, 9),
-- Propiedad 10
(1, 10), (2, 10), (3, 10), (5, 10), (9, 10), (15, 10), (24, 10), (34, 10);

-- =====================================================
-- 9. TABLA favoritos (10 favoritos)
-- =====================================================
-- Nota: idfavoritos es AUTO_INCREMENT, no se especifica
INSERT INTO `favoritos` (`favoritosFechaAgregar`, `propiedad_idPropiedad`, `arrendatario_idArrendatario`) VALUES
(NOW(), 1, 1),
(NOW(), 3, 1),
(NOW(), 2, 2),
(NOW(), 5, 2),
(NOW(), 4, 3),
(NOW(), 1, 4),
(NOW(), 6, 5),
(NOW(), 8, 6),
(NOW(), 7, 7),
(NOW(), 10, 8);

-- =====================================================
-- 10. TABLA arrendamiento (10 contratos)
-- =====================================================
-- Nota: arrendamientoVal* son TINYINT (0 o 1)
INSERT INTO `arrendamiento` (`arrendamientoFechaInicio`, `arrendamientoRenta`, `arrendamientoDescrip`, `arrendamientoValEstudiante`, `arrendamientoValArrendador`, `arrendatario_idArrendatario`, `propiedad_idPropiedad`) VALUES
(DATE_SUB(NOW(), INTERVAL 6 MONTH), 8500, 'Contrato por 1 año', 1, 1, 1, 1),
(DATE_SUB(NOW(), INTERVAL 8 MONTH), 15000, 'Contrato por 6 meses', 1, 1, 2, 2),
(DATE_SUB(NOW(), INTERVAL 3 MONTH), 6000, 'Contrato renovable', 1, 1, 3, 3),
(DATE_SUB(NOW(), INTERVAL 2 MONTH), 4500, 'Renta mensual', 1, 1, 4, 4),
(DATE_SUB(NOW(), INTERVAL 10 MONTH), 12000, 'Contrato con depósito', 1, 1, 5, 5),
(DATE_SUB(NOW(), INTERVAL 1 MONTH), 18000, 'Incluye mantenimiento', 1, 1, 6, 6),
(DATE_SUB(NOW(), INTERVAL 4 MONTH), 7500, 'Departamento amueblado', 1, 1, 7, 7),
(DATE_SUB(NOW(), INTERVAL 5 MONTH), 5500, 'Servicios incluidos', 1, 1, 8, 8),
(DATE_SUB(NOW(), INTERVAL 7 MONTH), 9500, 'Excelente ubicación', 1, 1, 9, 9),
(DATE_SUB(NOW(), INTERVAL 9 MONTH), 22000, 'Casa de lujo', 1, 1, 10, 10);

-- =====================================================
-- 11. TABLA resena (10 reseñas)
-- =====================================================
-- Nota: Calificaciones son DECIMAL(2,1)
INSERT INTO `resena` (`resenaFechaCreacion`, `resenaDuracionRenta`, `resenaDescrip`, `resenaCalSerBasic`, `resenaCalSerComEnt`, `resenaCalSerAdicio`, `resenaCalGen`, `resenaSentimiento`, `propiedad_idPropiedad`, `arrendatario_idArrendatario`) VALUES
(NOW(), 6, 'Excelente departamento, muy céntrico', 5.0, 4.0, 4.0, 4.5, 'Positivo', 1, 1),
(NOW(), 8, 'Casa muy bonita y amplia, jardín hermoso', 5.0, 5.0, 5.0, 5.0, 'Positivo', 2, 2),
(NOW(), 3, 'Loft moderno pero algo pequeño', 4.0, 5.0, 3.0, 4.0, 'Neutro', 3, 3),
(NOW(), 2, 'Habitación cómoda, buena zona', 5.0, 3.0, 4.0, 4.0, 'Positivo', 4, 4),
(NOW(), 10, 'Departamento bien ubicado, pero ruidoso', 4.0, 4.0, 4.0, 4.0, 'Neutro', 5, 5),
(NOW(), 1, 'Casa excelente, el mejor lugar', 5.0, 5.0, 5.0, 5.0, 'Positivo', 6, 6),
(NOW(), 4, 'Estudio acogedor, me encantó', 5.0, 4.0, 5.0, 4.5, 'Positivo', 7, 7),
(NOW(), 5, 'Habitación pequeña, mala experiencia', 2.0, 3.0, 2.0, 2.5, 'Negativo', 8, 8),
(NOW(), 7, 'Departamento muy cómodo', 5.0, 4.0, 5.0, 4.5, 'Positivo', 9, 9),
(NOW(), 9, 'Casa increíble, volvería', 5.0, 5.0, 5.0, 5.0, 'Positivo', 10, 10);

-- =====================================================
-- 12. TABLA administrador (5 administradores)
-- =====================================================
INSERT INTO `administrador` (`adminUser`, `adminContra`, `adminFechaInicioSesion`) VALUES
('admin_root', 'hash_admin123', NOW()),
('supervisor1', 'hash_super456', NOW()),
('moderador', 'hash_moder789', NOW()),
('gestor_prop', 'hash_gestor321', NOW()),
('soporte', 'hash_soporte555', NOW());


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;