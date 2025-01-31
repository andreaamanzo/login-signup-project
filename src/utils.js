const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const configs = require("./configs")
const bcrypt = require("bcrypt")

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: configs.EMAIL, 
      pass: configs.EMAIL_PASSWORD
  }
})

function generateToken(email) {
    return jwt.sign({ email }, configs.JWT_SECRET, { expiresIn: '1h' })
}

async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const base64HashedPassword = Buffer.from(hashedPassword).toString('base64')

    return base64HashedPassword
}

async function sendConfirmationEmail(to, token) {
    const confirmationUrl = `http://${configs.SITE_HOST}:${configs.PORT}/verify-email?token=${token}`

    const mailOptions = {
        from: `"LS-Project" ${configs.EMAIL}`,
        to: to,
        subject: 'Conferma la tua email',
        html: `<p>Clicca il link per confermare la tua email:</p>
               <a href="${confirmationUrl}">${confirmationUrl}</a>`
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.error('Errore nell’invio dell’email:', error)
    }
}

async function sendResetPasswordEmail(to, token) {
    const resetPasswordUrl = `http://${configs.SITE_HOST}:${configs.PORT}/reset-password?token=${token}`

    const mailOptions = {
        from: `"LS-Project" ${configs.EMAIL}`,
        to: to,
        subject: 'Reset password',
        html: `<p>Clicca il link per impostare una nuova password:</p>
               <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>`
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.error('Errore nell’invio dell’email:', error)
    }
}

module.exports = {
    generateToken,
    hashPassword,
    sendConfirmationEmail,
    sendResetPasswordEmail
}