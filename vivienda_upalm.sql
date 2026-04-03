SELECT * FROM stock WHERE nombre LIKE '%Mouse%';
SELECT id_articulo, nombre, descripcion, precio, cantidad 
FROM stock 
WHERE nombre LIKE '%Mouse%' OR descripcion LIKE '%Mouse%';

SELECT id_articulo, cantidad FROM stock WHERE id_articulo = 1;

SELECT * FROM carrito_compra;
SELECT * FROM carrito_compra;
SELECT cantidad FROM stock WHERE id_articulo = 1;

describe foto_usuarios;
SHOW TABLES;
DESCRIBE fotos_usuarios;
DESCRIBE usuarios;
ALTER TABLE usuarios MODIFY genero VARCHAR(10);
ALTER TABLE usuarios MODIFY genero VARCHAR(20);

ALTER TABLE vivienda_upalm.arrendatario 
ADD COLUMN arrendatarioApodo VARCHAR(45) NULL;
UPDATE vivienda_upalm.arrendatario 
SET arrendatarioApodo = CONCAT('usuario_', idArrendatario) 
WHERE arrendatarioApodo IS NULL;
ALTER TABLE vivienda_upalm.arrendatario 
MODIFY COLUMN arrendatarioApodo VARCHAR(45) NOT NULL UNIQUE;

SET SQL_SAFE_UPDATES = 0;

UPDATE vivienda_upalm.arrendatario 
SET arrendatarioApodo = CONCAT('usuario_', idArrendatario);

ALTER TABLE vivienda_upalm.arrendatario 
MODIFY COLUMN arrendatarioApodo VARCHAR(45) NOT NULL UNIQUE;

SET SQL_SAFE_UPDATES = 1;