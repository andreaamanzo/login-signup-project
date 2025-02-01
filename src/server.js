const express = require("express")
const join = require("path").join
const jwt = require('jsonwebtoken')
const configs = require("./configs")
const UsersComponent = require("./UsersComponent")
const { sendConfirmationEmail, sendResetPasswordEmail } = require("./utils")

const app = new express()
const usersComponent = new UsersComponent("./state.json")

app.use(express.json())
// Per abilitare il parsing delle form in formato urlencoded
app.use(express.urlencoded({ extended: true }))

// Middleware per servire i file statici
app.use(express.static(join(__dirname, "../public")))

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "../public/home.html"))
})

app.get("/login", (req, res) => {
    res.sendFile(join(__dirname, "../public/login.html"))
})

app.post("/login", async (req, res) => {
    const result = await usersComponent.login(req.body.email, req.body.password)
    if (result.success) {
        res.json(result)
    } else {
        res.status(400).json(result)
    }
})

app.get("/signup", (req, res) => {
    res.sendFile(join(__dirname, "../public/signup.html"))
})

app.post("/signup", async (req, res) => {
    const result = await usersComponent.create(req.body)

    if (result.success) {
        const user = result.user
        usersComponent.setUserToken(user.email)
        sendConfirmationEmail(user.email, user.token)
        res.redirect(`/signupConfirmation?email=${encodeURIComponent(user.email)}`)
    } else {
        res.status(400).json(result)
    }
})

app.get('/signupConfirmation', async (req, res) => {
        res.sendFile(join(__dirname, "../public/signupConfirmation.html"))
})

app.get('/verify-email', async (req, res) => {
    const { token } = req.query

    try {
        const decoded = jwt.verify(token, configs.JWT_SECRET)
        const email = decoded.email

        const user = usersComponent.getUser(email)

        if (!user) {
            return res.status(400).send('Utente non trovato.')
        }

        if (user.verified) {
            usersComponent.invalidateUserToken(email)
            return res.status(400).send('Email già verificata.')
        }

        if (user.token !== token) {
            return res.status(400).send('Link non valido o già usato.')
        }

        usersComponent.updateVerificationStatus(email, true)

        res.send('Email verificata con successo!')
    } catch (error) {
        res.status(400).send('Link non valido o scaduto.')
    }
})

app.post("/resend-email", async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).json({ success: false, message: "Email richiesta" })
    }

    const user = usersComponent.getUser(email)
    if (!user) {
        return res.status(404).json({ success: false, message: "Utente non trovato" })
    }

    if (user.confirmed) {
        return res.status(400).json({ success: false, message: "Email già confermata" })
    }

    usersComponent.setUserToken(user.email)
    sendConfirmationEmail(user.email, user.token)

    return res.json({ success: true, message: "Email di conferma inviata nuovamente" })
})

app.get('/forgot-password', async (req, res) => {
    res.sendFile(join(__dirname, "../public/forgotPassword.html"))
})

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({ success: false, message: "Email richiesta" })
    }

    const user = usersComponent.getUser(email)

    if (!user || !user?.verified) {
        return res.status(400).json({ success: false, message: "Email non collegata a nessun utente" })
    }


    usersComponent.setUserToken(email)
    sendResetPasswordEmail(email, user.token)
    return res.json({ success: true, message: "Email di reset password inviata" })
})

app.get('/reset-password', async (req, res) => {
    const { token } = req.query

    try {
        const decoded = jwt.verify(token, configs.JWT_SECRET)
        const email = decoded.email

        const user = usersComponent.getUser(email)

        if (!user) {
            return res.status(400).send('Utente non trovato.')
        }

        if (user.token !== token) {
            return res.status(400).send('Link non valido o scaduto.')
        }

        res.sendFile(join(__dirname, "../public/resetPassword.html"))
    } catch (error) {
        res.status(400).send('Link non valido o scaduto.')
    }
})

app.post('/reset-password', async (req, res) => {
    const { token, password } = req.body

    console.log(req.body)

    try {
        const decoded = jwt.verify(token, configs.JWT_SECRET)
        const email = decoded.email

        const user = usersComponent.getUser(email)
        if (!user) {
            return res.status(400).json({ success: false, message: "Utente sconosciuto" })
        }

        if (user.token !== token) {
            return res.status(400).json({ success: false, message: "Link non valido o scaduto" })
        }

        usersComponent.updateUserPassword(email, password)

        usersComponent.invalidateUserToken(email)

        res.json({ success: true, message: "Nuova password impostata" })
    } catch (error) {
        return res.status(400).json({ success: false, message: "Link non valido o scaduto" })
    }
})

app.use((req, res) => {
    res.sendFile(join(__dirname, "../public/404.html"))
})

app.listen(configs.PORT, configs.SITE_URL, () => console.log("server listening on port", configs.PORT))
