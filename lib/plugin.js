const { fp } = require('ndut-helper')
const getUserByBasicAuth = require('./strategy/basic')

module.exports = fp(async function (fastify, options) {
  const helper = {
    getUserByBasicAuth
  }
  fastify.decorate('ndutAuth', { helper })
})
