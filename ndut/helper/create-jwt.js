const defCreateJwt = require('../../lib/db-provider/jwt')

module.exports = async function (user) {
  const { _, getNdutConfig } = this.ndut.helper
  const config = getNdutConfig('ndutAuth')
  let result
  let e = this.Boom.internal('invalidAuthorizationHandler', { ndut: 'auth' })
  for (const p of config.provider) {
    if (p === 'ndutDb') {
      try {
        result = await defCreateJwt.call(this, user)
      } catch (err) {
        e = err
      }
    } else {
      try {
        result = await this[p].helper.createJwt(user)
      } catch (err) {
        e = err
      }
    }
    if (result) break
  }
  if (result) return result
  throw e
}
