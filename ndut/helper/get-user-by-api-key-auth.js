const defApiKeyAuth = require('../../lib/db-provider/api-key-auth')

module.exports = async function (request, method = 'bearer') {
  const { _, getNdutConfig } = this.ndut.helper
  const config = getNdutConfig('ndutAuth')
  let result
  let e = this.Boom.internal('invalidAuthorizationHandler', { ndut: 'auth' })
  for (const p of config.provider) {
    if (p === 'ndutDb') {
      try {
        result = await defApiKeyAuth.call(this, request, method)
      } catch (err) {
        e = err
      }
    } else {
      try {
        result = await this[p].helper.getUserByApiKeyAuth(request, method)
      } catch (err) {
        e = err
      }
    }
    if (result) break
  }
  if (result) return result
  throw e
}
