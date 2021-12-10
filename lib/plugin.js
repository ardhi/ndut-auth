const { fp, _, aneka } = require('ndut-helper')
const { requireBase } = aneka
const getUserByBasicAuth = require('./strategy/basic')
const getUserByBearerAuth = require('./strategy/bearer')
const getUserByJwtAuth = require('./strategy/jwt')
const getUserByUsernamePassword = require('./helper/get-user-by-username-password')
const hashPassword = require('./helper/hash-password')
const verifyPassword = require('./helper/verify-password')
const isBcryptString = require('./helper/is-bcrypt-string')
const createJwt = require('./helper/create-jwt')
const verifyJwt = require('./helper/verify-jwt')
const hash = require('./helper/hash')

const sanitizePermission = (perm, prefix = '') => {
  if (_.isPlainObject(perm)) {
    perm = Object.keys(perm).map(k => ({ path: k, method: perm[k] }))
  } else if (!_.isArray(perm)) {
    perm = ['*']
  }
  return perm.map(p => {
    if (_.isString(p)) p = { path: p, method: ['*'] }
    if (p.path[0] === '/') p.path = p.path.substr(1)
    p.path = prefix + p.path
    return p
  })
}

module.exports = fp(async function (fastify, options) {
  const { config } = fastify
  let permissions = []
  for (const n of config.nduts) {
    try {
      const perm = await requireBase(n.dir + '/ndutAuth/permission', fastify) || ['*']
      permissions = _.concat(permissions, sanitizePermission(perm, `/${n.prefix}/`))
    } catch (err) {}
  }
  try {
    const perm = await requireBase(config.dir.base + '/ndutAuth/permission', fastify) || ['*']
    permissions = _.concat(permissions, sanitizePermission(perm, '/'))
  } catch (err) {}
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

  fastify.decorate('ndutAuth', { helper, options, permissions })
})
