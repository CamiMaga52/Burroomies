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
      arrendatarioApodo,
    } = req.body

    const existeCorreo = await Usuario.findOne({ where: { usuarioCorreo } })
    if (existeCorreo) {
      return res.status(400).json({ message: 'El correo ya está registrado.' })
    }

    if (usuarioCurp) {
      const existeCurp = await Usuario.findOne({ where: { usuarioCurp } })
      if (existeCurp) {
        return res.status(400).json({ message: 'El CURP ya está registrado.' })
      }
    }

    if (rol === 'arrendatario') {
      if (!arrendatarioApodo) {
        return res.status(400).json({ message: 'El apodo es obligatorio para estudiantes.' })
      }
      const existeApodo = await Arrendatario.findOne({ where: { arrendatarioApodo } })
      if (existeApodo) {
        return res.status(400).json({ message: 'Ese apodo ya está en uso, elige otro.' })
      }
    }

    const hash   = await bcrypt.hash(usuarioContra, 10)
    const codigo = Math.random().toString(36).substring(2, 10).toUpperCase()

    const usuario = await Usuario.create({
      usuarioNom, usuarioApePat, usuarioApeMat,
      usuarioCorreo, usuarioContra: hash, usuarioTel,
      usuarioCurp, usuarioFechaNac,
      usuarioCC: codigo, usuarioVCC: '0', usuarioFCC: new Date(),
    })

    if (rol === 'arrendador') {
      await Arrendador.create({
        usuario_idUsuario:   usuario.idUsuario,
        arrendadorCalle:     req.body.calle,
        arrendadorNumExt:    req.body.numExt,
        arrendadorNumInt:    req.body.numInt,
        arrendadorColonia:   req.body.colonia,
        arrendadorMunicipio: req.body.municipio,
        arrendadorEstado:    req.body.estado,
        arrendadorCp:        req.body.cp,
      })
    } else if (rol === 'arrendatario') {
      const codigoEst = 'EST-' + String(usuario.idUsuario).padStart(4, '0')
      await usuario.update({ usuarioCodigo: codigoEst })
      await Arrendatario.create({
        usuario_idUsuario:      usuario.idUsuario,
        arrendatarioApodo:      arrendatarioApodo,
        arrendatarioBoleta:     req.body.arrendatarioBoleta,
        arrendatarioUnidadAca:  req.body.arrendatarioUnidadAca,
        arrendatarioFechaActua: new Date(),
      })
    }

    await enviarCodigoVerificacion(usuarioCorreo, codigo)

    res.status(201).json({
      message:   'Usuario registrado correctamente. Verifica tu correo.',
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
    if (!usuario) return res.status(401).json({ message: 'Credenciales incorrectas.' })

    if (usuario.usuarioVCC !== '1') {
      return res.status(401).json({ message: 'Debes verificar tu correo antes de iniciar sesión.' })
    }

    const match = await bcrypt.compare(usuarioContra, usuario.usuarioContra)
    if (!match) return res.status(401).json({ message: 'Credenciales incorrectas.' })

    const arrendador   = await Arrendador.findOne({ where: { usuario_idUsuario: usuario.idUsuario } })
    const arrendatario = await Arrendatario.findOne({ where: { usuario_idUsuario: usuario.idUsuario } })
    const rol = arrendador ? 'arrendador' : arrendatario ? 'arrendatario' : 'usuario'

    const token = jwt.sign(
      { idUsuario: usuario.idUsuario, usuarioCorreo: usuario.usuarioCorreo, rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    await usuario.update({ usuarioFechaUIS: new Date() })

    res.json({
      message: 'Inicio de sesión exitoso.',
      token, rol,
      usuario: {
        idUsuario:     usuario.idUsuario,
        usuarioNom:    usuario.usuarioNom,
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
    if (!usuario) return res.status(400).json({ message: 'Código de verificación inválido.' })
    await usuario.update({ usuarioVCC: '1' })
    res.json({ message: 'Correo verificado correctamente. Ya puedes iniciar sesión.' })
  } catch (error) {
    console.error('Error en verifyEmail:', error)
    res.status(500).json({ message: 'Error al verificar el correo.' })
  }
}

// ── Reenviar código de verificación (8 chars) ─────────────────────
const resendVerificationCode = async (req, res) => {
  try {
    const { usuarioCorreo } = req.body
    const usuario = await Usuario.findOne({ where: { usuarioCorreo } })
    if (!usuario) return res.json({ message: 'Si el correo existe, recibirás el código.' })

    const codigo = Math.random().toString(36).substring(2, 10).toUpperCase() // 8 chars
    await usuario.update({ usuarioCC: codigo, usuarioFCC: new Date() })
    await enviarCodigoVerificacion(usuarioCorreo, codigo)

    res.json({ message: 'Código reenviado correctamente.' })
  } catch (error) {
    console.error('Error en resendVerificationCode:', error)
    res.status(500).json({ message: 'Error al reenviar el código.' })
  }
}

// ── Olvidé mi contraseña ──────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { usuarioCorreo } = req.body
    const usuario = await Usuario.findOne({ where: { usuarioCorreo } })
    if (!usuario) return res.json({ message: 'Si el correo existe, recibirás instrucciones.' })

    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase() // 6 chars
    await usuario.update({ usuarioCC: codigo, usuarioFCC: new Date() })
    await enviarCodigoRestablecimiento(usuarioCorreo, codigo)

    res.json({ message: 'Si el correo existe, recibirás instrucciones.' })
  } catch (error) {
    console.error('Error en forgotPassword:', error)
    res.status(500).json({ message: 'Error al procesar la solicitud.' })
  }
}

// ── Verificar código de restablecimiento ─────────────────────────
const verifyResetCode = async (req, res) => {
  try {
    const { codigo } = req.body
    const usuario = await Usuario.findOne({ where: { usuarioCC: codigo } })
    if (!usuario) return res.status(400).json({ message: 'Código inválido o expirado.' })
    res.json({ message: 'Código válido.' })
  } catch (error) {
    console.error('Error en verifyResetCode:', error)
    res.status(500).json({ message: 'Error al verificar el código.' })
  }
}

// ── Restablecer contraseña ────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { codigo, nuevaContra } = req.body
    const usuario = await Usuario.findOne({ where: { usuarioCC: codigo } })
    if (!usuario) return res.status(400).json({ message: 'Código inválido o expirado.' })
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
    const arrendatario = await Arrendatario.findOne({
      where: { usuario_idUsuario: req.user.idUsuario },
      attributes: ['arrendatarioApodo']
    })
    res.json({
      ...usuario.toJSON(),
      arrendatarioApodo: arrendatario?.arrendatarioApodo || null,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el perfil.' })
  }
}

// ── Actualizar perfil ─────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { usuarioNom, usuarioApePat, usuarioApeMat, usuarioTel, usuarioFoto } = req.body
    const campos = { usuarioNom, usuarioApePat, usuarioApeMat, usuarioTel }
    if (usuarioFoto !== undefined) campos.usuarioFoto = usuarioFoto
    await Usuario.update(campos, { where: { idUsuario: req.user.idUsuario } })
    res.json({ message: 'Perfil actualizado correctamente.' })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el perfil.' })
  }
}

// ── Cambiar contraseña ────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { contrasenaActual, contrasenaNueva } = req.body
    const usuario = await Usuario.findByPk(req.user.idUsuario)
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' })
    const match = await bcrypt.compare(contrasenaActual, usuario.usuarioContra)
    if (!match) return res.status(400).json({ message: 'La contraseña actual es incorrecta.' })
    if (!contrasenaNueva || contrasenaNueva.length < 8)
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 8 caracteres.' })
    const hash = await bcrypt.hash(contrasenaNueva, 10)
    await usuario.update({ usuarioContra: hash })
    res.json({ message: 'Contraseña cambiada correctamente.' })
  } catch (error) {
    console.error('Error en changePassword:', error)
    res.status(500).json({ message: 'Error al cambiar la contraseña.' })
  }
}

module.exports = {
  register, login, verifyEmail,
  resendVerificationCode,
  forgotPassword, resetPassword, verifyResetCode,
  getProfile, updateProfile, changePassword,
}