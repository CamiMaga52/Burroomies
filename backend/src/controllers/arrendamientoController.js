//FUNCIONAMIENTO:
// Controlador para manejar operaciones relacionadas con arrendamientos.
// Define funciones para registrar un nuevo arrendamiento (solo arrendadores), ver el arrendamiento actual (arrendatarios) y ver los arrendamientos activos (arrendadores).
// También incluye una función para terminar un arrendamiento, que requiere confirmación de ambas partes (arrendatario y arrendador).
// Utiliza los modelos de Arrendamiento, Arrendatario, Propiedad, Arrendador y Usuario para interactuar con la base de datos.

const { Arrendamiento, Arrendatario, Propiedad, Arrendador, Usuario } = require('../models')

// ── Registrar arrendamiento (arrendador) ─────────────────────────
const createArrendamiento = async (req, res) => {
  try {
    const { codigoEstudiante, codigoPropiedad, arrendamientoRenta, arrendamientoDescrip } = req.body

    // Buscar propiedad por código
    const propiedad = await Propiedad.findOne({ where: { propiedadCodigo: codigoPropiedad } })
    if (!propiedad) return res.status(404).json({ message: 'Propiedad no encontrada con ese código.' })

    // Buscar estudiante por código
    const usuarioEst = await Usuario.findOne({ where: { usuarioCodigo: codigoEstudiante } })
    if (!usuarioEst) return res.status(404).json({ message: 'Estudiante no encontrado con ese código.' })

    const arrendatario = await Arrendatario.findOne({ where: { usuario_idUsuario: usuarioEst.idUsuario } })
    if (!arrendatario) return res.status(404).json({ message: 'El usuario no es arrendatario.' })

    // Verificar que el arrendatario no tenga ya un arrendamiento activo (RN_17)
    if (arrendatario.arrendamiento_idArrendamiento) {
      return res.status(400).json({ message: 'El estudiante ya tiene un arrendamiento activo.' })
    }

    // Crear arrendamiento
    const arrendamiento = await Arrendamiento.create({
      arrendamientoFechaInicio: new Date(),
      arrendamientoRenta,
      arrendamientoDescrip,
      arrendamientoValEstudiante: '0',
      arrendamientoValArrendador: '0',
      propiedad_idPropiedad: propiedad.idPropiedad,
    })

    // Vincular arrendatario al arrendamiento
    await arrendatario.update({ arrendamiento_idArrendamiento: arrendamiento.idArrendamiento })

    res.status(201).json({ message: 'Arrendamiento registrado correctamente.', arrendamiento })
  } catch (error) {
    console.error('Error en createArrendamiento:', error)
    res.status(500).json({ message: 'Error al registrar el arrendamiento.' })
  }
}

// ── Ver mi arrendamiento actual (arrendatario) ───────────────────
const getMiArrendamiento = async (req, res) => {
  try {
    const arrendatario = await Arrendatario.findOne({ where: { usuario_idUsuario: req.user.idUsuario } })
    if (!arrendatario) return res.status(404).json({ message: 'Arrendatario no encontrado.' })

    if (!arrendatario.arrendamiento_idArrendamiento) {
      return res.status(404).json({ message: 'No tienes un arrendamiento activo.' })
    }

    const arrendamiento = await Arrendamiento.findByPk(arrendatario.arrendamiento_idArrendamiento, {
      include: [{
        model: Propiedad,
        include: [{
          model: Arrendador,
          include: [{ model: Usuario, attributes: ['usuarioNom', 'usuarioApePat', 'usuarioTel', 'usuarioCorreo', 'usuarioFoto'] }]
        }]
      }]
    })

    res.json(arrendamiento)
  } catch (error) {
    console.error('Error en getMiArrendamiento:', error)
    res.status(500).json({ message: 'Error al obtener el arrendamiento.' })
  }
}

// ── Ver arrendamientos activos (arrendador) ──────────────────────
const getMisArrendamientos = async (req, res) => {
  try {
    const arrendador = await Arrendador.findOne({ where: { usuario_idUsuario: req.user.idUsuario } })
    if (!arrendador) return res.status(404).json({ message: 'Arrendador no encontrado.' })

    // Buscar propiedades del arrendador que tengan arrendamiento activo
    const propiedades = await Propiedad.findAll({
      where: { arrendador_idArrendador: arrendador.idArrendador },
      include: [{
        model: Arrendamiento,
        include: [{
          model: Arrendatario,
          include: [{ model: Usuario, attributes: ['usuarioNom', 'usuarioApePat', 'usuarioCorreo', 'usuarioTel'] }]
        }]
      }]
    })

    // Aplanar: devolver solo los arrendamientos activos con info del arrendatario
    const lista = []
    propiedades.forEach(prop => {
      const arr = prop.Arrendamiento // hasOne → singular
      if (arr) {
        const arrendatario = arr.Arrendatario
        const usuario = arrendatario?.Usuario
        lista.push({
          idArrendamiento: arr.idArrendamiento,
          propiedadTitulo: prop.propiedadTitulo,
          idPropiedad: prop.idPropiedad,
          arrendatarioNombre: usuario
            ? `${usuario.usuarioNom} ${usuario.usuarioApePat}`
            : `Arrendatario ${arrendatario?.idArrendatario || ''}`,
          fechaInicio: arr.arrendamientoFechaInicio,
          precioAcordado: arr.arrendamientoRenta || 0,
          idArrendatario: arrendatario?.idArrendatario,
        })
      }
    })

    res.json(lista)
  } catch (error) {
    console.error('Error en getMisArrendamientos:', error)
    res.status(500).json({ message: 'Error al obtener los arrendamientos.' })
  }
}

// ── Terminar arrendamiento (ambos roles confirman) ───────────────
const terminarArrendamiento = async (req, res) => {
  try {
    const arrendamiento = await Arrendamiento.findByPk(req.params.id)
    if (!arrendamiento) return res.status(404).json({ message: 'Arrendamiento no encontrado.' })

    const { rol } = req.user

    if (rol === 'arrendatario') {
      await arrendamiento.update({ arrendamientoValEstudiante: '1' })
    } else if (rol === 'arrendador') {
      await arrendamiento.update({ arrendamientoValArrendador: '1' })
    }

    // Si ambos confirmaron, terminar el arrendamiento
    const actualizado = await Arrendamiento.findByPk(req.params.id)
    if (actualizado.arrendamientoValEstudiante === '1' && actualizado.arrendamientoValArrendador === '1') {
      // Desvincular arrendatario
      const arrendatario = await Arrendatario.findOne({
        where: { arrendamiento_idArrendamiento: arrendamiento.idArrendamiento }
      })
      if (arrendatario) await arrendatario.update({ arrendamiento_idArrendamiento: null })

      return res.json({ message: 'Arrendamiento terminado correctamente. Ya puedes dejar una reseña.' })
    }

    res.json({ message: 'Confirmación registrada. Esperando confirmación de la otra parte.' })
  } catch (error) {
    console.error('Error en terminarArrendamiento:', error)
    res.status(500).json({ message: 'Error al terminar el arrendamiento.' })
  }
}

module.exports = { createArrendamiento, getMiArrendamiento, getMisArrendamientos, terminarArrendamiento }