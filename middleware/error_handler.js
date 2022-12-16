const { CustomAPIError } = require('../errors')
const statusCode = require('http-status-codes')
const error_handler = ((err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ msg: err.message })
    }
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({ msg: 'something went wrong, please try again later' })
})
module.exports = error_handler