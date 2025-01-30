const express = require("express")
const join = require("path").join
const jwt = require('jsonwebtoken');

const UsersComponent = require("./UsersComponent")
const {sendConfirmationEmail, generateToken} = require("./utils")


const app = new express()
const PORT = 8080
const usersComponent = new UsersComponent("./state.json")



// Per abilitare il parsing delle form in formato urlencoded
app.use(express.urlencoded({ extended: true }))

// Middleware per servire i file statici
app.use(express.static(join(__dirname, "./public")))

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "./public/home.html"))
})

app.get("/login", (req, res) => {
  res.sendFile(join(__dirname, "./public/login.html"))
})

app.post("/login", async (req, res) => {
  const result = await usersComponent.login(req.body.email, req.body.password);
  if (result.success) {
      res.json(result);
  } else {
      res.status(400).json(result);
  }
});

app.get("/signup", (req, res) => {
  res.sendFile(join(__dirname, "./public/signup.html"))
})

app.post("/signup", async (req, res) => {
  console.log(req.body)
  const token = generateToken(req.body.email)
  if (await usersComponent.create({...req.body, token})) {
    sendConfirmationEmail(req.body.email, token);
    res.json({ success: true, message: "Utente creato. Controlla la tua email per la conferma." });
  } else {
    res.status(400).json({ success: false, message: "L'utente esiste già." });
  }

})

app.get('/verify-email', async (req, res) => {
  const { token } = req.query
  try {
      const decoded = jwt.verify(token, 'chiaveSegretaSuperSicura')
      const email = decoded.email;
      // Aggiorna il database per confermare l'email
      await usersComponent.updateVerificationStatus(email, true)
      res.send('Email verificata con successo!');
  } catch (error) {
      res.status(400).send('Token non valido o scaduto.');
  }
});

app.use((req, res) => {
  res.sendFile(join(__dirname, "./public/404.html"))
})

app.listen(PORT, () => console.log("server listening on port", PORT))