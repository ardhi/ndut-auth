const { createSigner } = require('fast-jwt')
const { _, luxon, getNdutConfig } = require('ndut-helper')
const { DateTime } = luxon

module.exports = async function (fastify, user) {
  const config = getNdutConfig(fastify, 'ndut-auth')
  const sign = createSigner(config.jwt)
  const apiKey = fastify.ndutAuth.helper.hash(user.password)
  const payload = { uid: user.id, apiKey }
  const token = await sign(payload)
  const expiresAt = DateTime.now().plus(config.jwt.expiresIn).toJSDate()
  return { token, expiresAt }
}