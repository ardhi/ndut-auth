const { _ } = require('ndut-helper')

module.exports = async function (request, reply) {
  const token = (request.headers.authorization || '').split(' ')[1]
  const decoded = await this.ndutAuth.helper.verifyJwt(token)
  const model = this.ndutDb.model.AuthUser
  const result = await model.findOne({ where: { id: decoded.payload.uid, status: 'ENABLED' } })
  if (!result) throw new this.Boom.Boom('Invalid token or user is disabled', { token: { token: 'invalid' } })
  return result
}
