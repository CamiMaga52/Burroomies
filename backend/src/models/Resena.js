const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Resena = sequelize.define('Resena', {
  idResena: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  resenaFechaCreacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  resenaDuracionRenta: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  resenaDescrip: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  resenaCalSerBasic: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  resenaCalSerComEnt: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  resenaCalSerAdicio: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  resenaCalGen: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  // ── ML: sentimiento analizado automáticamente ──────────────────
  resenaSentimiento: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: null,
    comment: 'Valores: positivo | neutral | negativo — generado por Naive Bayes'
  },
  arrendatario_idArrendatario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'arrendatario',
      key: 'idArrendatario',
    },
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
  tableName: 'resena',
  timestamps: false,
})

module.exports = Resena