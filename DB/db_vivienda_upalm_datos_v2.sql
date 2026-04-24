-- ============================================================
--  Burroomies — Datos de prueba v2
--  Alineados con db_vivienda_upalm_schema_v2.sql
--
--  CAMBIOS respecto a datos v1:
--  [unidad_academica] Unificada nomenclatura con schema v2.
--                     Ampliada con todas las unidades del IPN relevantes.
--  [carrera]          Ampliada con todas las carreras correspondientes.
--  [servicio]         Actualizado catálogo para coincidir con el frontend
--                     (nombres exactos que usa el formulario).
--  [servicio_has_propiedad] Actualizado para usar nuevos IDs de servicio.
--  [arrendatario]     Agregado arrendatarioApodo, arrendatarioVerificado=1,
--                     arrendatarioFechaLimite=NULL (ya verificados).
--  [propiedad]        Agregado arrendador_idArrendador.
--  [favoritos]        PK renombrado idFavoritos (el INSERT no cambia).
--  [arrendamiento]    arrendamientoValResena agregado como TINYINT.
-- ============================================================

USE dbBurroomies;

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS,         UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

-- ============================================================
-- 1. CATÁLOGOS
-- NOTA: unidad_academica, carrera y servicio YA se insertan
--       en el schema v2. Este archivo los reemplaza con el
--       catálogo ampliado de los datos de prueba.
--       Ejecutar DESPUÉS del schema v2.
-- ============================================================

-- Limpiar catálogos insertados por el schema para usar el catálogo ampliado
DELETE FROM `servicio_has_propiedad`;
DELETE FROM `servicio`;
DELETE FROM `carrera`;
DELETE FROM `unidad_academica`;

-- ------------------------------------------------------------
-- Unidades académicas (nomenclatura unificada)
-- ------------------------------------------------------------
INSERT INTO `unidad_academica` (`idUnidadAcademica`, `unidadAcademicaNombre`, `unidadAcademicaClave`) VALUES
(1,  'Escuela Superior de Cómputo',                                                                      'ESCOM'),
(2,  'Escuela Superior de Ingeniería Mecánica y Eléctrica',                                              'ESIME'),
(3,  'Unidad Profesional Interdisciplinaria de Ingeniería y Ciencias Sociales y Administrativas',        'UPIICSA'),
(4,  'Unidad Profesional Interdisciplinaria de Biotecnología',                                           'UPIBI'),
(5,  'Escuela Superior de Turismo',                                                                      'EST'),
(6,  'Escuela Superior de Comercio y Administración',                                                    'ESCA'),
(7,  'Escuela Superior de Economía',                                                                     'ESE'),
(8,  'Escuela Superior de Ingeniería Química e Industrias Extractivas',                                  'ESIQIE'),
(9,  'Escuela Superior de Medicina',                                                                     'ESM'),
(10, 'Escuela Superior de Enfermería y Obstetricia',                                                     'ESEO'),
(11, 'Escuela Superior de Física y Matemáticas',                                                         'ESFM'),
(12, 'Unidad Profesional Interdisciplinaria en Ingeniería y Tecnologías Avanzadas',                      'UPIITA'),
(13, 'Escuela Superior de Ingeniería y Arquitectura Unidad Zacatenco',                                   'ESIA-Z');

