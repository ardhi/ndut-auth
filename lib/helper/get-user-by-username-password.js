const verifyPassword = require('../misc/verify-password')

module.exports = async function (username, password, siteId) {
  const { aneka } = this.ndut.helper
  const where = { username, status: 'ENABLED' }
  if (aneka.isSet(siteId)) where.siteId = siteId
  const result = await this.ndutDb.model.AuthUser.findOne({ where })
  if (!result) throw new this.Boom.Boom('Unknown user or user is disabled', { data: { username: 'unknwon' } })
  const check = await verifyPassword(password, result.password)
  if (!check) throw new this.Boom.Boom('Invalid password', { data: { password: 'invalid' }})
  return result
}
