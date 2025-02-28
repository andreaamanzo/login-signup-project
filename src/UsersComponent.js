const fs = require("fs")
const { generateToken, decodeToken, hashPassword, comparePasswords } = require("./utils")

class UsersComponent {
    constructor(statePath) {
        this.users = {}
        this.statePath = statePath
        try {
            this.users = JSON.parse(fs.readFileSync(statePath, "utf-8"))
        } catch(err) {
            console.error(err.message)
            this.serialize()
        }
    }

    serialize() {
        fs.writeFileSync(this.statePath, JSON.stringify(this.users, null, 2))
    }

    getUser(email) {
        return this.users[email]
    }

    getUserFromToken(token) {
        const result = decodeToken(token)

        if (!result.success) {
            return { success: false, user: null }
        }

        const email = result.decoded.email
        const user  = this.getUser(email)

        if (user.token !== token) {
            return { success: false, user }
        }

        return { success: true, user}
    }

    setUserToken(email) {
        const user = this.getUser(email)

        if (!user) {
            return { success: false, message: "Utente non trovato" }
        }

        const token = generateToken(email)
        user.token = token
        this.serialize()

        return { success: true, message: "Token impostato con successo" }
    }

    invalidateUserToken(email) {
        const user = this.getUser(email)

        if (!user) {
            return { success: false, message: "Utente non trovato" }
        }

        user.token = null
        this.serialize()

        return { success: true, message: "Token invalidato con successo" }
    }

    async updateUserPassword(email, password) {
        const user = this.getUser(email)

        if (!user) {
            return { success: false, message: "Utente non trovato" }
        }

        user.password = await hashPassword(password)
        this.invalidateUserToken(email)
        this.serialize()
        
        return { success: true, message: "Password modificata con successo" }
    }
    
    updateVerificationStatus(email, verified) {
        const user = this.getUser(email)
        if (!user) {  
            return { success: false, message: "Utente non trovato" }
        }

        user.verified = verified
        user.token = null
        this.serialize()

        return { success: true, message: "Verification status aggiornato" }
    }

    async create(email, password) {

        if (this.getUser(email)) {
            return { success: false, user: null, message: "Email già in uso" }
        }

        const user = {
            email, 
            password: await hashPassword(password),
            token : null,
            verified: false 
        }

        this.users[email] = user
        this.setUserToken(email)
        this.serialize()
        
        return { success: true, user, message: "Utente creato con successo" }
    }

    async login(email, password) {
        const user = this.getUser(email)

        if (!user) {
            return { success: false, user: null, message: "Utente non trovato" }
        }

        if (!user.verified) {
            return { success: false, user, message: "Email non verificata" }
        }

        if (await comparePasswords(password, user.password)) {
            return { success: true, user, message: "Login riuscito" }
        }

        return { success: false, user, message: "Password errata" }
    }
}

module.exports = UsersComponent