-- ------------------------------------------------------------
-- Carreras
-- ------------------------------------------------------------
INSERT INTO `carrera` (`idCarrera`, `carreraNombre`, `carreraClave`, `idUnidadAcademica`) VALUES
-- ESCOM (1)
(1,  'Ingeniería en Sistemas Computacionales',                    'ISC',  1),
(2,  'Ingeniería en Inteligencia Artificial',                     'IIA',  1),
(3,  'Licenciatura en Ciencia de Datos',                         'LCD',  1),
-- ESIME (2)
(4,  'Ingeniería en Comunicaciones y Electrónica',               'ICE',  2),
(5,  'Ingeniería en Control y Automatización',                   'ICA',  2),
(6,  'Ingeniería en Computación',                                'ICO',  2),
(7,  'Ingeniería Eléctrica',                                     'IE',   2),
(8,  'Ingeniería Mecánica',                                      'IM',   2),
(9,  'Ingeniería Robótica Industrial',                           'IRI',  2),
-- UPIICSA (3)
(10, 'Ingeniería en Transporte',                                 'IT',   3),
(11, 'Ingeniería en Informática',                                'INF',  3),
(12, 'Ingeniería Industrial',                                    'IInd', 3),
(13, 'Licenciatura en Administración Industrial',                'LAI',  3),
(14, 'Licenciatura en Contaduría Pública',                       'LCP',  3),
-- UPIBI (4)
(15, 'Ingeniería Biotecnológica',                                'IBT',  4),
(16, 'Ingeniería en Sistemas Biológicos',                        'ISB',  4),
(17, 'Ingeniería en Alimentos',                                  'IA',   4),
(18, 'Ingeniería Biomédica',                                     'IBM',  4),
-- EST (5)
(19, 'Licenciatura en Turismo',                                  'LT',   5),
(20, 'Licenciatura en Administración Turística',                 'LAT',  5),
-- ESCA (6)
(21, 'Licenciatura en Administración',                           'LA',   6),
(22, 'Licenciatura en Contaduría y Finanzas Públicas',           'LCFP', 6),
(23, 'Licenciatura en Negocios Internacionales',                 'LNI',  6),
(24, 'Licenciatura en Informática Administrativa',               'LIA',  6),
(25, 'Licenciatura en Administración y Desarrollo Empresarial',  'LADE', 6),
(26, 'Licenciatura en Relaciones Comerciales',                   'LRC',  6),
-- ESE (7)
(27, 'Licenciatura en Economía',                                 'LE',   7),
-- ESIQIE (8)
(28, 'Ingeniería Química',                                       'IQ',   8),
(29, 'Ingeniería Química Industrial',                            'IQI',  8),
(30, 'Ingeniería en Metalurgia y Materiales',                    'IMM',  8),
(31, 'Ingeniería Química Petrolera',                             'IQP',  8),
-- ESM (9)
(32, 'Médico Cirujano y Partero',                                'MCP',  9),
-- ESEO (10)
(33, 'Licenciatura en Enfermería',                               'LEF',  10),
(34, 'Licenciatura en Enfermería y Obstetricia',                 'LEO',  10),
-- ESFM (11)
(35, 'Ingeniería en Física Aplicada',                            'IFA',  11),
(36, 'Ingeniería en Matemáticas Aplicadas',                      'IMA',  11),
(37, 'Licenciatura en Física y Matemáticas',                     'LFM',  11),
-- UPIITA (12)
(38, 'Ingeniería Biónica',                                       'IB',   12),
(39, 'Ingeniería Telemática',                                    'ITEL', 12),
-- ESIA-Z (13)
(40, 'Ingeniería Civil',                                         'IC',   13),
(41, 'Arquitectura',                                             'ARQ',  13);


-- ------------------------------------------------------------
-- Servicios
-- IMPORTANTE: los nombres deben coincidir EXACTAMENTE con los
-- que usa el frontend en AgregarPropiedad.jsx y EditarPropiedad.jsx
-- ------------------------------------------------------------
INSERT INTO `servicio` (`idServicio`, `servicioNombre`, `servicioCategoria`) VALUES
-- Básicos
(1,  'Agua',                     'Basico'),
(2,  'Luz',                      'Basico'),
(3,  'Gas',                      'Basico'),
(4,  'Internet',                 'Entretenimiento'),
(5,  'TV por cable',             'Entretenimiento'),
-- Adicionales
(6,  'Amueblada',                'Adicional'),
(7,  'Estacionamiento',          'Adicional'),
(8,  'Gimnasio o alberca',       'Adicional'),
(9,  'Mantenimiento y limpieza', 'Adicional'),
(10, 'Seguridad',                'Adicional'),
(11, 'Elevador',                 'Adicional');


-- ============================================================
-- 2. DIRECCIONES
-- Usan CP_idCP 1-10 — requiere catálogo SEPOMEX cargado.
-- ============================================================
INSERT INTO `direccion` (`idDireccion`, `direccionCalle`, `direccionNumExt`, `direccionNumInt`, `CP_idCP`) VALUES
(1,  'Av. Insurgentes Sur',       '1234', 'A',   1),
(2,  'Calle de Tacuba',           '15',   NULL,  2),
(3,  'Av. Paseo de la Reforma',   '265',  'PH',  3),
(4,  'Calle Madero',              '45',   '2B',  4),
(5,  'Av. Universidad',           '2000', NULL,  5),
(6,  'Calle Patriotismo',         '72',   '101', 6),
(7,  'Av. División del Norte',    '3421', 'C',   7),
(8,  'Calle Durango',             '189',  '3',   8),
(9,  'Av. Coyoacán',              '103',  NULL,  9),
(10, 'Calle Liverpool',           '123',  '402', 10);


