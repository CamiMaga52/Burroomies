const { Resena, Arrendatario, Propiedad, Usuario } = require('../models')
const { analizarSentimiento } = require('../utils/sentimiento')

// ── Obtener reseñas de una propiedad ─────────────────────────────
const getResenasByPropiedad = async (req, res) => {
  try {
    const resenas = await Resena.findAll({
      where: { propiedad_idPropiedad: req.params.idPropiedad },
      include: [
        {
          model: Arrendatario,
          include: [{ model: Usuario, attributes: ['usuarioNom', 'usuarioApePat'] }]
        }
      ],
      order: [['resenaFechaCreacion', 'DESC']],
    })

    res.json(resenas)
  } catch (error) {
    console.error('Error en getResenasByPropiedad:', error)
    res.status(500).json({ message: 'Error al obtener las reseñas.' })
  }
}

// ── Crear o actualizar reseña con análisis de sentimientos ───────
const createResena = async (req, res) => {
  try {
    const {
      resenaDescrip,
      resenaCalGen,
      resenaCalSerBasic,
      resenaCalSerComEnt,
      resenaCalSerAdicio,
      resenaDuracionRenta,
      propiedad_idPropiedad,
    } = req.body

    const arrendatario = await Arrendatario.findOne({ where: { usuario_idUsuario: req.user.idUsuario } })
    if (!arrendatario) return res.status(404).json({ message: 'Arrendatario no encontrado.' })

    // Solo puede reseñar si ya terminó su arrendamiento (RN_05)
    if (arrendatario.arrendamiento_idArrendamiento) {
      return res.status(400).json({ message: 'Solo puedes dejar una reseña después de terminar tu arrendamiento.' })
    }

    // ── Análisis de sentimientos con Naive Bayes ─────────────────
    const sentimiento = analizarSentimiento(resenaDescrip)
    console.log(`Sentimiento detectado: "${sentimiento}" para reseña: "${resenaDescrip.substring(0, 50)}..."`)

    const datosResena = {
      resenaDescrip,
      resenaCalGen,
      resenaCalSerBasic,
      resenaCalSerComEnt,
      resenaCalSerAdicio,
      resenaDuracionRenta,
      resenaFechaCreacion:         new Date(),
      resenaSentimiento:           sentimiento,
      arrendatario_idArrendatario: arrendatario.idArrendatario,
      propiedad_idPropiedad,
    }

    // Si ya existe una reseña de este arrendatario para esta propiedad
    // (rearrendamiento) → actualizarla en lugar de bloquear
    const resenaExistente = await Resena.findOne({
      where: {
        arrendatario_idArrendatario: arrendatario.idArrendatario,
        propiedad_idPropiedad,
      }
    })

    let resena
    if (resenaExistente) {
      await resenaExistente.update(datosResena)
      resena = resenaExistente
    } else {
      resena = await Resena.create(datosResena)
    }

    // ── Liberar la propiedad (último paso del flujo de finalización) ──
    await Propiedad.update(
      { propiedadEstatus: 'Activa' },
      { where: { idPropiedad: propiedad_idPropiedad } }
    )

    res.status(201).json({
      message:     resenaExistente ? 'Reseña actualizada correctamente.' : 'Reseña creada correctamente.',
      resena,
      sentimiento,
    })
  } catch (error) {
    console.error('Error en createResena:', error)
    res.status(500).json({ message: 'Error al crear la reseña.' })
  }
}

// ── Resumen de sentimientos de una propiedad ─────────────────────
const getSentimientosPropiedad = async (req, res) => {
  try {
    const resenas = await Resena.findAll({
      where: { propiedad_idPropiedad: req.params.idPropiedad },
      attributes: ['resenaSentimiento'],
    })

    const total    = resenas.length
    const positivo = resenas.filter(r => r.resenaSentimiento === 'positivo').length
    const negativo = resenas.filter(r => r.resenaSentimiento === 'negativo').length
    const neutral  = resenas.filter(r => r.resenaSentimiento === 'neutral').length

    const general = positivo > negativo && positivo > neutral ? 'positivo'
      : negativo > positivo && negativo > neutral ? 'negativo'
      : 'neutral'

    res.json({
      total, positivo, negativo, neutral, general,
      porcentajePositivo: total > 0 ? Math.round((positivo / total) * 100) : 0,
      porcentajeNegativo: total > 0 ? Math.round((negativo / total) * 100) : 0,
    })
  } catch (error) {
    console.error('Error en getSentimientosPropiedad:', error)
    res.status(500).json({ message: 'Error al obtener sentimientos.' })
  }
}

module.exports = { getResenasByPropiedad, createResena, getSentimientosPropiedad }
