const { Propiedad, Arrendador, Arrendatario, Usuario, Resena } = require('../models')
const { Op } = require('sequelize')

// Códigos postales autorizados (colindantes a UPALM)
const CP_AUTORIZADOS = [
  '07300', '07310', '07320', '07330', '07340',
  '07350', '07360', '07370', '07400', '07410',
  '07420', '07430', '07440', '07450', '07460',
]

// ── Obtener todas las propiedades (con filtros) ───────────────────
const getPropiedades = async (req, res) => {
  try {
    const { tipo, precio_max, precio_min, ocupacion, query } = req.query

    const where = { propiedadEstatus: 'Activa' }

    if (tipo)       where.propiedadTipo   = tipo
    if (query)      where.propiedadTitulo = { [Op.like]: `%${query}%` }
    if (precio_max) where.propiedadPrecio = { ...where.propiedadPrecio, [Op.lte]: precio_max }
    if (precio_min) where.propiedadPrecio = { ...where.propiedadPrecio, [Op.gte]: precio_min }

    const propiedades = await Propiedad.findAll({
      where,
      include: [
        {
          model: Arrendador,
          include: [{ model: Usuario, attributes: ['usuarioNom', 'usuarioApePat', 'usuarioTel', 'usuarioCorreo', 'usuarioFoto'] }]
        },
        { model: Resena, attributes: ['resenaCalGen'] }
      ],
      order: [['propiedadFechaRegis', 'DESC']],
    })

    res.json(propiedades)
  } catch (error) {
    console.error('Error en getPropiedades:', error)
    res.status(500).json({ message: 'Error al obtener propiedades.' })
  }
}

// ── Obtener propiedad por ID ──────────────────────────────────────
const getPropiedadById = async (req, res) => {
  try {
    const propiedad = await Propiedad.findByPk(req.params.id, {
      include: [
        {
          model: Arrendador,
          include: [{ model: Usuario, attributes: ['usuarioNom', 'usuarioApePat', 'usuarioTel', 'usuarioCorreo', 'usuarioFoto'] }]
        },
        {
          model: Resena,
          include: [{
            model: Arrendatario,
            include: [{ model: Usuario, attributes: ['usuarioNom', 'usuarioApePat', 'usuarioFoto'] }]
          }]
        }
      ]
    })

    if (!propiedad) {
      return res.status(404).json({ message: 'Propiedad no encontrada.' })
    }

    res.json(propiedad)
  } catch (error) {
    console.error('Error en getPropiedadById:', error)
    res.status(500).json({ message: 'Error al obtener la propiedad.' })
  }
}

// ── Obtener mis propiedades (arrendador) ─────────────────────────
const getMisPropiedades = async (req, res) => {
  try {
    const arrendador = await Arrendador.findOne({ where: { usuario_idUsuario: req.user.idUsuario } })
    if (!arrendador) return res.status(404).json({ message: 'Arrendador no encontrado.' })

    const propiedades = await Propiedad.findAll({
      where: { arrendador_idArrendador: arrendador.idArrendador },
      order: [['propiedadFechaRegis', 'DESC']],
    })

    res.json(propiedades)
  } catch (error) {
    console.error('Error en getMisPropiedades:', error)
    res.status(500).json({ message: 'Error al obtener tus propiedades.' })
  }
}

// ── Crear propiedad ───────────────────────────────────────────────
const createPropiedad = async (req, res) => {
  try {
    const arrendador = await Arrendador.findOne({ where: { usuario_idUsuario: req.user.idUsuario } })
    if (!arrendador) return res.status(404).json({ message: 'Arrendador no encontrado.' })

    // Verificar límite de 3 propiedades (RN_06)
    const total = await Propiedad.count({ where: { arrendador_idArrendador: arrendador.idArrendador } })
    if (total >= 3) {
      return res.status(400).json({ message: 'Has alcanzado el límite de 3 propiedades en fase de pruebas.' })
    }

    // Validar código postal autorizado (RN_02)
    const cp = String(req.body.propiedadColonia) // ajustar según tu campo CP
    // TODO: validar CP contra CP_AUTORIZADOS

    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase()

    const propiedad = await Propiedad.create({
      ...req.body,
      arrendador_idArrendador: arrendador.idArrendador,
      propiedadCodigo: codigo,
      propiedadEstatus: 'Activa',
    })

    res.status(201).json({ message: 'Propiedad creada correctamente.', propiedad })
  } catch (error) {
    console.error('Error en createPropiedad:', error)
    res.status(500).json({ message: 'Error al crear la propiedad.' })
  }
}

// ── Actualizar propiedad ──────────────────────────────────────────
const updatePropiedad = async (req, res) => {
  try {
    const arrendador = await Arrendador.findOne({ where: { usuario_idUsuario: req.user.idUsuario } })
    const propiedad  = await Propiedad.findOne({
      where: { idPropiedad: req.params.id, arrendador_idArrendador: arrendador.idArrendador }
    })

    if (!propiedad) return res.status(404).json({ message: 'Propiedad no encontrada.' })

    await propiedad.update(req.body)
    res.json({ message: 'Propiedad actualizada correctamente.' })
  } catch (error) {
    console.error('Error en updatePropiedad:', error)
    res.status(500).json({ message: 'Error al actualizar la propiedad.' })
  }
}

// ── Eliminar propiedad ────────────────────────────────────────────
const deletePropiedad = async (req, res) => {
  try {
    const arrendador = await Arrendador.findOne({ where: { usuario_idUsuario: req.user.idUsuario } })
    const propiedad  = await Propiedad.findOne({
      where: { idPropiedad: req.params.id, arrendador_idArrendador: arrendador.idArrendador }
    })

    if (!propiedad) return res.status(404).json({ message: 'Propiedad no encontrada.' })

    await propiedad.update({ propiedadEstatus: 'Inactiva' })
    res.json({ message: 'Propiedad eliminada correctamente.' })
  } catch (error) {
    console.error('Error en deletePropiedad:', error)
    res.status(500).json({ message: 'Error al eliminar la propiedad.' })
  }
}

module.exports = { getPropiedades, getPropiedadById, getMisPropiedades, createPropiedad, updatePropiedad, deletePropiedad }