const { Favorito, Propiedad, Resena, Arrendador, Arrendatario, Usuario } = require('../models')

// GET /api/favoritos
const getFavoritos = async (req, res) => {
  try {
    const arrendatario = await Arrendatario.findOne({ where: { usuario_idUsuario: req.user.idUsuario } })
    if (!arrendatario) return res.status(404).json({ message: 'Arrendatario no encontrado.' })

    const filas = await Favorito.findAll({
      where: { arrendatario_idArrendatario: arrendatario.idArrendatario },
      include: [{
        model: Propiedad,
        include: [
          { model: Resena, attributes: ['resenaCalGen'] },
          { model: Arrendador, include: [{ model: Usuario, attributes: ['usuarioNom'] }] },
        ],
      }],
    })

    res.json(filas.map(f => f.Propiedad))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error al obtener favoritos.' })
  }
}

// POST /api/favoritos/:idPropiedad
const addFavorito = async (req, res) => {
  try {
    const arrendatario = await Arrendatario.findOne({ where: { usuario_idUsuario: req.user.idUsuario } })
    if (!arrendatario) return res.status(404).json({ message: 'Arrendatario no encontrado.' })

    const [, creado] = await Favorito.findOrCreate({
      where: {
        arrendatario_idArrendatario: arrendatario.idArrendatario,
        propiedad_idPropiedad: req.params.idPropiedad,
      },
    })

    res.status(creado ? 201 : 200).json({ message: creado ? 'Agregado' : 'Ya existe' })
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar favorito.' })
  }
}

// DELETE /api/favoritos/:idPropiedad
const removeFavorito = async (req, res) => {
  try {
    const arrendatario = await Arrendatario.findOne({ where: { usuario_idUsuario: req.user.idUsuario } })
    if (!arrendatario) return res.status(404).json({ message: 'Arrendatario no encontrado.' })

    await Favorito.destroy({
      where: {
        arrendatario_idArrendatario: arrendatario.idArrendatario,
        propiedad_idPropiedad: req.params.idPropiedad,
      },
    })

    res.json({ message: 'Eliminado' })
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar favorito.' })
  }
}

module.exports = { getFavoritos, addFavorito, removeFavorito }