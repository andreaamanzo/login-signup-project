require("dotenv").config()

const {
    EMAIL,
    EMAIL_PASSWORD,
    JWT_SECRET,
    SITE_HOST,
    PORT,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME
} = process.env

module.exports = { 
    EMAIL, 
    EMAIL_PASSWORD, 
    JWT_SECRET, 
    SITE_HOST,
    PORT,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME
}