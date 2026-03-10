const express = require('express')
const cors    = require('cors')
require('dotenv').config()

const app = express()

// ── Middlewares ──
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Rutas ──
app.use('/api/auth',        require('./routes/auth'))
app.use('/api/propiedades', require('./routes/propiedades'))
app.use('/api/arrendamientos', require('./routes/arrendamiento'))
app.use('/api/resenas',     require('./routes/resenas'))

// ── Ruta de prueba ──
app.get('/', (req, res) => {
  res.json({ message: '🐰 Burroomies API funcionando correctamente' })
})

// ── Manejo de errores global ──
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Error interno del servidor' })
})

// ── Iniciar servidor ──
const PORT = process.env.PORT || 3001

app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)

  // Conectar a la base de datos
  const { connectDB } = require('./config/database')
  await connectDB()
})

module.exports = app