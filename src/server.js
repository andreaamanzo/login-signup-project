const express        = require("express")
const join           = require("path").join
const jwt            = require('jsonwebtoken')
const configs        = require("./configs")
const UsersComponent = require("./UsersComponent")
const EmailComponent = require("./EmailComponent")

const app            = new express()
const usersComponent = new UsersComponent("./state.json")
const emailComponent = new EmailComponent()

app.use(express.json())

// Per abilitare il parsing delle form in formato urlencoded
app.use(express.urlencoded({ extended: true }))

// Middleware per servire i file statici
app.use(express.static(join(__dirname, "../public")))

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "../public/html/home.html"))
})

app.get("/login", (req, res) => {
    res.sendFile(join(__dirname, "../public/html/login.html"))
})

app.post("/login", async (req, res) => {
    const result = await usersComponent.login(req.body.email, req.body.password)

    if (result.success) {
        return res.json(result)
    } else {
        return res.json(result)
    }
})

app.get("/signup", (req, res) => {
    res.sendFile(join(__dirname, "../public/html/signup.html"))
})

app.post("/signup", async (req, res) => {
    const result = await usersComponent.create(req.body.email, req.body.password)

    if (result.success) {
        const user = result.user
        emailComponent.sendConfirmationEmail(user.email, user.token)
        return res.json(result)
    } else {
        return res.json(result)
    }
})

app.get("/welcome", (req, res) => {
    res.sendFile(join(__dirname, "../public/html/welcome.html"))
})

app.get('/signup-confirmation', async (req, res) => {
    const { email } = req.query

    if (!email) {
        return res.sendFile(join(__dirname, "../public/html/404.html"))
    }
    res.sendFile(join(__dirname, "../public/html/signupConfirmation.html"))
})

app.get('/verify-email', async (req, res) => {
    const { token } = req.query

    try {
        const decoded = jwt.verify(token, configs.JWT_SECRET)  // Verifica il token
        const email = decoded.email

        const user = usersComponent.getUser(email)

        if (!user) {
            return res.redirect(`/verified-email?status=invalid`)
        }

        if (user.verified) {
            usersComponent.invalidateUserToken(email)
            return res.redirect(`/verified-email?status=already_verified&email=${encodeURIComponent(user.email)}`)
        }

        if (user.token !== token) {
            return res.redirect(`/verified-email?status=invalid&email=${encodeURIComponent(user.email)}`)
        }

        usersComponent.updateVerificationStatus(email, true)

        return res.redirect(`/verified-email?status=success&email=${encodeURIComponent(user.email)}`)
    } catch (error) {
        // Se il token è scaduto, prova a decodificarlo senza verificare
        let email = null
        if (error.name === "TokenExpiredError") {
            const decoded = jwt.decode(token)  // Decodifica il token senza verificare
            email = decoded?.email
        }

        if (email) {
            // Genera un nuovo token e invia una nuova email
            const newToken = jwt.sign({ email }, configs.JWT_SECRET, { expiresIn: '1h' })
            usersComponent.setUserToken(email, newToken)
            emailComponent.sendConfirmationEmail(email, newToken)

            return res.redirect(`/verified-email?status=resent&email=${encodeURIComponent(email)}`)
        }

        return res.redirect(`/verified-email?status=invalid`)
    }
})

app.get("/verified-email", (req, res) => {
    res.sendFile(join(__dirname, "../public/html/verifiedEmail.html"))
})

app.post("/resend-email", async (req, res) => {
    const { email } = req.body

    const user = usersComponent.getUser(email)
    if (!user) {
        return res.json({ success: false, message: "Utente non trovato" })
    }

    usersComponent.setUserToken(user.email)
    emailComponent.sendConfirmationEmail(user.email, user.token)

    return res.json({ success: true, user, message: "Email di conferma inviata nuovamente" })
})

app.get('/forgot-password', async (req, res) => {
    res.sendFile(join(__dirname, "../public/html/forgotPassword.html"))
})

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body

    const user = usersComponent.getUser(email)

    if (user && user?.verified) {
        usersComponent.setUserToken(email)
        emailComponent.sendResetPasswordEmail(email, user.token)
    }

    return res.json({ message: "Se l'indirizzo è corretto un'email per il reset è stata inviata" })
})

app.get('/reset-password', async (req, res) => {
    const { token } = req.query

    const result = usersComponent.getUserFromToken(token)

    if (!result.success) {
        return res.sendFile(join(__dirname, "../public/html/invalidLink.html"))
    }

    return res.sendFile(join(__dirname, "../public/html/resetPassword.html"))
})

app.post('/reset-password', async (req, res) => {
    const { token, password } = req.body

    const result = usersComponent.getUserFromToken(token)

    if (!result.success) {
        return res.json({ success: false, message: "Link non valido o scaduto" })
    }

    const user = result.user

    usersComponent.updateUserPassword(user.email, password)

    return res.json({ success: true, message: "Nuova password impostata" })
})

app.use((req, res) => {
    res.status(404).sendFile(join(__dirname, "../public/html/404.html"))
})

app.listen(configs.PORT, configs.SITE_URL, () => console.log("server listening on port", configs.PORT))
