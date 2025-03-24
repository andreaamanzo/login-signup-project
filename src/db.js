const mysql = require("mysql2/promise")
const configs = require("./configs")

const pool = mysql.createPool({
  host: configs.DB_HOST,
  user: configs.DB_USER,
  password: configs.DB_PASSWORD,
  database: configs.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

async function connectToDatabase() {
  try {
    await pool.query("SELECT 1")
    console.log("Connesso al database con pool!")

    // Creazione tabella se non esiste
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        email VARCHAR(100) PRIMARY KEY,
        password VARCHAR(255) NOT NULL,
        token TEXT,
        verified BOOLEAN DEFAULT FALSE
      )
    `)

    console.log("Tabella utenti pronta!")
  } catch (err) {
    console.error("Errore di connessione al database:", err.message)
    process.exit(1)
  }
}

module.exports = { pool, connectToDatabase }