-- ============================================================
-- 3. USUARIOS (10)
-- Campos renombrados: usuarioCodigo, usuarioCorreoVerificado,
-- usuarioCodigoFecha. Eliminado: usuarioFoto.
-- ============================================================
INSERT INTO `usuario` (
  `idUsuario`, `usuarioNom`, `usuarioApePat`, `usuarioApeMat`,
  `usuarioCorreo`, `usuarioTel`, `usuarioCurp`, `usuarioUser`,
  `usuarioContra`, `usuarioFechaNac`, `usuarioFechaRegis`,
  `usuarioCodigo`, `usuarioCorreoVerificado`, `usuarioCodigoFecha`
) VALUES
(1,  'Juan Carlos',     'Pérez',     'González', 'juan.perez@gmail.com',          '5512345678', 'PEGJ950315HDFRRN07', 'juan123',   'hash_juan123',   '1995-03-15', NOW(), 'ABCD1234', 1, NOW()),
(2,  'María Fernanda',  'López',     'Martínez', 'maria.lopez@gmail.com',         '5523456789', 'LOMM980722MDFRRN04', 'maria456',  'hash_maria456',  '1998-07-22', NOW(), 'EFGH5678', 1, NOW()),
(3,  'Carlos Alberto',  'Rodríguez', 'Sánchez',  'carlos.rodriguez@hotmail.com',  '5534567890', 'ROSC931110HDFRRN01', 'carlos789', 'hash_carlos789', '1993-11-10', NOW(), 'IJKL9012', 1, NOW()),
(4,  'Ana Sofía',       'Hernández', 'Díaz',     'ana.hernandez@outlook.com',     '5545678901', 'HEDA000505MDFRRN09', 'ana321',    'hash_ana321',    '2000-05-05', NOW(), 'MNOP3456', 1, NOW()),
(5,  'Diego Alejandro', 'García',    'Ramírez',  'diego.garcia@gmail.com',        '5556789012', 'GARD960918HDFRRN02', 'diego654',  'hash_diego654',  '1996-09-18', NOW(), 'QRST7890', 1, NOW()),
(6,  'Valentina',       'Martínez',  'Torres',   'valentina.mt@hotmail.com',      '5567890123', 'MATV991201MDFRRN06', 'vale987',   'hash_vale987',   '1999-12-01', NOW(), 'UVWX1234', 1, NOW()),
(7,  'Santiago',        'Sánchez',   'Cruz',     'santiago.scruz@gmail.com',      '5578901234', 'SACS940425HDFRRN03', 'santi555',  'hash_santi555',  '1994-04-25', NOW(), 'YZAB5678', 1, NOW()),
(8,  'Renata',          'Flores',    'Morales',  'renata.flores@outlook.com',     '5589012345', 'FOMR970814MDFRRN08', 'renata777', 'hash_renata777', '1997-08-14', NOW(), 'CDEF9012', 1, NOW()),
(9,  'Luis Miguel',     'Torres',    'Vega',     'luis.torres@gmail.com',         '5590123456', 'TOVL920228HDFRRN05', 'luis333',   'hash_luis333',   '1992-02-28', NOW(), 'GHIJ3456', 1, NOW()),
(10, 'Camila',          'Rojas',     'Mendoza',  'camila.rojas@hotmail.com',      '5501234567', 'ROMC010630MDFRRN10', 'camila111', 'hash_camila111', '2001-06-30', NOW(), 'KLMN7890', 1, NOW());


