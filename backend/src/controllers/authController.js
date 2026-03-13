const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Usuario, Arrendador, Arrendatario } = require('../models')
const { enviarCodigoVerificacion, enviarCodigoRestablecimiento } = require('../config/mailer')

// ── Registro ──────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const {
      usuarioNom, usuarioApePat, usuarioApeMat,
      usuarioCorreo, usuarioContra, usuarioTel,
      usuarioCurp, usuarioFechaNac, rol,
      // Campos específicos de arrendatario
      arrendatarioBoleta, arrendatarioUnidadAca,
    } = req.body

    // Verificar si el correo ya existe
    const existeCorreo = await Usuario.findOne({ where: { usuarioCorreo } })
    if (existeCorreo) {
      return res.status(400).json({ message: 'El correo ya está registrado.' })
    }

    // Verificar si el CURP ya existe
    if (usuarioCurp) {
      const existeCurp = await Usuario.findOne({ where: { usuarioCurp } })
      if (existeCurp) {
        return res.status(400).json({ message: 'El CURP ya está registrado.' })
      }
    }

    // Hashear contraseña
    const hash = await bcrypt.hash(usuarioContra, 10)

    // Código de verificación de email
    const codigo = Math.random().toString(36).substring(2, 10).toUpperCase()
    // Crear usuario
    const usuario = await Usuario.create({
      usuarioNom,
      usuarioApePat,
      usuarioApeMat,
      usuarioCorreo,
      usuarioContra: hash,
      usuarioTel,
      usuarioCurp,
      usuarioFechaNac,
      usuarioCC: codigo,
      usuarioVCC: '0',
      usuarioFCC: new Date(),
    })

    // Crear perfil según rol
    if (rol === 'arrendador') {
      console.log('Datos arrendador:', req.body)
      await Arrendador.create({
        usuario_idUsuario: usuario.idUsuario,
        arrendadorCalle: req.body.calle,
        arrendadorNumExt: req.body.numExt,
        arrendadorNumInt: req.body.numInt,
        arrendadorColonia: req.body.colonia,
        arrendadorMunicipio: req.body.municipio,
        arrendadorEstado: req.body.estado,
        arrendadorCp: req.body.cp,
      })
    } else if (rol === 'arrendatario') {
      console.log('Datos arrendatario recibidos:', req.body)
      await Arrendatario.create({
        usuario_idUsuario: usuario.idUsuario,
        arrendatarioBoleta: req.body.arrendatarioBoleta,
        arrendatarioUnidadAca: req.body.arrendatarioUnidadAca,
        arrendatarioFechaActua: new Date(),
      })
    }
    // TODO: Enviar correo de verificación con el código
    await enviarCodigoVerificacion(usuarioCorreo, codigo)

    res.status(201).json({
      message: 'Usuario registrado correctamente. Verifica tu correo.',
      idUsuario: usuario.idUsuario,
    })
  } catch (error) {
    console.error('Error en register:', error)
    res.status(500).json({ message: 'Error al registrar usuario.' })
  }
}

// ── Login ─────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { usuarioCorreo, usuarioContra } = req.body

    const usuario = await Usuario.findOne({ where: { usuarioCorreo } })
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' })
    }

    // Verificar si el email está verificado
    if (usuario.usuarioVCC !== '1') {
      return res.status(401).json({ message: 'Debes verificar tu correo antes de iniciar sesión.' })
    }

    // Verificar contraseña
    const match = await bcrypt.compare(usuarioContra, usuario.usuarioContra)
    if (!match) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' })
    }

    // Determinar rol
    const arrendador = await Arrendador.findOne({ where: { usuario_idUsuario: usuario.idUsuario } })
    const arrendatario = await Arrendatario.findOne({ where: { usuario_idUsuario: usuario.idUsuario } })
    const rol = arrendador ? 'arrendador' : arrendatario ? 'arrendatario' : 'usuario'

    // Generar JWT
    const token = jwt.sign(
      { idUsuario: usuario.idUsuario, usuarioCorreo: usuario.usuarioCorreo, rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Actualizar fecha último inicio de sesión
    await usuario.update({ usuarioFechaUIS: new Date() })

    res.json({
      message: 'Inicio de sesión exitoso.',
      token,
      rol,
      usuario: {
        idUsuario: usuario.idUsuario,
        usuarioNom: usuario.usuarioNom,
        usuarioCorreo: usuario.usuarioCorreo,
      },
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ message: 'Error al iniciar sesión.' })
  }
}

// ── Verificar email ───────────────────────────────────────────────
const verifyEmail = async (req, res) => {
  try {
    const { codigo } = req.params

    const usuario = await Usuario.findOne({ where: { usuarioCC: codigo } })
    if (!usuario) {
      return res.status(400).json({ message: 'Código de verificación inválido.' })
    }

    await usuario.update({ usuarioVCC: '1' })

    res.json({ message: 'Correo verificado correctamente. Ya puedes iniciar sesión.' })
  } catch (error) {
    console.error('Error en verifyEmail:', error)
    res.status(500).json({ message: 'Error al verificar el correo.' })
  }
}

// ── Olvidé mi contraseña ──────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { usuarioCorreo } = req.body

    const usuario = await Usuario.findOne({ where: { usuarioCorreo } })
    if (!usuario) {
      // Por seguridad, siempre respondemos igual
      return res.json({ message: 'Si el correo existe, recibirás instrucciones.' })
    }

    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase()
    await usuario.update({ usuarioCC: codigo, usuarioFCC: new Date() })

    // TODO: Enviar correo con el código
    await enviarCodigoRestablecimiento(usuarioCorreo, codigo)

    res.json({ message: 'Si el correo existe, recibirás instrucciones.' })
  } catch (error) {
    console.error('Error en forgotPassword:', error)
    res.status(500).json({ message: 'Error al procesar la solicitud.' })
  }
}

// ── Restablecer contraseña ────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { codigo, nuevaContra } = req.body

    const usuario = await Usuario.findOne({ where: { usuarioCC: codigo } })
    if (!usuario) {
      return res.status(400).json({ message: 'Código inválido o expirado.' })
    }

    const hash = await bcrypt.hash(nuevaContra, 10)
    await usuario.update({ usuarioContra: hash, usuarioCC: null })

    res.json({ message: 'Contraseña actualizada correctamente.' })
  } catch (error) {
    console.error('Error en resetPassword:', error)
    res.status(500).json({ message: 'Error al restablecer la contraseña.' })
  }
}

// ── Obtener perfil ────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.idUsuario, {
      attributes: { exclude: ['usuarioContra', 'usuarioCC'] }
    })
    res.json(usuario)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el perfil.' })
  }
}

// ── Actualizar perfil ─────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { usuarioNom, usuarioApePat, usuarioApeMat, usuarioTel } = req.body
    await Usuario.update(
      { usuarioNom, usuarioApePat, usuarioApeMat, usuarioTel },
      { where: { idUsuario: req.user.idUsuario } }
    )
    res.json({ message: 'Perfil actualizado correctamente.' })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el perfil.' })
  }
}

module.exports = { register, login, verifyEmail, forgotPassword, resetPassword, getProfile, updateProfile }