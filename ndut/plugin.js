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

const plugin = async function (scope, options) {
  const { _, aneka, getNdutConfig } = scope.ndut.helper
  const { requireBase } = aneka
  const config = await scope.ndut.helper.getConfig()
  const restConfig = await getNdutConfig('ndut-rest')
  // TODO: protected routes for non-api routes?
  let protectedRoutes = []
  for (let n of config.nduts) {
    n = await getNdutConfig(n)
    try {
      const routes = await requireBase(n.dir + '/ndutAuth/protected-routes', scope) || ['*']
      protectedRoutes = _.concat(protectedRoutes, sanitize(routes, `/${n.prefix}/`))
    } catch (err) {}
  }
  protectedRoutes = _.map(protectedRoutes, r => {
    r.path = `/${restConfig.prefix}${r.path}`
    return r
  })

  scope.ndutAuth.options = options
  scope.ndutAuth.protectedRoutes = protectedRoutes
}

module.exports = async function () {
  const { fp } = this.ndut.helper
  return fp(plugin)
}