-- ============================================================
-- 4. ARRENDATARIOS (10)
-- Agregado: arrendatarioApodo (UNIQUE, NOT NULL)
--           arrendatarioVerificado = 1 (datos de prueba ya verificados)
--           arrendatarioFechaLimite = NULL (no aplica para verificados)
-- ============================================================
INSERT INTO `arrendatario` (
  `idArrendatario`, `arrendatarioApodo`, `arrendatarioBoleta`,
  `arrendatarioFechaV`, `arrendatarioVerificado`, `arrendatarioFechaLimite`,
  `usuario_idUsuario`, `carrera_idCarrera`
) VALUES
(1,  'juanc_ipn',    '2024123456', NULL, 1, NULL, 1,  1),
(2,  'mariaf_ipn',   '2024234567', NULL, 1, NULL, 2,  4),
(3,  'carlosr_ipn',  '2023345678', NULL, 1, NULL, 3,  7),
(4,  'anas_ipn',     '2024456789', NULL, 1, NULL, 4,  10),
(5,  'diegoa_ipn',   '2023567890', NULL, 1, NULL, 5,  2),
(6,  'vale_ipn',     '2024678901', NULL, 1, NULL, 6,  5),
(7,  'santi_ipn',    '2024789012', NULL, 1, NULL, 7,  8),
(8,  'renata_ipn',   '2023890123', NULL, 1, NULL, 8,  11),
(9,  'luism_ipn',    '2024901234', NULL, 1, NULL, 9,  3),
(10, 'camila_ipn',   '2024012345', NULL, 1, NULL, 10, 6);


-- ============================================================
-- 5. ARRENDADORES (10)
-- Sin cambios — ya usaba direccion_idDireccion y usuario_idUsuario
-- ============================================================
INSERT INTO `arrendador` (`idArrendador`, `arrendadorRFC`, `usuario_idUsuario`, `direccion_idDireccion`) VALUES
(1,  'PEGJ950315XXX', 1,  1),
(2,  'LOMF980722XXX', 2,  2),
(3,  'RSCA931110XXX', 3,  3),
(4,  'HEDA000505XXX', 4,  4),
(5,  'GARD960918XXX', 5,  5),
(6,  'MTV991201XXXX', 6,  6),
(7,  'SCC940425XXXX', 7,  7),
(8,  'FMR970814XXXX', 8,  8),
(9,  'TVL920228XXXX', 9,  9),
(10, 'ROM010630XXXX', 10, 10);


-- ============================================================
-- 6. PROPIEDADES (10)
-- Agregado: arrendador_idArrendador
-- ============================================================
INSERT INTO `propiedad` (
  `idPropiedad`, `propiedadTitulo`, `propiedadDescripcion`, `propiedadTipo`,
  `propiedadLugares`, `propiedadPrecio`, `propiedadEstatus`,
  `propiedadFechaRegis`, `direccion_idDireccion`, `arrendador_idArrendador`
) VALUES
(1,  'Departamento en la Roma',     'Bonito departamento cerca de restaurantes', 'Departamento', 3, 8500.00,  'Disponible',        NOW(), 1,  1),
(2,  'Casa en Coyoacán',            'Casa amplia con jardín',                    'Casa',         5, 15000.00, 'Disponible',        NOW(), 2,  2),
(3,  'Habitación en el Centro',     'Habitación moderna en pleno centro',        'Habitación',   2, 6000.00,  'Disponible',        NOW(), 3,  3),
(4,  'Habitación en Polanco',       'Habitación amueblada en zona exclusiva',    'Habitación',   1, 4500.00,  'Disponible',        NOW(), 4,  4),
(5,  'Departamento en la Nápoles',  'Departamento con excelente ubicación',      'Departamento', 4, 12000.00, 'Sin Disponibilidad', NOW(), 5,  5),
(6,  'Casa en Tlalpan',             'Casa con estacionamiento',                  'Casa',         6, 18000.00, 'Disponible',        NOW(), 6,  6),
(7,  'Departamento en la Condesa',  'Departamento acogedor cerca de parques',    'Departamento', 2, 7500.00,  'Disponible',        NOW(), 7,  7),
(8,  'Habitación en Santa Fe',      'Habitación con baño privado',               'Habitación',   1, 5500.00,  'Desactivada',       NOW(), 8,  8),
(9,  'Departamento en Del Valle',   'Departamento con terraza',                  'Departamento', 3, 9500.00,  'Disponible',        NOW(), 9,  9),
(10, 'Casa en San Ángel',           'Casa histórica reformada',                  'Casa',         7, 22000.00, 'Disponible',        NOW(), 10, 10);


