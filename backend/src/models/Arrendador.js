const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Arrendador = sequelize.define('Arrendador', {
  idArrendador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  arrendadorCalle: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  arrendadorNumExt: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  arrendadorNumInt: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  arrendadorColonia: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  arrendadorMunicipio: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  arrendadorEstado: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  arrendadorCp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  usuario_idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuario',
      key: 'idUsuario',
    },
  },
}, {
  tableName: 'arrendador',
  timestamps: false,
})

module.exports = Arrendador