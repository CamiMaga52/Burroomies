-- ============================================================
--  Burroomies — Schema v2
--  Cambios respecto a v1:
--  [usuario]         Renombrado: usuarioCC→usuarioCodigo, usuarioVCC→usuarioCorreoVerificado,
--                    usuarioFCC→usuarioCodigoFecha. Eliminado: usuarioFoto.
--                    usuarioUser ahora UNIQUE (identificador del arrendatario).
--  [arrendatario]    Agregado: arrendatarioApodo (UNIQUE), arrendatarioVerificado,
--                    arrendatarioFechaLimite. Renombrado: arrendatarioFechaActua→arrendatarioFechaV.
--                    Agregado FK: carrera_idCarrera. Eliminado: arrendamiento_idArrendamiento.
--  [arrendador]      Eliminada dirección aplanada. Usa FK direccion_idDireccion.
--  [propiedad]       Eliminada dirección aplanada, campos aplanados de servicios/fotos/codigo.
--                    Usa FK direccion_idDireccion y arrendador_idArrendador.
--                    propiedadEstatus ENUM actualizado.
--  [fotos]           fotosURL ampliado a TEXT para soportar Base64 temporal.
--  [favoritos]       PK renombrado a idFavoritos (consistencia). Agregado favoritosFechaAgregar.
--  [arrendamiento]   Agregado: arrendatario_idArrendatario, arrendamientoValResena.
--  [servicio]        Sin cambios.
--  [servicio_has_propiedad] Sin cambios.
--  [datos semilla]   INSERT de servicios, unidades académicas y carreras de la UPALM.
--                    UPDATE de CP permitidos para zona UPALM.
-- ============================================================

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS,   UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE,
    SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- ------------------------------------------------------------
-- Schema
-- ------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `dbBurroomies` DEFAULT CHARACTER SET utf8mb4;
USE `dbBurroomies`;

