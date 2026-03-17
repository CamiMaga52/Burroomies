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