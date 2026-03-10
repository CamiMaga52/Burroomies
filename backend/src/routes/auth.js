const router = require('express').Router()
const { authMiddleware } = require('../middlewares/auth')
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
} = require('../controllers/authController')

// Rutas públicas
router.post('/register',        register)
router.post('/login',           login)
router.get('/verify/:codigo',   verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password',  resetPassword)

// Rutas protegidas
router.get('/profile',          authMiddleware, getProfile)
router.put('/profile',          authMiddleware, updateProfile)

module.exports = router