-- ============================================================
-- 7. FOTOS (20)
-- Sin cambios estructurales — fotosURL acepta texto largo ahora
-- ============================================================
INSERT INTO `fotos` (`fotosURL`, `propiedad_idPropiedad`) VALUES
('https://ejemplo.com/fotos/prop1_fachada.jpg',    1),
('https://ejemplo.com/fotos/prop1_sala.jpg',       1),
('https://ejemplo.com/fotos/prop1_recamara.jpg',   1),
('https://ejemplo.com/fotos/prop2_jardin.jpg',     2),
('https://ejemplo.com/fotos/prop2_cocina.jpg',     2),
('https://ejemplo.com/fotos/prop3_interior.jpg',   3),
('https://ejemplo.com/fotos/prop4_habitacion.jpg', 4),
('https://ejemplo.com/fotos/prop4_bano.jpg',       4),
('https://ejemplo.com/fotos/prop5_sala.jpg',       5),
('https://ejemplo.com/fotos/prop5_cocina.jpg',     5),
('https://ejemplo.com/fotos/prop6_terraza.jpg',    6),
('https://ejemplo.com/fotos/prop6_jardin.jpg',     6),
('https://ejemplo.com/fotos/prop7_depto.jpg',      7),
('https://ejemplo.com/fotos/prop8_habitacion.jpg', 8),
('https://ejemplo.com/fotos/prop9_vista.jpg',      9),
('https://ejemplo.com/fotos/prop9_sala.jpg',       9),
('https://ejemplo.com/fotos/prop9_cocina.jpg',     9),
('https://ejemplo.com/fotos/prop10_fachada.jpg',   10),
('https://ejemplo.com/fotos/prop10_patio.jpg',     10),
('https://ejemplo.com/fotos/prop10_interior.jpg',  10);


-- ============================================================
-- 8. SERVICIOS POR PROPIEDAD
-- IDs actualizados para usar el nuevo catálogo (1-11):
--   1=Agua, 2=Luz, 3=Gas, 4=Internet, 5=TV por cable,
--   6=Amueblada, 7=Estacionamiento, 8=Gimnasio o alberca,
--   9=Mantenimiento y limpieza, 10=Seguridad, 11=Elevador
-- ============================================================
INSERT INTO `servicio_has_propiedad` (`servicio_idServicio`, `propiedad_idPropiedad`) VALUES
-- Propiedad 1: Agua, Luz, Internet, Amueblada
(1,1), (2,1), (4,1), (6,1),
-- Propiedad 2: Agua, Luz, Gas, Amueblada, Estacionamiento, Seguridad
(1,2), (2,2), (3,2), (6,2), (7,2), (10,2),
-- Propiedad 3: Agua, Luz, Internet, Amueblada, Elevador
(1,3), (2,3), (4,3), (6,3), (11,3),
-- Propiedad 4: Agua, Luz, Internet, Amueblada
(1,4), (2,4), (4,4), (6,4),
-- Propiedad 5: Agua, Luz, Gas, Internet, Amueblada, Seguridad
(1,5), (2,5), (3,5), (4,5), (6,5), (10,5),
-- Propiedad 6: Agua, Luz, Gas, TV por cable, Estacionamiento, Mantenimiento, Seguridad
(1,6), (2,6), (3,6), (5,6), (7,6), (9,6), (10,6),
-- Propiedad 7: Agua, Luz, Internet, Amueblada, Gimnasio
(1,7), (2,7), (4,7), (6,7), (8,7),
-- Propiedad 8: Agua, Luz, Internet, Amueblada
(1,8), (2,8), (4,8), (6,8),
-- Propiedad 9: Agua, Luz, Gas, Internet, Amueblada, Seguridad, Elevador
(1,9), (2,9), (3,9), (4,9), (6,9), (10,9), (11,9),
-- Propiedad 10: Agua, Luz, Gas, TV por cable, Estacionamiento, Mantenimiento, Seguridad, Elevador
(1,10), (2,10), (3,10), (5,10), (7,10), (9,10), (10,10), (11,10);


-- ============================================================
-- 9. FAVORITOS (10)
-- Sin cambios en los datos — PK es AUTO_INCREMENT
-- ============================================================
INSERT INTO `favoritos` (`favoritosFechaAgregar`, `propiedad_idPropiedad`, `arrendatario_idArrendatario`) VALUES
(NOW(), 1,  1),
(NOW(), 3,  1),
(NOW(), 2,  2),
(NOW(), 5,  2),
(NOW(), 4,  3),
(NOW(), 1,  4),
(NOW(), 6,  5),
(NOW(), 8,  6),
(NOW(), 7,  7),
(NOW(), 10, 8);


