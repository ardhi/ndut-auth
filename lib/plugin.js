const { fp, _ } = require('ndut-helper')
const getUserByBasicAuth = require('./strategy/basic')
const getUserByBearerAuth = require('./strategy/bearer')
const getUserByJwtAuth = require('./strategy/jwt')
const getUserByUsernamePassword = require('./get-user-by-username-password')
const hashPassword = require('./hash-password')
const verifyPassword = require('./verify-password')
const isBcryptString = require('./is-bcrypt-string')
const createJwt = require('./create-jwt')
const verifyJwt = require('./verify-jwt')
const hash = require('./hash')

module.exports = fp(async function (fastify, options) {
  const helper = {
    createJwt,
    verifyJwt,
    getUserByBasicAuth,
    getUserByBearerAuth,
    getUserByJwtAuth,
    getUserByUsernamePassword,
    hashPassword,
    verifyPassword,
    isBcryptString,
    hash
  }
  _.forOwn(helper, (v, k) => {
    helper[k] = v.bind(fastify)
  })
  fastify.decorate('ndutAuth', { helper, options })
})
