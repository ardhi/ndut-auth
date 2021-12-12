const { _, getNdutConfig } = require('ndut-helper')
const verifyJwt = require('../misc/verify-jwt')

module.exports = async function (request, reply, method = 'bearer') {
  const authConfig = getNdutConfig(this, 'ndut-auth')
  let token = ''
  if (method === 'qs') token = request.query[authConfig.apiKeyQueryString]
  else if (method === 'header') token = request.headers[authConfig.apiKeyHeader.toLowerCase()]
  else token = (request.headers.authorization || '').split(' ')[1]
  const model = this.ndutDb.model.AuthUser
  if (this.ndutAuth.helper.isMd5String(token)) {
    token = this.ndutAuth.helper.hash(token)
    const result = await model.findOne({ where: { token, status: 'ENABLED' } })
    if (!result) throw new this.Boom.Boom('Invalid/expired token or user is disabled', { token: { token: 'invalid' } })
    return result
  }
  const decoded = await verifyJwt(this, token)
  const result = await model.findOne({ where: { id: decoded.payload.uid, status: 'ENABLED' } })
  if (!result) throw new this.Boom.Boom('Invalid token or user is disabled', { token: { token: 'invalid' } })
  if (this.ndutAuth.helper.hash(decoded.payload.apiKey) !== result.token)
    throw new this.Boom.Boom('Invalid/expired token. Please get a new one', { token: { token: 'invalid' } })
  return result
}
