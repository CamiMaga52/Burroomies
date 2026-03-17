const router = require('express').Router()
const { authMiddleware, isArrendador } = require('../middlewares/auth')
const {
  getPropiedades,
  getPropiedadById,
  getMisPropiedades,
  createPropiedad,
  updatePropiedad,
  deletePropiedad,
} = require('../controllers/propiedadController')

// Públicas
router.get('/',     getPropiedades)
router.get('/:id',  getPropiedadById)

// Privadas (arrendador)
router.get('/arrendador/mis-propiedades', authMiddleware, isArrendador, getMisPropiedades)
router.post('/',        authMiddleware, isArrendador, createPropiedad)
router.put('/:id',      authMiddleware, isArrendador, updatePropiedad)
router.delete('/:id',   authMiddleware, isArrendador, deletePropiedad)

module.exports = router