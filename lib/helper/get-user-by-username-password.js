const verifyPassword = require('../misc/verify-password')

module.exports = async function (username, password) {
  const model = this.ndutDb.model.AuthUser
  const result = await model.findOne({ where: { username, status: 'ENABLED' } })
  if (!result) throw new this.Boom.Boom('Unknown user or user is disabled', { data: { username: 'unknwon' } })
  const check = await verifyPassword(password, result.password)
  if (!check) throw new this.Boom.Boom('Invalid password', { data: { password: 'invalid' }})
  return result
}
