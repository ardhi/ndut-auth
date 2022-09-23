const verifyPassword = require('../../lib/misc/verify-password')

module.exports = async function (username, password, siteId) {
  const { aneka } = this.ndut.helper
  const where = { username, status: 'ENABLED' }
  if (aneka.isSet(siteId)) where.siteId = siteId
  let result
  const user = await this.ndutApi.helper.findOne({ model: 'AuthUser', params: { where }, options: { noThrow: false } })
  result = user.data
  if (!result) throw this.Boom.badData('unknownUserOrUserIsDisabled', { username: 'unknown', ndut: 'auth' })
  const check = await verifyPassword(password, result.password)
  if (!check) throw this.Boom.badData('invalidPassword', { password: 'invalid', ndut: 'auth' })
  return result
}
