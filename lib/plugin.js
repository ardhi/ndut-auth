const { fp } = require('ndut-helper')
const getUserByBasicAuth = require('./strategy/basic')
const hashPassword = require('./hash-password')
const verifyPassword = require('./verify-password')
const isBcryptString = require('./is-bcrypt-string')

module.exports = fp(async function (fastify, options) {
  const helper = {
    getUserByBasicAuth,
    hashPassword,
    verifyPassword,
    isBcryptString
  }
  fastify.decorate('ndutAuth', { helper })
})
