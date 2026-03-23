const router = require('express').Router()
const { authMiddleware, isArrendatario } = require('../middlewares/auth')
const { getResenasByPropiedad, createResena, getSentimientosPropiedad } = require('../controllers/resenaController')

router.get('/propiedad/:idPropiedad',       getResenasByPropiedad)
router.get('/sentimientos/:idPropiedad',    getSentimientosPropiedad)
router.post('/', authMiddleware, isArrendatario, createResena)

module.exports = router