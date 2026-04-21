//FUNCIONAMIENTO:
// Controlador para manejar operaciones relacionadas con propiedades.
// Define funciones para obtener todas las propiedades (con filtros), obtener una propiedad por ID, obtener mis propiedades (arrendador), crear, actualizar y eliminar propiedades.
// La función de creación de propiedad incluye validación del código postal usando una lista local y la API de COPOMEX para asegurar que la propiedad esté en una zona autorizada cercana al IPN/UPALM.
// Utiliza los modelos de Propiedad, Arrendador, Arrendatario, Usuario y Resena para interactuar con la base de datos.

const { Propiedad, Arrendador, Arrendatario, Usuario, Resena } = require('../models')
const { Op } = require('sequelize')

// Códigos postales autorizados (colindantes a UPALM)
const CP_AUTORIZADOS = [
  '07738', '07360', '07311', '07700', '07340',
  '07350', '07300', '07370', '07040', '07320',
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

    // ── Validar zona con COPOMEX (RN_02) ──────────────────────────
    const cp = String(req.body.propiedadCp || '').trim()
    if (!cp) {
      return res.status(400).json({ message: 'El código postal es obligatorio.' })
    }

    // Primero verificar lista local (más eficiente y confiable)
    if (!CP_AUTORIZADOS.includes(cp)) {
      // CP no está en zona autorizada — consultar COPOMEX para obtener municipio
      try {
        const copomexRes = await fetch(
          `https://api.copomex.com/query/info_cp/${cp}?type=simplified&token=${process.env.COPOMEX_TOKEN}`
        )
        const copomexData = await copomexRes.json()
        const municipio = copomexData.response?.municipio || copomexData.municipio || ''
        return res.status(400).json({
          message: `La propiedad en ${municipio || 'esa zona'} (CP: ${cp}) no está dentro de la zona autorizada cercana al IPN/UPALM.`
        })
      } catch {
        return res.status(400).json({
          message: `El código postal ${cp} no está dentro de la zona autorizada cercana al IPN/UPALM.`
        })
      }
    }

    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase()

    // Sanitizar campos que COPOMEX puede enviar como array
    const body = { ...req.body }
    if (Array.isArray(body.propiedadColonia)) body.propiedadColonia = body.propiedadColonia[0] || ''
    if (Array.isArray(body.propiedadMunicipio)) body.propiedadMunicipio = body.propiedadMunicipio[0] || ''
    if (Array.isArray(body.propiedadEstado)) body.propiedadEstado = body.propiedadEstado[0] || ''

    const propiedad = await Propiedad.create({
      ...body,
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