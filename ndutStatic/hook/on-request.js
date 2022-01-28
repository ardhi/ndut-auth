const checkProtected = require('../../lib/check-protected')

module.exports = async function (request, reply) {
  try {
    await checkProtected.call(this, 'static', request, reply)
  } catch (err) {
    if (!err.isBoom) err = this.Boom.boomify(err)
    err.output.statusCode = 401
    err.reformat()
    throw err
  }
}
