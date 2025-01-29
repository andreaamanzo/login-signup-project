const express = require("express")
const path = require("path")
const UsersComponent = require("./UsersComponent")
const app = new express()
const PORT = 8080

const usersComponent = new UsersComponent("./state.json")

// Per abilitare il parsing delle form in formato urlencoded
app.use(express.urlencoded({ extended: true }))

// Middleware per servire i file statici
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/home.html"))
})

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/login.html"))
})

app.post("/login", async (req, res) => {
  console.log(req.body)
  if (await usersComponent.login(req.body.email, req.body.password)){
    res.send("Logged in") //TODO
  } else {
    res.send("Login failed") //TODO
  }
})

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/signup.html"))
})

app.post("/signup", async (req, res) => {
  console.log(req.body)
  if (await usersComponent.create(req.body)){
    res.send("User created") //TODO
  } else {
    res.send("User already exists") //TODO
  }
})

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "./public/404.html"))
})

app.listen(PORT, () => console.log("server listening on port", PORT))