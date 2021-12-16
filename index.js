const crypto = require('crypto')

module.exports = async function () {
  const { fp } = this.ndut.helper
  const plugin = fp(require('./lib/plugin'))
  const name = 'ndut-auth'
  const options = this.ndut.helper.getNdutConfig(name) || {}
  options.strategy = {
    basic: true,
    apiKey: true
  }
  options.apiKeyQueryString = options.apiKeyQueryString || 'apiKey'
  options.apiKeyHeader = options.apiKeyHeader || 'X-Api-Key'
  options.jwt = options.jwt || { key: crypto.randomBytes(16).toString('hex') }
  options.jwt.expiresIn = options.jwt.expiresIn || (1000 * 60 * 60 * 24 * 7)
  const dependency = ['ndut-db']
  return { name, plugin, options, dependency, appModes: ['serve', 'build'] }
}
