const checkProtected = require('./check-protected')

module.exports = async function (request, type) {
  try {
    const useUrl = ['static'].includes(type) ? true : false
    await checkProtected.call(this, type, request, useUrl)
  } catch (err) {
    if (!err.isBoom) err = this.Boom.boomify(err)
    err.output.statusCode = 401
    err.reformat()
    throw err
  }
}
