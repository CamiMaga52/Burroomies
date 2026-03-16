const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Propiedad = sequelize.define('Propiedad', {
  idPropiedad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  propiedadTitulo: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  propiedadDescripcion: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  propiedadTipo: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  propiedadLugares: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  propiedadPrecio: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  propiedadCalle: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  propiedadNumExt: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  propiedadNumInt: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  propiedadColonia: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  propiedadMunicipio: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  propiedadEstado: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  propiedadCp: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  propiedadEstatus: {
    type: DataTypes.STRING(45),
    defaultValue: 'Activa',
  },
  propiedadFechaRegis: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  propiedadCodigo: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  propiedadSerBasicos: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  propiedadSerComEnt: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  propiedadSerAdicio: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  propiedadFotos: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  arrendador_idArrendador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'arrendador',
      key: 'idArrendador',
    },
  },
}, {
  tableName: 'propiedad',
  timestamps: false,
})

module.exports = Propiedad