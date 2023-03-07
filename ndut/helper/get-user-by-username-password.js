const defUsernamePassword = require('../../lib/db-provider/username-password')

module.exports = async function (username, password, siteId) {
  const { _, getNdutConfig } = this.ndut.helper
  const config = getNdutConfig('ndutAuth')
  let result
  let e = this.Boom.internal('invalidAuthorizationHandler', { ndut: 'auth' })
  for (const p of config.provider) {
    if (p === 'ndutDb') {
      try {
        result = await defUsernamePassword.call(this, username, password, siteId)
      } catch (err) {
        e = err
      }
    } else {
      try {
        result = await this[p].helper.getUserByUsernamePassword(username, password, siteId)
      } catch (err) {
        e = err
      }
    }
    if (result) break
  }
  if (result) return result
  throw e
}
