const { createSigner } = require('fast-jwt')
const { _, luxon, getNdutConfig } = require('ndut-helper')
const { DateTime } = luxon

module.exports = async function (user) {
  const config = getNdutConfig(this, 'ndut-auth')
  const sign = createSigner(config.jwt)
  const apiKey = this.ndutAuth.helper.hash(user.password)
  const payload = { uid: user.id, apiKey }
  const token = await sign(payload)
  const expiresAt = DateTime.now().plus(config.jwt.expiresIn).toJSDate()
  return { token, expiresAt }
}
