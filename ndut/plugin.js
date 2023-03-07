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
  const i18nPrefix = scope.ndutI18N ? scope.ndutI18N.helper.routePrefix() : ''
  let restConfig
  if (scope.ndutRest) restConfig = getNdutConfig('ndut-rest')
  for (const p of ['protected', 'challanged']) {
    scope.ndutAuth[p] = {}
    for (const m of ['route', 'rest', 'static']) {
      const opts = getNdutConfig(m)
      if (!opts) continue
      let items = []
      for (const n of config.nduts) {
        const cfg = getNdutConfig(n)
        try {
          const routes = await requireBase(`${cfg.dir}/ndutAuth/${p}/${m}.json`, scope) || ['*']
          items = _.concat(items, sanitize(routes, `/${cfg.prefix}/`))
        } catch (err) {}
      }
      items = _.map(items, r => {
        r.path = `${opts.prefix === '' ? '' : ('/' + opts.prefix)}${m === 'static' ? '' : i18nPrefix}${r.path}`
        return r
      })
      scope.ndutAuth[p][m] = items
    }
  }
}

module.exports = async function () {
  const { fp } = this.ndut.helper
  return fp(plugin)
}
