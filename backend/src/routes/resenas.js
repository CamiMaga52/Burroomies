//FUNCIONAMIENTO:
// Define las rutas para las operaciones relacionadas con las reseñas. Incluye rutas para obtener las reseñas de una propiedad, crear una nueva reseña y obtener el análisis de sentimientos de una propiedad.
// Utiliza middlewares de autenticación para proteger la ruta de creación de reseñas, asegurando que solo los arrendatarios puedan crear reseñas.
// Exporta el router para usarlo en el archivo principal de la aplicación (app.js).

const router = require('express').Router()
const { authMiddleware, isArrendatario } = require('../middlewares/auth')
const { getResenasByPropiedad, createResena, getSentimientosPropiedad } = require('../controllers/resenaController')

router.get('/propiedad/:idPropiedad',       getResenasByPropiedad)
router.get('/sentimientos/:idPropiedad',    getSentimientosPropiedad)
router.post('/', authMiddleware, isArrendatario, createResena)

module.exports = router