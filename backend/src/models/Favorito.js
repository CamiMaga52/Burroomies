const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Favorito = sequelize.define('Favorito', {
  idFavorito: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  arrendatario_idArrendatario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  propiedad_idPropiedad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'favoritos',
  timestamps: false,
})

module.exports = Favorito