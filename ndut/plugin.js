const sanitize = (routes, prefix = '') => {
  if (typeof routes === 'object' && routes.constructor == Object) {
    routes = Object.keys(routes).map(k => ({ path: k, method: routes[k] }))
  } else if (!Array.isArray(routes)) {
    routes = ['*']
  }
  return routes.map(p => {
    if (typeof p === 'string') p = { path: p, method: ['*'] }
    if (p.path[0] === '/') p.path = p.path.substr(1)
    p.path = (prefix + p.path).replace(/\/\//g, '/')
    return p
  })
}

const plugin = async function (scope, options) {
  const { _, aneka, getNdutConfig } = scope.ndut.helper
  const { requireBase } = aneka
  const config = await scope.ndut.helper.getConfig()
  let restConfig
  if (scope.ndutRest) restConfig = await getNdutConfig('ndut-rest')
  // TODO: protected routes for non-api routes?
  scope.ndutAuth.protected = {}
  const mapper = [
    { name: 'ndut-route', instance: 'ndutRoute', alias: 'route' },
    { name: 'ndut-rest', instance: 'ndutRest', alias: 'rest' }
  ]
  for (const m of mapper) {
    if (!scope[m.instance]) continue
    const opts = await getNdutConfig(m.name)
    let items = []
    for (let n of config.nduts) {
      n = await getNdutConfig(n)
      try {
        const routes = await requireBase(`${n.dir}/ndutAuth/protected/${m.alias}.json`, scope) || ['*']
        items = _.concat(items, sanitize(routes, `/${n.prefix}/`))
      } catch (err) {}
    }
    items = _.map(items, r => {
      r.path = `/${opts.prefix}${r.path}`
      return r
    })
    scope.ndutAuth.protected[m.alias] = items
  }
}

module.exports = async function () {
  const { fp } = this.ndut.helper
  return fp(plugin)
}
