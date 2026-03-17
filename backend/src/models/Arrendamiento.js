const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Arrendamiento = sequelize.define('Arrendamiento', {
  idArrendamiento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  arrendamientoFechaInicio: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  arrendamientoRenta: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  arrendamientoDescrip: {
    type: DataTypes.STRING(300),
    allowNull: true,
  },
  arrendamientoValEstudiante: {
    type: DataTypes.STRING(45),
    defaultValue: '0',
  },
  arrendamientoValArrendador: {
    type: DataTypes.STRING(45),
    defaultValue: '0',
  },
  propiedad_idPropiedad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'propiedad',
      key: 'idPropiedad',
    },
  },
}, {
  tableName: 'arrendamiento',
  timestamps: false,
})

module.exports = Arrendamiento