//FUNCIONAMIENTO:
// Define el modelo de Arrendatario usando Sequelize. Incluye campos para ID, apodo, boleta, unidad académica, fecha de actualización, referencia al usuario asociado y referencia al arrendamiento.
// El campo idArrendatario es la clave primaria y se autoincrementa. El campo arrendatarioApodo es único y no puede ser nulo. El campo usuario_idUsuario es una clave foránea que referencia al modelo Usuario. El campo arrendamiento_idArrendamiento es una clave foránea que referencia al modelo Arrendamiento (puede ser nula).
// Exporta el modelo para usarlo en otros archivos (como en controladores de arrendamiento y autenticación).

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