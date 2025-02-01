const nodemailer = require('nodemailer')
const configs = require("./configs")
const join = require("path").join
const fs = require('fs')

class UsersComponent {
    constructor() {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: configs.EMAIL, 
              pass: configs.EMAIL_PASSWORD
          }
        })
    }

    loadTemplate(templateName, replacements) {
        const templatePath = join(__dirname, '../email_templates', `${templateName}.html`);
        let template = fs.readFileSync(templatePath, 'utf8');
    
        // Sostituisce i placeholder con i valori reali
        Object.keys(replacements).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            template = template.replace(regex, replacements[key]);
        });
    
        return template;
    }
    
    async sendConfirmationEmail(to, token) {
        const confirmationUrl = `http://${configs.SITE_HOST}:${configs.PORT}/verify-email?token=${token}`;
        const htmlContent = this.loadTemplate('confirmation_email', { CONFIRMATION_URL: confirmationUrl });
    
        const mailOptions = {
            from: `"LS-Project" <${configs.EMAIL}>`,
            to: to,
            subject: 'Conferma la tua email',
            html: htmlContent
        };
    
        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Errore nell’invio dell’email:', error);
        }
    }
    
    async sendResetPasswordEmail(to, token) {
        const resetPasswordUrl = `http://${configs.SITE_HOST}:${configs.PORT}/reset-password?token=${token}`;
        const htmlContent = this.loadTemplate('reset_password_email', { RESET_PASSWORD_URL: resetPasswordUrl });
    
        const mailOptions = {
            from: `"LS-Project" <${configs.EMAIL}>`,
            to: to,
            subject: 'Reset password',
            html: htmlContent
        };
    
        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Errore nell’invio dell’email:', error);
        }
    }

    

}

module.exports = UsersComponent
