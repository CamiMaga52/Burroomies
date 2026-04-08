const router = require('express').Router()
const { authMiddleware, isArrendatario } = require('../middlewares/auth')
const { getFavoritos, addFavorito, removeFavorito } = require('../controllers/favoritoController')

router.get('/',                 authMiddleware, isArrendatario, getFavoritos)
router.post('/:idPropiedad',    authMiddleware, isArrendatario, addFavorito)
router.delete('/:idPropiedad',  authMiddleware, isArrendatario, removeFavorito)

module.exports = router