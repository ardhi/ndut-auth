const { _ } = require('ndut-helper')

module.exports = async function (request, reply) {
  let token = (request.headers.authorization || '').split(' ')[1]
  token = this.ndutAuth.helper.hash(token)
  const model = this.ndutDb.model.AuthUser
  const result = await model.findOne({ where: { token, status: 'ENABLED' } })
  if (!result) throw new this.Boom.Boom('Invalid token or user is disabled', { token: { token: 'invalid' } })
  return result
}
