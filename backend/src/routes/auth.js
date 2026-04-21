//FUNCIONAMIENTO:
// Define las rutas para las operaciones relacionadas con la autenticación y gestión de usuarios. Incluye rutas para registrar un nuevo usuario, iniciar sesión, verificar el correo electrónico, reenviar el código de verificación, recuperar contraseña, restablecer contraseña, verificar el código de restablecimiento, obtener el perfil del usuario, actualizar el perfil y cambiar la contraseña.
// Utiliza middlewares de autenticación para proteger las rutas que requieren que el usuario esté logueado (por ejemplo, obtener perfil, actualizar perfil, cambiar contraseña).
// Exporta el router para usarlo en el archivo principal de la aplicación (app.js).

const router = require('express').Router()
const { authMiddleware } = require('../middlewares/auth')
const {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
  verifyResetCode,
  getProfile,
  updateProfile,
  changePassword,
} = require('../controllers/authController')

// Rutas públicas
router.post('/register',             register)
router.post('/login',                login)
router.get('/verify/:codigo',        verifyEmail)
router.post('/resend-verification',  resendVerificationCode)
router.post('/forgot-password',      forgotPassword)
router.post('/reset-password',       resetPassword)
router.post('/verify-reset-code',    verifyResetCode)

// Rutas protegidas
router.get('/profile',               authMiddleware, getProfile)
router.put('/profile',               authMiddleware, updateProfile)
router.put('/change-password',       authMiddleware, changePassword)

module.exports = router