const { generateToken, decodeToken, hashPassword, comparePasswords } = require("./utils")
const { pool } = require("./db")

class UsersComponent {
  async getUser(email) {
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email])
      return rows[0] || null
  }

  async getUserFromToken(token) {
    const result = decodeToken(token)
    if (!result.success) return { success: false, user: null }

    const email = result.decoded.email
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ? AND token = ?", [email, token])
    if (rows.length === 0) return { success: false, user: null }
    return { success: true, user: rows[0] }
  }

  async setUserToken(email) {
    const token = generateToken(email)
    const [result] = await pool.query("UPDATE users SET token = ? WHERE email = ?", [token, email])
    if (result.affectedRows === 0) return { success: false, message: "Utente non trovato" }
    return { success: true, token }
  }

  async invalidateUserToken(email) {
    const [result] = await pool.query("UPDATE users SET token = NULL WHERE email = ?", [email])
    if (result.affectedRows === 0) return { success: false, message: "Utente non trovato" }
    return { success: true, message: "Token invalidato con successo" }
  }

  async updateUserPassword(email, password) {
    const hashedPassword = await hashPassword(password)
    const [result] = await pool.query("UPDATE users SET password = ?, token = NULL WHERE email = ?", [hashedPassword, email])
    if (result.affectedRows === 0) return { success: false, message: "Utente non trovato" }
    return { success: true, message: "Password modificata con successo" }
  }

  async updateVerificationStatus(email, verified) {
    const [result] = await pool.query("UPDATE users SET verified = ?, token = NULL WHERE email = ?", [verified, email])
    if (result.affectedRows === 0) return { success: false, message: "Utente non trovato" }
    return { success: true, message: "Verification status aggiornato" }
  }

  async create(email, password) {
    const existingUser = await this.getUser(email)
    if (existingUser) return { success: false, user: null, message: "Email già in uso" }

    const hashedPassword = await hashPassword(password)
    const token = generateToken(email)

    await pool.query(
      "INSERT INTO users (email, password, verified, token) VALUES (?, ?, false, ?)",
      [email, hashedPassword, token]
    )

    const user = await this.getUser(email)
    return { success: true, user, message: "Utente creato con successo" }
  }

  async login(email, password) {
    const user = await this.getUser(email)
    if (!user) return { success: false, user: null, message: "Utente non trovato" }
    if (!user.verified) return { success: false, user, message: "Email non verificata" }

    const match = await comparePasswords(password, user.password)
    if (!match) return { success: false, user, message: "Password errata" }

    return { success: true, user, message: "Login riuscito" }
  }
}

module.exports = UsersComponent
