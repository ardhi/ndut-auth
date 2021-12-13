const { createVerifier } = require('fast-jwt')

module.exports = async function (fastify, token) {
  const { _, getNdutConfig } = fastify.ndut.helper
  const config = getNdutConfig(fastify, 'ndut-auth')
  const options = _.cloneDeep(config.jwt)
  options.complete = true
  const verifier = createVerifier(options)
  return await verifier(token)
}
