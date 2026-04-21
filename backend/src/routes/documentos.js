// backend/src/routes/documentos.js

//FUNCIONAMIENTO:
// Define las rutas para las operaciones relacionadas con la validación de documentos. Incluye rutas para validar la constancia de estudios y la CURP de un usuario.
// Exporta el router para usarlo en el archivo principal de la aplicación (app.js).


const express = require('express')
const router  = express.Router()
const { validarConstancia, validarCurp } = require('../controllers/documentoController')

router.post('/validar-constancia', validarConstancia)
router.post('/validar-curp',       validarCurp)

module.exports = router