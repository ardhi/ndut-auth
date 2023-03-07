const defBasicAuth = require('../../lib/db-provider/basic-auth')

module.exports = async function (request) {
  const { _, getNdutConfig } = this.ndut.helper
  const config = getNdutConfig('ndutAuth')
  let result
  let e = this.Boom.internal('invalidAuthorizationHandler', { ndut: 'auth' })
  for (const p of config.provider) {
    if (p === 'ndutDb') {
      try {
        result = await defBasicAuth.call(this, request)
      } catch (err) {
        e = err
      }
    } else {
      try {
        result = await this[p].helper.getUserByBasicAuth(request)
      } catch (err) {
        e = err
      }
    }
    if (result) break
  }
  if (result) return result
  throw e
}
