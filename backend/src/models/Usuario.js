//FUNCIONAMIENTO:
// Define el modelo de Usuario usando Sequelize. Incluye campos para ID, nombre, apellidos, correo electrónico, teléfono, CURP, usuario, contraseña, fecha de nacimiento, fecha de registro, código de verificación, fecha de última sesión, datos de tarjeta de crédito y foto.
// El campo idUsuario es la clave primaria y se autoincrementa. El campo usuarioCorreo es único y no puede ser nulo. El campo usuarioContra almacena la contraseña hasheada.
// Exporta el modelo para usarlo en otros archivos (como en controladores de autenticación).

const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Usuario = sequelize.define('Usuario', {
  idUsuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuarioNom: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  usuarioApePat: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  usuarioApeMat: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  usuarioCorreo: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true,
  },
  usuarioTel: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  usuarioCurp: {
    type: DataTypes.STRING(45),
    allowNull: true,
    unique: true,
  },
  usuarioUser: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  usuarioContra: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  usuarioFechaNac: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  usuarioFechaRegis: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  usuarioCodigo: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  usuarioFechaUIS: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  usuarioCC: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  usuarioVCC: {
    type: DataTypes.STRING(45),
    defaultValue: '0',
  },
  usuarioFCC: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  usuarioFoto: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
}, {
  tableName: 'usuario',
  timestamps: false,
})

module.exports = Usuario