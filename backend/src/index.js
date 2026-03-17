const express = require('express')
const cors    = require('cors')
require('dotenv').config()

const app = express()

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ── Middlewares ──
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Rutas ──
app.use('/api/auth',        require('./routes/auth'))
app.use('/api/propiedades', require('./routes/propiedades'))
app.use('/api/arrendamientos', require('./routes/arrendamiento'))
app.use('/api/resenas',     require('./routes/resenas'))
app.use('/api/documentos',  require('./routes/documentos'))

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