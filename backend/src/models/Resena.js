//FUNCIONAMIENTO:
// Define el modelo de Resena usando Sequelize. Incluye campos para ID, fecha de creación, duración de renta, descripción, calificaciones (servicios básicos, comunes/entretenimiento, adicionales y general), sentimiento analizado automáticamente, y referencias al arrendatario y propiedad asociados.
// El campo idResena es la clave primaria y se autoincrementa. El campo resenaDescrip es obligatorio. El campo resenaSentimiento almacena el resultado del análisis de sentimientos (positivo, neutral o negativo) generado por un modelo Naive Bayes.
// Exporta el modelo para usarlo en otros archivos (como en controladores de reseñas).

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