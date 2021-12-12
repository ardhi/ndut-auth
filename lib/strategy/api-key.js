const { _, getNdutConfig } = require('ndut-helper')
const verifyJwt = require('../misc/verify-jwt')

module.exports = async function (request, reply, method = 'bearer') {
  const authConfig = getNdutConfig(this, 'ndut-auth')
  let token = ''
  if (method === 'qs') token = request.query[authConfig.apiKeyQueryString]
  else if (method === 'header') token = request.headers[authConfig.apiKeyHeader.toLowerCase()]
  else token = (request.headers.authorization || '').split(' ')[1]
  const where = { status: 'ENABLED' }
  if (request.site) where.siteId = request.site.id
  if (this.ndutAuth.helper.isMd5String(token)) {
    where.token = this.ndutAuth.helper.hash(token)
    const result = await this.ndutDb.findOne('AuthUser', request, { where })
    if (!result) throw new this.Boom.Boom('Invalid/expired token or user is disabled', { token: { token: 'invalid' } })
    return result
  }
  const decoded = await verifyJwt(this, token)
  where.id = decoded.payload.uid
  const result = await this.ndutDb.findOne('AuthUser', request, { where })
  if (!result) throw new this.Boom.Boom('Invalid token or user is disabled', { token: { token: 'invalid' } })
  if (this.ndutAuth.helper.hash(decoded.payload.apiKey) !== result.token)
    throw new this.Boom.Boom('Invalid/expired token. Please get a new one', { token: { token: 'invalid' } })
  return result
}
