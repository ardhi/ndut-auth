const { createSigner } = require('fast-jwt')

module.exports = async function (user) {
  const { luxon, getNdutConfig } = this.ndut.helper
  const { DateTime } = luxon
  const config = await getNdutConfig('ndut-auth')
  const sign = createSigner(config.jwt)
  const apiKey = this.ndutAuth.helper.hash(user.password)
  const payload = { uid: user.id, apiKey }
  const token = await sign(payload)
  const expiresAt = DateTime.now().plus(config.jwt.expiresIn).toJSDate()
  return { token, expiresAt }
}
