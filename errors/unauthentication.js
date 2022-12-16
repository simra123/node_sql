const CustomAPIError = require('./custom_error')
const { StatusCodes } = require('http-status-codes')

class Unauthentication extends CustomAPIError {
    constructor (message) {
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED //401
    }
}

module.exports = Unauthentication 
