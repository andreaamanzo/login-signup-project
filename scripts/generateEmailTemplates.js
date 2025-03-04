const join = require('path').join
const fs = require('fs')
const mjml = require('mjml')


const templatesDir = join(__dirname, '../email_templates')

fs.readdirSync(templatesDir).forEach((file) => {
    if (file.endsWith('.mjml')) {
        const templateName = file.replace('.mjml', '.html')
        const mjmlPath = join(templatesDir, file)

        const mjmlTemplate = fs.readFileSync(mjmlPath, 'utf8')
        const htmlTemplate = mjml(mjmlTemplate).html

        fs.writeFileSync(join(templatesDir, templateName), htmlTemplate)
    }
})

