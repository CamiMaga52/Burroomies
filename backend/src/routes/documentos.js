// backend/src/routes/documentos.js
const express = require('express')
const router  = express.Router()
const { validarConstancia, validarCurp } = require('../controllers/documentoController')

router.post('/validar-constancia', validarConstancia)
router.post('/validar-curp',       validarCurp)

module.exports = router