-- ============================================================
-- 10. ARRENDAMIENTOS (10)
-- Agregado: arrendamientoValResena = 1 (ya terminados en pruebas)
-- ============================================================
INSERT INTO `arrendamiento` (
  `arrendamientoFechaInicio`, `arrendamientoRenta`, `arrendamientoDescrip`,
  `arrendamientoValEstudiante`, `arrendamientoValArrendador`, `arrendamientoValResena`,
  `arrendatario_idArrendatario`, `propiedad_idPropiedad`
) VALUES
(DATE_SUB(NOW(), INTERVAL 6  MONTH), 8500,  'Contrato por 1 año',        1, 1, 1, 1,  1),
(DATE_SUB(NOW(), INTERVAL 8  MONTH), 15000, 'Contrato por 6 meses',      1, 1, 1, 2,  2),
(DATE_SUB(NOW(), INTERVAL 3  MONTH), 6000,  'Contrato renovable',        1, 1, 1, 3,  3),
(DATE_SUB(NOW(), INTERVAL 2  MONTH), 4500,  'Renta mensual',             1, 1, 1, 4,  4),
(DATE_SUB(NOW(), INTERVAL 10 MONTH), 12000, 'Contrato con depósito',     1, 1, 1, 5,  5),
(DATE_SUB(NOW(), INTERVAL 1  MONTH), 18000, 'Incluye mantenimiento',     1, 1, 1, 6,  6),
(DATE_SUB(NOW(), INTERVAL 4  MONTH), 7500,  'Departamento amueblado',    1, 1, 1, 7,  7),
(DATE_SUB(NOW(), INTERVAL 5  MONTH), 5500,  'Servicios incluidos',       1, 1, 1, 8,  8),
(DATE_SUB(NOW(), INTERVAL 7  MONTH), 9500,  'Excelente ubicación',       1, 1, 1, 9,  9),
(DATE_SUB(NOW(), INTERVAL 9  MONTH), 22000, 'Casa de lujo',              1, 1, 1, 10, 10);


-- ============================================================
-- 11. RESEÑAS (10)
-- Sin cambios
-- ============================================================
INSERT INTO `resena` (
  `resenaFechaCreacion`, `resenaDuracionRenta`, `resenaDescrip`,
  `resenaCalSerBasic`, `resenaCalSerComEnt`, `resenaCalSerAdicio`,
  `resenaCalGen`, `resenaSentimiento`,
  `propiedad_idPropiedad`, `arrendatario_idArrendatario`
) VALUES
(NOW(), 6,  'Excelente departamento, muy céntrico',          5.0, 4.0, 4.0, 4.5, 'Positivo', 1,  1),
(NOW(), 8,  'Casa muy bonita y amplia, jardín hermoso',       5.0, 5.0, 5.0, 5.0, 'Positivo', 2,  2),
(NOW(), 3,  'Habitación moderna pero algo pequeña',           4.0, 5.0, 3.0, 4.0, 'Neutro',   3,  3),
(NOW(), 2,  'Habitación cómoda, buena zona',                  5.0, 3.0, 4.0, 4.0, 'Positivo', 4,  4),
(NOW(), 10, 'Departamento bien ubicado, pero ruidoso',        4.0, 4.0, 4.0, 4.0, 'Neutro',   5,  5),
(NOW(), 1,  'Casa excelente, el mejor lugar',                 5.0, 5.0, 5.0, 5.0, 'Positivo', 6,  6),
(NOW(), 4,  'Departamento acogedor, me encantó',              5.0, 4.0, 5.0, 4.5, 'Positivo', 7,  7),
(NOW(), 5,  'Habitación pequeña, mala experiencia',           2.0, 3.0, 2.0, 2.5, 'Negativo', 8,  8),
(NOW(), 7,  'Departamento muy cómodo',                        5.0, 4.0, 5.0, 4.5, 'Positivo', 9,  9),
(NOW(), 9,  'Casa increíble, volvería',                       5.0, 5.0, 5.0, 5.0, 'Positivo', 10, 10);


-- ============================================================
-- 12. ADMINISTRADORES (5)
-- Sin cambios
-- ============================================================
INSERT INTO `administrador` (`adminUser`, `adminContra`, `adminFechaInicioSesion`) VALUES
('admin_root',   'hash_admin123',   NOW()),
('supervisor1',  'hash_super456',   NOW()),
('moderador',    'hash_moder789',   NOW()),
('gestor_prop',  'hash_gestor321',  NOW()),
('soporte',      'hash_soporte555', NOW());


SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
