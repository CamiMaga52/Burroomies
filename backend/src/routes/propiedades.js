//FUNCIONAMIENTO:
// Define las rutas para las operaciones relacionadas con las propiedades. Incluye rutas para obtener todas las propiedades, obtener una propiedad por ID, obtener las propiedades de un arrendador, crear una nueva propiedad, actualizar una propiedad existente y eliminar una propiedad.
// Utiliza middlewares de autenticación para proteger las rutas que requieren que el usuario sea un arrendador (por ejemplo, crear, actualizar, eliminar propiedades).
// Exporta el router para usarlo en el archivo principal de la aplicación (app.js).

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