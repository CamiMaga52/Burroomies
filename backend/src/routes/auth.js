const router = require('express').Router()
const { authMiddleware } = require('../middlewares/auth')
const { verifyResetCode } = require('../controllers/authController')

const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
} = require('../controllers/authController')


// Rutas públicas
router.post('/register',        register)
router.post('/login',           login)
router.get('/verify/:codigo',   verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password',  resetPassword)
router.post('/verify-reset-code', verifyResetCode)

// Rutas protegidas
router.get('/profile',          authMiddleware, getProfile)
router.put('/profile',          authMiddleware, updateProfile)
router.put('/change-password',   authMiddleware, changePassword)

module.exports = router