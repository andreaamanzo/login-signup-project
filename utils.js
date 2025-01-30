const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const configs = require("./configs")

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: configs.EMAIL, 
      pass: configs.EMAIL_PASSWORD 
  }
})

function generateToken(email) {
    return jwt.sign({ email }, 'chiaveSegretaSuperSicura', { expiresIn: '1h' });
}

async function sendConfirmationEmail(to, token) {
    console.log("in sendConfirmationEmail")
    const confirmationUrl = `https://tuosito.com/verify-email?token=${token}`

    const mailOptions = {
        from: `"Il Tuo Sito" ${configs.EMAIL}`,
        to: to,
        subject: 'Conferma la tua email',
        html: `<p>Clicca il link per confermare la tua email:</p>
               <a href="${confirmationUrl}">${confirmationUrl}</a>`
    }

    console.log("mailOptions", mailOptions)

    try {
        await transporter.sendMail(mailOptions)
        console.log('Email di conferma inviata')
    } catch (error) {
        console.error('Errore nell’invio dell’email:', error)
    }
}

module.exports = {
    generateToken,
    sendConfirmationEmail
}