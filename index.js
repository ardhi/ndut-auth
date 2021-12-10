const { getNdutConfig } = require('ndut-helper')
const plugin = require('./lib/plugin')

module.exports = async function (fastify) {
  const name = 'ndut-auth'
  const options = getNdutConfig(fastify, name) || {}
  options.strategy = {
    basic: true,
    bearer: true,
    jwt: true
  }
  options.jwt = options.jwt || { key: 'xYNHkSvQR2hBgvf9GhZi' }
  options.jwt.expiresIn = options.jwt.expiresIn || (1000 * 60 * 60 * 24 * 7)
  const dependency = ['ndut-db']
  return { name, plugin, options, dependency }
}
