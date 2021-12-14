const fp = require('fastify-plugin')
const getUserByBasicAuth = require('./strategy/basic')
const getUserByApiKeyAuth = require('./strategy/api-key')
const getUserByUsernamePassword = require('./helper/get-user-by-username-password')
const isBcryptString = require('./helper/is-bcrypt-string')
const isMd5String = require('./helper/is-md5-string')
const routeMatch = require('./helper/route-match')
const hash = require('./helper/hash')

const sanitize = (routes, prefix = '') => {
  if (typeof routes === 'object' && routes.constructor == Object) {
    routes = Object.keys(routes).map(k => ({ path: k, method: routes[k] }))
  } else if (!Array.isArray(routes)) {
    routes = ['*']
  }
  return routes.map(p => {
    if (typeof p === 'string') p = { path: p, method: ['*'] }
    if (p.path[0] === '/') p.path = p.path.substr(1)
    p.path = prefix + p.path
    return p
  })
}

module.exports = fp(async function (fastify, options) {
  const { _, bind, aneka, getNdutConfig } = fastify.ndut.helper
  const { requireBase } = aneka
  const { config } = fastify
  const restConfig = getNdutConfig(fastify, 'ndut-rest')
  let protectedRoutes = sanitize({
    'profile': ['GET', 'PUT'],
    'change-password': ['PUT']
  }, `/${options.prefix}/`)
  for (const n of config.nduts) {
    try {
      const routes = await requireBase(n.dir + '/ndutAuth/protected-routes', fastify) || ['*']
      protectedRoutes = _.concat(protectedRoutes, sanitize(routes, `/${n.prefix}/`))
    } catch (err) {}
  }
  try {
    const routes = await requireBase(config.dir.base + '/ndutAuth/protected-routes', fastify) || ['*']
    protectedRoutes = _.concat(protectedRoutes, sanitize(routes, '/'))
  } catch (err) {}
  protectedRoutes = _.map(protectedRoutes, r => {
    r.path = `/${restConfig.prefix}${r.path}`
    return r
  })
  const helper = bind(fastify, {
    getUserByBasicAuth,
    getUserByApiKeyAuth,
    getUserByUsernamePassword,
    isBcryptString,
    isMd5String,
    routeMatch,
    hash
  })

  fastify.decorate('ndutAuth', { helper, options, protectedRoutes })
})
