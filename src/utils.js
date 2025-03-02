const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const configs = require("./configs")

function generateToken(email) {
    return jwt.sign({ email }, configs.JWT_SECRET, { expiresIn: '1h' })
}

function decodeToken(token) {
    try {
        const decoded = jwt.verify(token, configs.JWT_SECRET)
        return { success: true, decoded }
    } catch(error) {
        return { success: false, decoded: null }
    }
}

async function hashPassword(password) {
    const hashedPassword = await argon2.hash(password, {
        type: argon2.argon2id,  // Usa il tipo Argon2id
        memoryCost: 2 ** 16,    // 64MB di RAM usati per l'hashing
        timeCost: 3,            // Numero di iterazioni
        parallelism: 1          // Numero di thread
    })
    
    const base64HashedPassword = Buffer.from(hashedPassword).toString('base64')

    return base64HashedPassword
}

async function comparePasswords(clearPassword, hashedPassword) {
    try {
        const match = await argon2.verify(Buffer.from(hashedPassword, 'base64').toString('utf-8'), clearPassword)
        return match
    } catch (err) {
        return false
    }
}

module.exports = {
    generateToken,
    decodeToken,
    hashPassword,
    comparePasswords
}
