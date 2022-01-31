const verifyPassword = require('../../lib/misc/verify-password')

module.exports = async function (username, password, siteId) {
  const { aneka } = this.ndut.helper
  const where = { username, status: 'ENABLED' }
  if (aneka.isSet(siteId)) where.siteId = siteId
  let result
  try {
    const user = await this.ndutApi.helper.findOne({ model: 'AuthUser', params: { where } })
    result = user.data
  } catch (err) {}
  if (!result) throw this.Boom.badData('Unknown user or user is disabled', { username: 'unknown' })
  const check = await verifyPassword(password, result.password)
  if (!check) throw this.Boom.badData('Invalid password', { password: 'invalid' })
  return result
}
