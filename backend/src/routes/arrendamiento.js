const router = require('express').Router()
const { authMiddleware, isArrendador, isArrendatario } = require('../middlewares/auth')
const {
  createArrendamiento,
  getMiArrendamiento,
  getMisArrendamientos,
  terminarArrendamiento,
} = require('../controllers/arrendamientoController')

router.post('/',                  authMiddleware, isArrendador,   createArrendamiento)
router.get('/mi-arrendamiento',   authMiddleware, isArrendatario, getMiArrendamiento)
router.get('/mis-arrendamientos', authMiddleware, isArrendador,   getMisArrendamientos)
router.put('/:id/terminar',       authMiddleware,                 terminarArrendamiento)

module.exports = router