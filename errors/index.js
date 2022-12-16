const BadRequest = require('./bad_request')
const Unauthentication = require('./unauthentication')
const CustomAPIError = require('./custom_error')
const NotFound = require('./not_found')

module.exports = {
    BadRequest,
    Unauthentication,
    CustomAPIError,
    NotFound
}