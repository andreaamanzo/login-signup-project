const Fastify = require("fastify")
const { join } = require("path")
const configs = require("./configs")
const UsersComponent = require("./UsersComponent")
const EmailComponent = require("./EmailComponent")
const { waitForDatabase } = require('./db')

const server = new Fastify({ logger: false })
const usersComponent = new UsersComponent()
const emailComponent = new EmailComponent()


async function main() {
    await waitForDatabase()
  
    server.listen({ port: configs.PORT, host: configs.SITE_HOST }, (err, address) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log(`Server listening on ${address}`)
    })
}
  
server.register(require("@fastify/static"), {
    root: join(__dirname, "../public"),
})

server.register(require("@fastify/formbody"))

server.get("/", async (request, reply) => {
    return reply.sendFile("html/home.html")
})

server.get("/login", async (request, reply) => {
    return reply.sendFile("html/login.html")
})

server.post("/login", async (request, reply) => {
    const result = await usersComponent.login(request.body.email, request.body.password)
    return reply.send(result)
})

server.get("/signup", async (request, reply) => {
    return reply.sendFile("html/signup.html")
})

server.post("/signup", async (request, reply) => {
    try {
        const result = await usersComponent.create(request.body.email, request.body.password)
        if (result.success) {
            emailComponent.sendConfirmationEmail(result.user.email, result.user.token)
        }
        return reply.send(result)
    } catch (err) {
        console.error("Errore in /signup:", err)
        return reply.status(500).send({ success: false, message: "Errore interno del server" })
    }
})

server.get("/welcome", async (request, reply) => {
    return reply.sendFile("html/welcome.html")
})

server.get("/signup-confirmation", async (request, reply) => {
    const { email } = request.query
    if (!email) return reply.sendFile("html/404.html")
    return reply.sendFile("html/signupConfirmation.html")
})

server.get("/verify-email", async (request, reply) => {
    const { token } = request.query
    const result = await usersComponent.getUserFromToken(token)
    return reply.sendFile(result.success ? "html/verifiedEmail.html" : "html/invalidLink.html")
})

server.post("/verify-email", async (request, reply) => {
    const { token } = request.body
    const result = await usersComponent.getUserFromToken(token)
    if (!result.success) return reply.send({ status: "error" })
    if (result.user.verified) {
        await usersComponent.invalidateUserToken(result.user.email)
        return reply.send({ status: "already_verified", email: result.user.email })
    }
    await usersComponent.updateVerificationStatus(result.user.email, true)
    return reply.send({ status: "success", email: result.user.email })
})

server.post("/resend-email", async (request, reply) => {
    const { email } = request.body
    const user = await usersComponent.getUser(email)
    if (!user) return reply.send({ success: false, message: "Utente non trovato" })
    const result = await usersComponent.setUserToken(user.email)
    await emailComponent.sendConfirmationEmail(user.email, result.token)
    return reply.send({ success: true, message: "Email di conferma inviata nuovamente" })
})

server.get("/forgot-password", async (request, reply) => {
    return reply.sendFile("html/forgotPassword.html")
})

server.post("/forgot-password", async (request, reply) => {
    const { email } = request.body
    const user = await usersComponent.getUser(email)
    if (user?.verified) {
        const result = await usersComponent.setUserToken(email)
        emailComponent.sendResetPasswordEmail(email, result.token)
    }
    return reply.send({ message: "Se l'indirizzo è corretto un'email per il reset è stata inviata" })
})

server.get("/reset-password", async (request, reply) => {
    const { token } = request.query
    const result = await usersComponent.getUserFromToken(token)
    return reply.sendFile(result.success ? "html/resetPassword.html" : "html/invalidLink.html")
})

server.post("/reset-password", async (request, reply) => {
    const { token, password } = request.body
    const result = await usersComponent.getUserFromToken(token)
    if (!result.success) return reply.send({ success: false, message: "Link non valido o scaduto" })
    await usersComponent.updateUserPassword(result.user.email, password)
    return reply.send({ success: true, message: "Nuova password impostata" })
})

server.setNotFoundHandler((request, reply) => {
    return reply.status(404).sendFile("html/404.html")
})

main()
