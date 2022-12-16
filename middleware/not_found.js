const StatusCodes = require('http-status-codes')

const not_found = ((req, res, next) => {
    return res.status(StatusCodes.NOT_FOUND).send('<h2>the page you are looking for is not found </h2>')
})
module.exports = not_found