//FUNCIONAMIENTO:
// Define el modelo de Administrador usando Sequelize. Incluye campos para ID, usuario, contraseña y fecha de inicio de sesión.
// El campo idAdministrador es la clave primaria y se autoincrementa. El campo administradorUser es único y no puede ser nulo. El campo administradorContra almacena la contraseña hasheada.
// Exporta el modelo para usarlo en otros archivos (como en controladores de autenticación).

const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Administrador = sequelize.define('Administrador', {
  idAdministrador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  administradorUser: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true,
  },
  administradorContra: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  administradorFechaInicioSesion: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'administrador',
  timestamps: false,
})

module.exports = Administrador