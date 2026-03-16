const { Resena, Arrendatario, Arrendamiento, Propiedad, Usuario } = require('../models')

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

// ── Crear reseña (solo arrendatario con arrendamiento terminado) ─
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

    // Verificar que el arrendatario NO tenga arrendamiento activo (RN_05)
    // Solo puede reseñar si ya terminó su arrendamiento
    if (arrendatario.arrendamiento_idArrendamiento) {
      return res.status(400).json({ message: 'Solo puedes dejar una reseña después de terminar tu arrendamiento.' })
    }

    // Verificar que no haya dejado ya una reseña para esta propiedad
    const resenaExistente = await Resena.findOne({
      where: {
        arrendatario_idArrendatario: arrendatario.idArrendatario,
        propiedad_idPropiedad,
      }
    })
    if (resenaExistente) {
      return res.status(400).json({ message: 'Ya dejaste una reseña para esta propiedad.' })
    }

    const resena = await Resena.create({
      resenaDescrip,
      resenaCalGen,
      resenaCalSerBasic,
      resenaCalSerComEnt,
      resenaCalSerAdicio,
      resenaDuracionRenta,
      resenaFechaCreacion: new Date(),
      arrendatario_idArrendatario: arrendatario.idArrendatario,
      propiedad_idPropiedad,
    })

    res.status(201).json({ message: 'Reseña creada correctamente.', resena })
  } catch (error) {
    console.error('Error en createResena:', error)
    res.status(500).json({ message: 'Error al crear la reseña.' })
  }
}

module.exports = { getResenasByPropiedad, createResena }