const verifyJwt = require('../misc/verify-jwt')

module.exports = async function (request, method = 'bearer') {
  const { getNdutConfig } = this.ndut.helper
  const authConfig = getNdutConfig('ndut-auth')
  let token = ''
  if (method === 'qs') token = request.query[authConfig.apiKeyQueryString]
  else if (method === 'header') token = request.headers[authConfig.apiKeyHeader.toLowerCase()]
  else token = (request.headers.authorization || '').split(' ')[1]
  const where = { status: 'ENABLED' }
  let result
  if (this.ndutAuth.helper.isMd5String(token)) {
    where.token = this.ndutAuth.helper.hash(token)
    try {
      result = await this.ndutApi.helper.dbCall({ method: 'findOne', model: 'AuthUser', params: { where } })
    } catch (err) {}
      if (!result) throw this.Boom.badData('invalidExpiredTokenOrUserIsDisabled', { token: 'invalid', ndut: 'auth' })
    return result
  }
  const decoded = await verifyJwt.call(this, token)
  where.id = decoded.payload.uid
  try {
    result = await this.ndutApi.helper.dbCall({ method: 'findOne', model: 'AuthUser', params: { where } })
  } catch (err) {}
  if (!result) throw this.Boom.badData('invalidTokenOrUserIsDisabled', { token: 'invalid', ndut: 'auth' })
  if (this.ndutAuth.helper.hash(decoded.payload.apiKey) !== result.token)
    throw this.Boom.badData('invalidExpiredTokenPleaseGetANewOne', { token: 'invalid', ndut: 'auth' })
  return result
}
