const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

const enviarCodigoVerificacion = async (correo, codigo) => {
  await transporter.sendMail({
    from: `"Burroomies 🐰" <${process.env.MAIL_USER}>`,
    to: correo,
    subject: 'Código de verificación - Burroomies',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:32px;background:#f0e8ff;border-radius:16px">
        <h2 style="color:#6d3fc0">🐰 Burroomies</h2>
        <p>Tu código de verificación es:</p>
        <h1 style="letter-spacing:8px;color:#8B5CF6;font-size:36px">${codigo}</h1>
        <p style="color:#888">Este código expira en 24 horas.</p>
      </div>
    `
  })
}

const enviarCodigoRestablecimiento = async (correo, codigo) => {
  await transporter.sendMail({
    from: `"Burroomies 🐰" <${process.env.MAIL_USER}>`,
    to: correo,
    subject: 'Restablecer contraseña - Burroomies',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:32px;background:#f0e8ff;border-radius:16px">
        <h2 style="color:#6d3fc0">🐰 Burroomies</h2>
        <p>Tu código para restablecer tu contraseña es:</p>
        <h1 style="letter-spacing:8px;color:#8B5CF6;font-size:36px">${codigo}</h1>
        <p style="color:#888">Si no solicitaste esto, ignora este correo.</p>
      </div>
    `
  })
}

module.exports = { enviarCodigoVerificacion, enviarCodigoRestablecimiento }