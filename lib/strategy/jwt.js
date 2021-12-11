const { _ } = require('ndut-helper')
const verifyJwt = require('../misc/verify-jwt')

module.exports = async function (request, reply) {
  const token = (request.headers.authorization || '').split(' ')[1]
  const decoded = await verifyJwt(this, token)
  const model = this.ndutDb.model.AuthUser
  const result = await model.findOne({ where: { id: decoded.payload.uid, status: 'ENABLED' } })
  if (!result) throw new this.Boom.Boom('Invalid token or user is disabled', { token: { token: 'invalid' } })
  if (this.ndutAuth.helper.hash(decoded.payload.apiKey) !== result.token)
    throw new this.Boom.Boom('Invalid/expired token. Please get a new one', { token: { token: 'invalid' } })
  return result
}
