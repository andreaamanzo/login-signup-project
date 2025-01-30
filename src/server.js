const express = require("express")
const join = require("path").join
const jwt = require('jsonwebtoken')
const configs = require("./configs")
const UsersComponent = require("./UsersComponent")
const { sendConfirmationEmail, generateToken } = require("./utils")

const app = new express()
const usersComponent = new UsersComponent("./state.json")

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
    const token = generateToken(req.body.email)
    const result = await usersComponent.create({...req.body, token})
    if (result.success) {
        sendConfirmationEmail(req.body.email, token)
        res.json(result)
    } else {
        res.status(400).json(result)
    }
})

app.get('/verify-email', async (req, res) => {
    const { token } = req.query

    try {
        const decoded = jwt.verify(token, configs.JWT_SECRET)
        const email = decoded.email

        const user = usersComponent.users.find(u => u.email === email)

        if (!user) {
            return res.status(400).send('Utente non trovato.')
        }

        if (user.verified) {
            return res.status(400).send('Email già verificata.')
        }

        if (user.token !== token) {
            return res.status(400).send('Token non valido o già usato.')
        }

        usersComponent.updateVerificationStatus(email, true)

        res.send('Email verificata con successo!')
    } catch (error) {
        res.status(400).send('Token non valido o scaduto.')
    }
})

app.use((req, res) => {
    res.sendFile(join(__dirname, "../public/404.html"))
})

app.listen(configs.PORT, configs.SITE_URL, () => console.log("server listening on port", configs.PORT))
