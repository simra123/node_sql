const jwt = require('jsonwebtoken')
const Users = require('../models/auth')
const { Unauthentication } = require('../errors/')
require('dotenv').config()

const auth = (req, res, next) => {
    //get token
    const authHeaders = req.headers.authorization
    //check if it exists
    if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
        return next(new Unauthentication('invalid token'))
    }
    const token = authHeaders.split(' ')[1]
    //verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.Users = { userId: decoded.userId, name: decoded.name }
        next()
    } catch (error) {
        return next(new Unauthentication('not authorize to access this route'))

    }

}
module.exports = auth