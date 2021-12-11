const { fp, _, aneka } = require('ndut-helper')
const { requireBase } = aneka
const getUserByBasicAuth = require('./strategy/basic')
const getUserByApiKeyAuth = require('./strategy/api-key')
const getUserByUsernamePassword = require('./helper/get-user-by-username-password')
const isBcryptString = require('./helper/is-bcrypt-string')
const hash = require('./helper/hash')

const sanitize = (routes, prefix = '') => {
  if (_.isPlainObject(routes)) {
    routes = Object.keys(routes).map(k => ({ path: k, method: routes[k] }))
  } else if (!_.isArray(routes)) {
    routes = ['*']
  }
  return routes.map(p => {
    if (_.isString(p)) p = { path: p, method: ['*'] }
    if (p.path[0] === '/') p.path = p.path.substr(1)
    p.path = prefix + p.path
    return p
  })
}

module.exports = fp(async function (fastify, options) {
  const { config } = fastify
  let protectedRoutes = []
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
  const helper = {
    getUserByBasicAuth,
    getUserByApiKeyAuth,
    getUserByUsernamePassword,
    isBcryptString,
    hash
  }
  _.forOwn(helper, (v, k) => {
    helper[k] = v.bind(fastify)
  })

  fastify.decorate('ndutAuth', { helper, options, protectedRoutes })
})
