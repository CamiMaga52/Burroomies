const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Arrendatario = sequelize.define('Arrendatario', {
  idArrendatario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  arrendatarioApodo: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true,
  },
  arrendatarioBoleta: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  arrendatarioUnidadAca: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  arrendatarioFechaActua: {
    type: DataTypes.DATE,
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
  arrendamiento_idArrendamiento: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'arrendamiento',
      key: 'idArrendamiento',
    },
  },
}, {
  tableName: 'arrendatario',
  timestamps: false,
})

module.exports = Arrendatario