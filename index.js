const plugin = require('./lib/plugin')

module.exports = async function (fastify) {
  const name = 'ndut-auth'
  const options = fastify.ndut.helper.getNdutConfig(fastify, name) || {}
  options.strategy = {
    basic: true,
    apiKey: true
  }
  options.apiKeyQueryString = options.apiKeyQueryString || 'apiKey'
  options.apiKeyHeader = options.apiKeyHeader || 'X-Api-Key'
  options.jwt = options.jwt || { key: 'xYNHkSvQR2hBgvf9GhZi' }
  options.jwt.expiresIn = options.jwt.expiresIn || (1000 * 60 * 60 * 24 * 7)
  const dependency = ['ndut-db']
  return { name, plugin, options, dependency, appModes: ['serve', 'build'] }
}
