const fs = require("fs")
const bcrypt = require("bcrypt")

class UsersComponent {
    constructor(statePath) {
        this.users = []
        this.statePath = statePath
        try {
            this.users = JSON.parse(fs.readFileSync(statePath, "utf-8"))
        } catch(err) {
            console.log(err.message)
            this.serialize()
        }
    }

    serialize() {
        fs.writeFileSync(this.statePath, JSON.stringify(this.users, null, 2))
    }

    async create(data) {
        const { email, password, token } = data

        if (this.users.find(u => u.email === email)) {
            return { success: false, message: "Email già in uso" }
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const base64HashedPassword = Buffer.from(hashedPassword).toString('base64')

        this.users.push({ 
            email, 
            password: base64HashedPassword,
            token,
            verified: false 
        })
        this.serialize()
        
        return { success: true, message: "Utente creato con successo. Controlla la tua email per la conferma." }
    }

    async login(email, password) {
        const user = this.users.find(u => u.email === email)

        if (!user) {
            return { success: false, message: "Utente non trovato" }
        }

        if (!user.verified) {
            return { success: false, message: "Email non verificata. Controlla la tua posta." }
        }

        if (await bcrypt.compare(password, Buffer.from(user.password, 'base64').toString('utf-8'))) {
            return { success: true, message: "Login riuscito" }
        }

        return { success: false, message: "Password errata" }
    }

    updateVerificationStatus(email, verified) {
        const user = this.users.find(u => u.email === email)

        if (!user) {  
            return { success: false, message: "Utente non trovato" }
        }

        user.verified = verified
        user.token = null
        this.serialize()

        return { success: true, message: "Verification status updated" }
    }
}

module.exports = UsersComponent
