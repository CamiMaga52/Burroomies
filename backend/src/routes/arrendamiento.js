//FUNCIONAMIENTO:
// Define las rutas para las operaciones relacionadas con los arrendamientos. Incluye rutas para crear un arrendamiento, obtener el arrendamiento actual de un arrendatario, obtener los arrendamientos de un arrendador y terminar un arrendamiento.
// Utiliza middlewares de autenticación para proteger las rutas y asegurar que solo los usuarios autorizados puedan acceder a ellas (por ejemplo, solo los arrendadores pueden crear arrendamientos, solo los arrendatarios pueden ver su arrendamiento actual, etc.).
// Exporta el router para usarlo en el archivo principal de la aplicación (app.js).

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