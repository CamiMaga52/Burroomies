// ─────────────────────────────────────────
//  models/index.js — Asociaciones entre modelos
// ─────────────────────────────────────────

const Usuario      = require('./Usuario')
const Arrendador   = require('./Arrendador')
const Arrendatario = require('./Arrendatario')
const Propiedad    = require('./Propiedad')
const Arrendamiento = require('./Arrendamiento')
const Resena       = require('./Resena')
const Administrador = require('./Administrador')
const Favorito = require('./Favorito')

// ── Usuario → Arrendador (1:1) ──
Usuario.hasOne(Arrendador,    { foreignKey: 'usuario_idUsuario' })
Arrendador.belongsTo(Usuario, { foreignKey: 'usuario_idUsuario' })

// ── Usuario → Arrendatario (1:1) ──
Usuario.hasOne(Arrendatario,    { foreignKey: 'usuario_idUsuario' })
Arrendatario.belongsTo(Usuario, { foreignKey: 'usuario_idUsuario' })

// ── Arrendador → Propiedad (1:N) ──
Arrendador.hasMany(Propiedad,    { foreignKey: 'arrendador_idArrendador' })
Propiedad.belongsTo(Arrendador,  { foreignKey: 'arrendador_idArrendador' })

// ── Propiedad → Arrendamiento (1:1) ──
Propiedad.hasOne(Arrendamiento,      { foreignKey: 'propiedad_idPropiedad' })
Arrendamiento.belongsTo(Propiedad,   { foreignKey: 'propiedad_idPropiedad' })

// ── Arrendamiento → Arrendatario (1:1) ──
Arrendamiento.hasOne(Arrendatario,       { foreignKey: 'arrendamiento_idArrendamiento' })
Arrendatario.belongsTo(Arrendamiento,    { foreignKey: 'arrendamiento_idArrendamiento' })

// ── Arrendatario → Resena (1:N) ──
Arrendatario.hasMany(Resena,    { foreignKey: 'arrendatario_idArrendatario' })
Resena.belongsTo(Arrendatario,  { foreignKey: 'arrendatario_idArrendatario' })

// ── Propiedad → Resena (1:N) ──
Propiedad.hasMany(Resena,   { foreignKey: 'propiedad_idPropiedad' })
Resena.belongsTo(Propiedad, { foreignKey: 'propiedad_idPropiedad' })

Favorito.belongsTo(Arrendatario, { foreignKey: 'arrendatario_idArrendatario' })
Arrendatario.hasMany(Favorito,   { foreignKey: 'arrendatario_idArrendatario' })

Favorito.belongsTo(Propiedad,    { foreignKey: 'propiedad_idPropiedad' })
Propiedad.hasMany(Favorito,      { foreignKey: 'propiedad_idPropiedad' })

module.exports = {
  Usuario,
  Arrendador,
  Arrendatario,
  Propiedad,
  Arrendamiento,
  Resena,
  Administrador,
  Favorito,
}