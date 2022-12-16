const Users = require('../models/auth')
const { StatusCodes } = require('http-status-codes')
const { BadRequest, Unauthentication } = require('../errors')
const jwt = require('jsonwebtoken')

const register = async (req, res, next) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return next(new BadRequest('please provide name, email and password'))
    }
    ///using bcrypt lib to save protected pass in database
    //never ever save your password as string values

    const user = await Users.create({ ...req.body })

    //generating the token
    // const token = jwt.sign({ userId: user._id, name: user.name }, 'jxt-secret', {
    //     expiresIn: '30d'
    // })
    const token = user.getToken()

    res.status(StatusCodes.CREATED).json({ user: { name: user.getName() }, token })
}
const login = async (req, res, next) => {
    //check if both fields exists 
    const { email, password } = req.body
    if (!email || !password) {
        return next(new BadRequest('please provide email and password'))
    }
    //check email
    const user = await Users.findOne({ email })
    if (!user) {
        return next(new Unauthentication('invalid Credentials'))

    }
    //match password
    const matchPassword = await user.comparePassword(password)
    if (!matchPassword) {
        return next(new Unauthentication('invalid Credentials'))

    }
    const token = user.getToken()
    res.status(StatusCodes.OK).json({ user: { name: user.getName() }, token })
}

module.exports = { register, login }