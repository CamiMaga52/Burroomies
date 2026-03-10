const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado.' })
  }
}

const isArrendador = (req, res, next) => {
  if (req.user.rol !== 'arrendador') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de arrendador.' })
  }
  next()
}

const isArrendatario = (req, res, next) => {
  if (req.user.rol !== 'arrendatario') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de arrendatario.' })
  }
  next()
}

const isAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' })
  }
  next()
}

module.exports = { authMiddleware, isArrendador, isArrendatario, isAdmin }