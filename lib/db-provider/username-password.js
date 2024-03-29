const verifyPassword = require('../misc/verify-password')

module.exports = async function (username, password, siteId) {
  const { aneka } = this.ndut.helper
  const where = { username, status: 'ENABLED' }
  if (aneka.isSet(siteId)) where.siteId = siteId
  let result = await this.ndutApi.helper.dbCall({ method: 'findOne', model: 'AuthUser', params: { where }, options: { noThrow: false } })
  if (!result) throw this.Boom.badData('unknownUserOrUserIsDisabled', { username: 'unknown', ndut: 'auth' })
  const check = await verifyPassword(password, result.password)
  if (!check) throw this.Boom.badData('invalidPassword', { password: 'invalid', ndut: 'auth' })
  return result
}
