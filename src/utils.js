const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const configs = require("./configs")

function generateToken(email) {
    return jwt.sign({ email }, configs.JWT_SECRET, { expiresIn: '1h' })
}

async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const base64HashedPassword = Buffer.from(hashedPassword).toString('base64')

    return base64HashedPassword
}

async function comparePasswords (clearPassword, hashedPassword) {
    return await bcrypt.compare(clearPassword, Buffer.from(hashedPassword, 'base64').toString('utf-8'))
}

module.exports = {
    generateToken,
    hashPassword,
    comparePasswords
}