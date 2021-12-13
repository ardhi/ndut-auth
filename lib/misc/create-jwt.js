const { createSigner } = require('fast-jwt')

module.exports = async function (fastify, user) {
  const { luxon, getNdutConfig } = fastify.ndut.helper
  const { DateTime } = luxon
  const config = getNdutConfig(fastify, 'ndut-auth')
  const sign = createSigner(config.jwt)
  const apiKey = fastify.ndutAuth.helper.hash(user.password)
  const payload = { uid: user.id, apiKey }
  const token = await sign(payload)
  const expiresAt = DateTime.now().plus(config.jwt.expiresIn).toJSDate()
  return { token, expiresAt }
}
