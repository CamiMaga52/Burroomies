const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,    // ← agrega esta línea
    dialect: 'mysql',
    logging: false, // cambiar a console.log para ver queries en desarrollo
  }
)

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Conexión a MySQL establecida correctamente')

    // Sincroniza modelos con la BD (no elimina datos)
    await sequelize.sync({ alter: false })
    console.log('✅ Modelos sincronizados con la base de datos')
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error.message)
    process.exit(1)
  }
}

module.exports = { sequelize, connectDB }