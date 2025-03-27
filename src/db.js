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

async function waitForDatabase() {
  let connected = false
  while (!connected) {
      try {
          await pool.query('SELECT 1')
          connected = true
          console.log("Connessione al database riuscita.")
      } catch (err) {
          console.log("Database non ancora pronto, nuovo tentativo di connessione tra 2s...")
          await new Promise(res => setTimeout(res, 2000))
      }
  }
}

async function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      email VARCHAR(100) PRIMARY KEY,
      password VARCHAR(255) NOT NULL,
      token TEXT,
      verified BOOLEAN DEFAULT FALSE
    )
  `
  try {
    await pool.query(createTableQuery)
    console.log('Tabella utenti pronta.')
  } catch (err) {
    console.error('Errore nella creazione della tabella:', err)
    throw err
  }
}

module.exports = {
  pool,
  waitForDatabase,
  initializeDatabase
}