-- ------------------------------------------------------------
-- CP  (catálogo SEPOMEX — se carga por separado con LOAD DATA)
-- Sin cambios estructurales respecto a v1.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbBurroomies`.`CP` (
  `idCP`               INT         NOT NULL AUTO_INCREMENT,
  `d_codigo`           VARCHAR(5)  NULL,
  `d_asenta`           VARCHAR(100) NULL,
  `d_tipo_asenta`      VARCHAR(50)  NULL,
  `D_mnpio`            VARCHAR(100) NULL,
  `d_estado`           VARCHAR(60)  NULL,
  `d_ciudad`           VARCHAR(60)  NULL,
  `d_CP`               VARCHAR(5)  NULL,
  `c_estado`           VARCHAR(2)  NULL,
  `c_oficina`          VARCHAR(5)  NULL,
  `c_CP`               VARCHAR(5)  NULL,
  `c_tipo_asenta`      VARCHAR(2)  NULL,
  `c_mnpio`            VARCHAR(3)  NULL,
  `id_asenta_cpcons`   VARCHAR(4)  NULL,
  `d_zona`             VARCHAR(10) NULL,
  `c_cve_ciudad`       VARCHAR(2)  NULL,
  `cpAceptadoSistema`  TINYINT     NULL DEFAULT 0,
  PRIMARY KEY (`idCP`)
) ENGINE = InnoDB;


-- ------------------------------------------------------------
-- direccion
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbBurroomies`.`direccion` (
  `idDireccion`      INT          NOT NULL AUTO_INCREMENT,
  `direccionCalle`   VARCHAR(150) NOT NULL,
  `direccionNumExt`  VARCHAR(20)  NOT NULL,
  `direccionNumInt`  VARCHAR(20)  NULL DEFAULT NULL,
  `CP_idCP`          INT          NOT NULL,
  PRIMARY KEY (`idDireccion`),
  INDEX `fk_direccion_CP1_idx` (`CP_idCP` ASC),
  CONSTRAINT `fk_direccion_CP1`
    FOREIGN KEY (`CP_idCP`)
    REFERENCES `dbBurroomies`.`CP` (`idCP`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- unidad_academica
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbBurroomies`.`unidad_academica` (
  `idUnidadAcademica`      INT          NOT NULL AUTO_INCREMENT,
  `unidadAcademicaNombre`  VARCHAR(150) NOT NULL,
  `unidadAcademicaClave`   VARCHAR(10)  NOT NULL,
  PRIMARY KEY (`idUnidadAcademica`),
  UNIQUE INDEX `unidadAcademicaClave`  (`unidadAcademicaClave` ASC),
  UNIQUE INDEX `unidadAcademicaNombre` (`unidadAcademicaNombre` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- carrera
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbBurroomies`.`carrera` (
  `idCarrera`          INT          NOT NULL AUTO_INCREMENT,
  `carreraNombre`      VARCHAR(150) NOT NULL,
  `carreraClave`       VARCHAR(10)  NOT NULL,
  `idUnidadAcademica`  INT          NOT NULL,
  PRIMARY KEY (`idCarrera`),
  UNIQUE INDEX `carreraClave`  (`carreraClave` ASC),
  UNIQUE INDEX `carreraNombre` (`carreraNombre` ASC),
  INDEX `fk_carrera_unidad_academica` (`idUnidadAcademica` ASC),
  CONSTRAINT `fk_carrera_unidad_academica`
    FOREIGN KEY (`idUnidadAcademica`)
    REFERENCES `dbBurroomies`.`unidad_academica` (`idUnidadAcademica`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- usuario
--   CAMBIOS:
--     usuarioCC  → usuarioCodigo          (código verificación correo, CHAR 8)
--     usuarioVCC → usuarioCorreoVerificado (TINYINT)
--     usuarioFCC → usuarioCodigoFecha      (DATETIME)
--     usuarioFoto eliminado
--     usuarioUser ahora UNIQUE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbBurroomies`.`usuario` (
  `idUsuario`               INT          NOT NULL AUTO_INCREMENT,
  `usuarioNom`              VARCHAR(60)  CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NOT NULL,
  `usuarioApePat`           VARCHAR(35)  CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NOT NULL,
  `usuarioApeMat`           VARCHAR(35)  CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NULL DEFAULT NULL,
  `usuarioCorreo`           VARCHAR(60)  CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NOT NULL,
  `usuarioTel`              CHAR(13)     CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NULL DEFAULT NULL,
  `usuarioCurp`             CHAR(18)     CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NULL DEFAULT NULL,
  `usuarioUser`             VARCHAR(50)  CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NULL DEFAULT NULL,
  `usuarioContra`           VARCHAR(200) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NOT NULL,
  `usuarioFechaNac`         DATE         NULL DEFAULT NULL,
  `usuarioFechaRegis`       DATETIME     NULL DEFAULT NULL,
  `usuarioFechaUIS`         DATETIME     NULL DEFAULT NULL,
  `usuarioCodigo`           CHAR(8)      NULL,
  `usuarioCorreoVerificado` TINYINT      NULL DEFAULT 0,
  `usuarioCodigoFecha`      DATETIME     NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE INDEX `usuarioCorreo` (`usuarioCorreo` ASC),
  UNIQUE INDEX `usuarioCurp`   (`usuarioCurp`   ASC),
  UNIQUE INDEX `usuarioUser`   (`usuarioUser`   ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- arrendatario
--   CAMBIOS:
--     Agregado: arrendatarioApodo (UNIQUE, NOT NULL)
--     Renombrado: arrendatarioFechaActua → arrendatarioFechaV
--     Agregado FK: carrera_idCarrera
--     Eliminado: arrendamiento_idArrendamiento
--     Agregado: arrendatarioVerificado, arrendatarioFechaLimite
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbBurroomies`.`arrendatario` (
  `idArrendatario`            INT          NOT NULL AUTO_INCREMENT,
  `arrendatarioApodo`         VARCHAR(45)  CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NOT NULL,
  `arrendatarioBoleta`        VARCHAR(12)  CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NULL DEFAULT NULL,
  `arrendatarioFechaV`        DATETIME     NULL DEFAULT NULL,
  `arrendatarioVerificado`    TINYINT      NOT NULL DEFAULT 0,
  `arrendatarioFechaLimite`   DATETIME     NULL DEFAULT NULL,
  `usuario_idUsuario`         INT          NOT NULL,
  `carrera_idCarrera`         INT          NOT NULL,
  PRIMARY KEY (`idArrendatario`),
  UNIQUE INDEX `arrendatarioApodo` (`arrendatarioApodo` ASC),
  INDEX `fk_arrendatario_usuario1_idx`  (`usuario_idUsuario` ASC),
  INDEX `fk_arrendatario_carrera1_idx`  (`carrera_idCarrera` ASC),
  CONSTRAINT `fk_arrendatario_usuario1`
    FOREIGN KEY (`usuario_idUsuario`)
    REFERENCES `dbBurroomies`.`usuario` (`idUsuario`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_arrendatario_carrera1`
    FOREIGN KEY (`carrera_idCarrera`)
    REFERENCES `dbBurroomies`.`carrera` (`idCarrera`)
    ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- administrador  (sin cambios)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbBurroomies`.`administrador` (
  `idAdmin`                INT          NOT NULL AUTO_INCREMENT,
  `adminUser`              VARCHAR(45)  CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NOT NULL,
  `adminContra`            VARCHAR(200) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NOT NULL,
  `adminFechaInicioSesion` DATETIME     NULL DEFAULT NULL,
  PRIMARY KEY (`idAdmin`),
  UNIQUE INDEX `administradorUser` (`adminUser` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- arrendador
--   CAMBIOS: eliminada dirección aplanada, usa FK direccion_idDireccion
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbBurroomies`.`arrendador` (
  `idArrendador`          INT     NOT NULL AUTO_INCREMENT,
  `arrendadorRFC`         CHAR(14) NULL DEFAULT NULL,
  `usuario_idUsuario`     INT     NOT NULL,
  `direccion_idDireccion` INT     NOT NULL,
  PRIMARY KEY (`idArrendador`),
  INDEX `fk_arrendador_usuario1_idx`    (`usuario_idUsuario`     ASC),
  INDEX `fk_arrendador_direccion1_idx`  (`direccion_idDireccion` ASC),
  CONSTRAINT `fk_arrendador_usuario1`
    FOREIGN KEY (`usuario_idUsuario`)
    REFERENCES `dbBurroomies`.`usuario` (`idUsuario`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_arrendador_direccion1`
    FOREIGN KEY (`direccion_idDireccion`)
    REFERENCES `dbBurroomies`.`direccion` (`idDireccion`)
    ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- propiedad
--   CAMBIOS: eliminada dirección aplanada, servicios aplanados,
--            propiedadFotos, propiedadCodigo.
--            Agregado: arrendador_idArrendador (FK), direccion_idDireccion (FK).
--            propiedadEstatus ENUM actualizado.
--            propiedadLugares como INT, propiedadPrecio como DECIMAL.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbBurroomies`.`propiedad` (
  `idPropiedad`           INT            NOT NULL AUTO_INCREMENT,
  `propiedadTitulo`       VARCHAR(45)    CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NOT NULL,
  `propiedadDescripcion`  VARCHAR(300)   CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NOT NULL,
  `propiedadTipo`         VARCHAR(45)    CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NOT NULL,
  `propiedadLugares`      INT            NOT NULL,
  `propiedadPrecio`       DECIMAL(10,2)  NOT NULL,
  `propiedadEstatus`      ENUM('Disponible', 'Sin Disponibilidad', 'Desactivada')
                          CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NULL DEFAULT 'Disponible',
  `propiedadFechaRegis`   DATETIME       NOT NULL,
  `direccion_idDireccion` INT            NOT NULL,
  `arrendador_idArrendador` INT          NOT NULL,
  PRIMARY KEY (`idPropiedad`),
  INDEX `fk_propiedad_direccion1_idx`   (`direccion_idDireccion`   ASC),
  INDEX `fk_propiedad_arrendador1_idx`  (`arrendador_idArrendador` ASC),
  CONSTRAINT `fk_propiedad_direccion1`
    FOREIGN KEY (`direccion_idDireccion`)
    REFERENCES `dbBurroomies`.`direccion` (`idDireccion`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_propiedad_arrendador1`
    FOREIGN KEY (`arrendador_idArrendador`)
    REFERENCES `dbBurroomies`.`arrendador` (`idArrendador`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- fotos
--   CAMBIOS: fotosURL ampliado a MEDIUMTEXT para Base64 temporal.
--            Cuando se migre a almacenamiento externo vuelve a VARCHAR(500).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbBurroomies`.`fotos` (
  `idFotos`               INT          NOT NULL AUTO_INCREMENT,
  `fotosURL`              MEDIUMTEXT   NULL DEFAULT NULL,
  `propiedad_idPropiedad` INT          NOT NULL,
  PRIMARY KEY (`idFotos`),
  INDEX `fk_fotos_propiedad_idx` (`propiedad_idPropiedad` ASC),
  CONSTRAINT `fk_fotos_propiedad`
    FOREIGN KEY (`propiedad_idPropiedad`)
    REFERENCES `dbBurroomies`.`propiedad` (`idPropiedad`)
    ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- favoritos
--   CAMBIOS: PK renombrado idFavoritos (mayúscula, consistencia).
--            favoritosFechaAgregar con DEFAULT NOW().
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbBurroomies`.`favoritos` (
  `idFavoritos`                INT      NOT NULL AUTO_INCREMENT,
  `favoritosFechaAgregar`      DATETIME NULL DEFAULT NULL,
  `propiedad_idPropiedad`      INT      NOT NULL,
  `arrendatario_idArrendatario` INT     NOT NULL,
  PRIMARY KEY (`idFavoritos`),
  UNIQUE INDEX `uq_favorito` (`arrendatario_idArrendatario` ASC, `propiedad_idPropiedad` ASC),
  INDEX `fk_favoritos_propiedad1_idx`    (`propiedad_idPropiedad`      ASC),
  INDEX `fk_favoritos_arrendatario1_idx` (`arrendatario_idArrendatario` ASC),
  CONSTRAINT `fk_favoritos_propiedad1`
    FOREIGN KEY (`propiedad_idPropiedad`)
    REFERENCES `dbBurroomies`.`propiedad` (`idPropiedad`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_favoritos_arrendatario1`
    FOREIGN KEY (`arrendatario_idArrendatario`)
    REFERENCES `dbBurroomies`.`arrendatario` (`idArrendatario`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- arrendamiento
--   CAMBIOS: Agregado arrendatario_idArrendatario (FK).
--            arrendamientoValResena agregado.
--            Eliminada referencia inversa desde arrendatario.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbBurroomies`.`arrendamiento` (
  `idArrendamiento`             INT          NOT NULL AUTO_INCREMENT,
  `arrendamientoFechaInicio`    DATETIME     NULL DEFAULT NULL,
  `arrendamientoRenta`          FLOAT        NULL DEFAULT NULL,
  `arrendamientoDescrip`        VARCHAR(300) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NULL DEFAULT NULL,
  `arrendamientoValEstudiante`  TINYINT      NULL DEFAULT 0,
  `arrendamientoValArrendador`  TINYINT      NULL DEFAULT 0,
  `arrendamientoValResena`      TINYINT      NULL DEFAULT 0,
  `arrendatario_idArrendatario` INT          NOT NULL,
  `propiedad_idPropiedad`       INT          NOT NULL,
  PRIMARY KEY (`idArrendamiento`),
  INDEX `fk_arrendamiento_arrendatario1_idx` (`arrendatario_idArrendatario` ASC),
  INDEX `fk_arrendamiento_propiedad1_idx`    (`propiedad_idPropiedad`       ASC),
  CONSTRAINT `fk_arrendamiento_arrendatario1`
    FOREIGN KEY (`arrendatario_idArrendatario`)
    REFERENCES `dbBurroomies`.`arrendatario` (`idArrendatario`)
    ON DELETE RESTRICT,
  CONSTRAINT `fk_arrendamiento_propiedad1`
    FOREIGN KEY (`propiedad_idPropiedad`)
    REFERENCES `dbBurroomies`.`propiedad` (`idPropiedad`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- resena  (sin cambios estructurales)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbBurroomies`.`resena` (
  `idResena`                   INT           NOT NULL AUTO_INCREMENT,
  `resenaFechaCreacion`        DATETIME      NULL DEFAULT NULL,
  `resenaDuracionRenta`        INT           NULL DEFAULT NULL,
  `resenaDescrip`              VARCHAR(300)  CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NOT NULL,
  `resenaCalSerBasic`          DECIMAL(2,1)  NULL,
  `resenaCalSerComEnt`         DECIMAL(2,1)  NULL,
  `resenaCalSerAdicio`         DECIMAL(2,1)  NULL,
  `resenaCalGen`               DECIMAL(2,1)  NOT NULL,
  `resenaSentimiento`          VARCHAR(45)   NULL DEFAULT NULL,
  `propiedad_idPropiedad`      INT           NOT NULL,
  `arrendatario_idArrendatario` INT          NOT NULL,
  PRIMARY KEY (`idResena`),
  INDEX `fk_resena_propiedad1_idx`    (`propiedad_idPropiedad`      ASC),
  INDEX `fk_resena_arrendatario1_idx` (`arrendatario_idArrendatario` ASC),
  CONSTRAINT `fk_resena_arrendatario1`
    FOREIGN KEY (`arrendatario_idArrendatario`)
    REFERENCES `dbBurroomies`.`arrendatario` (`idArrendatario`)
    ON DELETE RESTRICT,
  CONSTRAINT `fk_resena_propiedad1`
    FOREIGN KEY (`propiedad_idPropiedad`)
    REFERENCES `dbBurroomies`.`propiedad` (`idPropiedad`)
    ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- servicio  (sin cambios)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbBurroomies`.`servicio` (
  `idServicio`        INT          NOT NULL AUTO_INCREMENT,
  `servicioNombre`    VARCHAR(100) NOT NULL,
  `servicioCategoria` ENUM('Basico', 'Entretenimiento', 'Adicional') NOT NULL,
  PRIMARY KEY (`idServicio`),
  UNIQUE INDEX `servicioNombre` (`servicioNombre` ASC)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- servicio_has_propiedad  (sin cambios)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dbBurroomies`.`servicio_has_propiedad` (
  `servicio_idServicio`   INT NOT NULL,
  `propiedad_idPropiedad` INT NOT NULL,
  PRIMARY KEY (`servicio_idServicio`, `propiedad_idPropiedad`),
  INDEX `fk_servicio_has_propiedad_propiedad1_idx` (`propiedad_idPropiedad` ASC),
  INDEX `fk_servicio_has_propiedad_servicio1_idx`  (`servicio_idServicio`   ASC),
  CONSTRAINT `fk_servicio_has_propiedad_propiedad1`
    FOREIGN KEY (`propiedad_idPropiedad`)
    REFERENCES `dbBurroomies`.`propiedad` (`idPropiedad`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_servicio_has_propiedad_servicio1`
    FOREIGN KEY (`servicio_idServicio`)
    REFERENCES `dbBurroomies`.`servicio` (`idServicio`)
    ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


-- ============================================================
-- NOTA: Los datos semilla (servicios, unidades académicas,
-- carreras y CP permitidos) están en db_vivienda_upalm_datos_v2.sql
-- Ejecutar ese archivo DESPUÉS de cargar el catálogo SEPOMEX.
-- ============================================================
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
