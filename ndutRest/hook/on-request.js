const checkProtected = require('../../lib/check-protected')

module.exports = async function (request) {
  try {
    await checkProtected.call(this, 'rest', request)
  } catch (err) {
    if (!err.isBoom) err = this.Boom.boomify(err)
    err.output.statusCode = 401
    err.reformat()
    if (request.authStrategy) reply.header('WWW-Authenticate', request.authStrategy)
    throw err
  }
}
