const config = require('../config/index')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

// เข้ารหัส Password
module.exports.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(Number(config.SALT))
    const hashPassword = await bcrypt.hash(password, salt)
    return hashPassword
}

// เช็ค Password
module.exports.checkPassword = async (password, hashPassword) => {
    const isValid = await bcrypt.compare(password, hashPassword)
    return isValid
}

// สร้าง Token
module.exports.generateToken = async (payload) => {
    const token = await jwt.sign(payload, config.JWT_ACCESS_SECRET, {
        expiresIn: config.JWT_ACCESS_TIME,
    })
    return token
}