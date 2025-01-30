require("dotenv").config()

const {
    EMAIL,
    EMAIL_PASSWORD,
    JWT_SECRET,
    SITE_HOST,
    PORT
} = process.env

module.exports = { 
    EMAIL, 
    EMAIL_PASSWORD, 
    JWT_SECRET, 
    SITE_HOST,
    PORT
}