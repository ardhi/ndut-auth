const verifyPassword = require('../../lib/misc/verify-password')

module.exports = async function (username, password, siteId) {
  const { aneka } = this.ndut.helper
  const where = { username, status: 'ENABLED' }
  if (aneka.isSet(siteId)) where.siteId = siteId
  let result
  try {
    const user = await this.ndutApi.helper.findOne('AuthUser', { where })
    result = user.data
  } catch (err) {}
  if (!result) throw new this.Boom.Boom('Unknown user or user is disabled', { data: { username: 'unknown' } })
  const check = await verifyPassword(password, result.password)
  if (!check) throw new this.Boom.Boom('Invalid password', { data: { password: 'invalid' }})
  return result
}
