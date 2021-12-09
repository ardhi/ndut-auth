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
  const dependency = ['ndut-db']
  return { name, plugin, options, dependency }
}
