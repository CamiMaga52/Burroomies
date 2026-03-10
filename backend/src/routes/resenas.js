const router = require('express').Router()
const { authMiddleware, isArrendatario } = require('../middlewares/auth')
const {
  getResenasByPropiedad,
  createResena,
} = require('../controllers/resenaController')

router.get('/propiedad/:idPropiedad', getResenasByPropiedad)
router.post('/', authMiddleware, isArrendatario, createResena)

module.exports = router