-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: vivienda_upalm
-- ------------------------------------------------------
-- Server version	8.0.44

--
-- Table structure for table `administrador`
--


CREATE TABLE `administrador` (
  `idAdministrador` int NOT NULL AUTO_INCREMENT,
  `administradorUser` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `administradorContra` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `administradorFechaInicioSesion` datetime DEFAULT NULL,
  PRIMARY KEY (`idAdministrador`),
  UNIQUE KEY `administradorUser` (`administradorUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Dumping data for table `administrador`
--

--
-- Table structure for table `arrendador`
--


CREATE TABLE `arrendador` (
  `idArrendador` int NOT NULL AUTO_INCREMENT,
  `arrendadorCalle` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arrendadorNumExt` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arrendadorNumInt` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arrendadorColonia` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arrendadorMunicipio` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arrendadorEstado` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arrendadorCp` int DEFAULT NULL,
  `usuario_idUsuario` int NOT NULL,
  PRIMARY KEY (`idArrendador`),
  KEY `usuario_idUsuario` (`usuario_idUsuario`),
  CONSTRAINT `arrendador_ibfk_1` FOREIGN KEY (`usuario_idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Dumping data for table `arrendador`
-

--
-- Table structure for table `arrendamiento`
--

CREATE TABLE `arrendamiento` (
  `idArrendamiento` int NOT NULL AUTO_INCREMENT,
  `arrendamientoFechaInicio` datetime DEFAULT NULL,
  `arrendamientoRenta` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arrendamientoDescrip` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arrendamientoValEstudiante` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `arrendamientoValArrendador` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `propiedad_idPropiedad` int NOT NULL,
  PRIMARY KEY (`idArrendamiento`),
  KEY `propiedad_idPropiedad` (`propiedad_idPropiedad`),
  CONSTRAINT `arrendamiento_ibfk_1` FOREIGN KEY (`propiedad_idPropiedad`) REFERENCES `propiedad` (`idPropiedad`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `arrendamiento_ibfk_2` FOREIGN KEY (`propiedad_idPropiedad`) REFERENCES `propiedad` (`idPropiedad`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Dumping data for table `arrendamiento`
--


--
-- Table structure for table `arrendatario`
--

CREATE TABLE `arrendatario` (
  `idArrendatario` int NOT NULL AUTO_INCREMENT,
  `arrendatarioBoleta` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arrendatarioUnidadAca` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arrendatarioFechaActua` datetime DEFAULT NULL,
  `usuario_idUsuario` int NOT NULL,
  `arrendamiento_idArrendamiento` int DEFAULT NULL,
  PRIMARY KEY (`idArrendatario`),
  KEY `usuario_idUsuario` (`usuario_idUsuario`),
  KEY `arrendamiento_idArrendamiento` (`arrendamiento_idArrendamiento`),
  CONSTRAINT `arrendatario_ibfk_1` FOREIGN KEY (`usuario_idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `arrendatario_ibfk_2` FOREIGN KEY (`arrendamiento_idArrendamiento`) REFERENCES `arrendamiento` (`idArrendamiento`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Dumping data for table `arrendatario`
--


--
-- Table structure for table `propiedad`
--


CREATE TABLE `propiedad` (
  `idPropiedad` int NOT NULL AUTO_INCREMENT,
  `propiedadTitulo` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `propiedadDescripcion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propiedadTipo` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `propiedadLugares` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propiedadPrecio` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `propiedadCalle` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propiedadNumExt` int DEFAULT NULL,
  `propiedadNumInt` int DEFAULT NULL,
  `propiedadColonia` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propiedadMunicipio` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propiedadEstado` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propiedadCp` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propiedadEstatus` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT 'Activa',
  `propiedadFechaRegis` datetime DEFAULT NULL,
  `propiedadCodigo` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propiedadSerBasicos` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propiedadSerComEnt` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propiedadSerAdicio` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arrendador_idArrendador` int NOT NULL,
  `propiedadFotos` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`idPropiedad`),
  KEY `arrendador_idArrendador` (`arrendador_idArrendador`),
  CONSTRAINT `propiedad_ibfk_1` FOREIGN KEY (`arrendador_idArrendador`) REFERENCES `arrendador` (`idArrendador`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Table structure for table `resena`
--

CREATE TABLE `resena` (
  `idResena` int NOT NULL AUTO_INCREMENT,
  `resenaFechaCreacion` datetime DEFAULT NULL,
  `resenaDuracionRenta` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resenaDescrip` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resenaCalSerBasic` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resenaCalSerComEnt` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resenaCalSerAdicio` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resenaCalGen` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `arrendatario_idArrendatario` int NOT NULL,
  `propiedad_idPropiedad` int NOT NULL,
  PRIMARY KEY (`idResena`),
  KEY `arrendatario_idArrendatario` (`arrendatario_idArrendatario`),
  KEY `propiedad_idPropiedad` (`propiedad_idPropiedad`),
  CONSTRAINT `resena_ibfk_1` FOREIGN KEY (`arrendatario_idArrendatario`) REFERENCES `arrendatario` (`idArrendatario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `resena_ibfk_2` FOREIGN KEY (`propiedad_idPropiedad`) REFERENCES `propiedad` (`idPropiedad`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Dumping data for table `resena`
--


--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `usuarioNom` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuarioApePat` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuarioApeMat` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuarioCorreo` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuarioTel` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuarioCurp` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuarioUser` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuarioContra` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuarioFechaNac` date DEFAULT NULL,
  `usuarioFechaRegis` datetime DEFAULT NULL,
  `usuarioCodigo` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuarioFechaUIS` datetime DEFAULT NULL,
  `usuarioCC` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuarioVCC` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `usuarioFCC` datetime DEFAULT NULL,
  `usuarioFoto` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `usuarioCorreo` (`usuarioCorreo`),
  UNIQUE KEY `usuarioCurp` (`usuarioCurp`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

