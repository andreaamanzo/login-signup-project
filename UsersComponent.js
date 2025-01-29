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
    const { email, password } = data

    if (this.users.find(user => user.email === email)) {
      return false
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const base64HashedPassword = Buffer.from(hashedPassword).toString('base64')

    this.users.push({ email, password : base64HashedPassword })
    this.serialize()
    
    return true
  }

  async login(email, password) {
    const user = this.users.find(user => user.email === email)

    if (!user) {
      return false
    }

    if (await bcrypt.compare(password, Buffer.from(user.password, 'base64').toString('utf-8'))) {
      return true
    }

    return false
  }
}

module.exports = UsersComponent