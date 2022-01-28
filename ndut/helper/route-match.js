module.exports = function (request, routes, useUrl) {
  const { _, outmatch } = request.server.ndut.helper
  let found
  _.each(routes, r => {
    let pattern = r.path
    let path = request.routerPath
    if (useUrl) {
      _.forOwn(request.params, (v, k) => {
        if (k === '*') return
        pattern = pattern.replaceAll(`:${k}`, v)
      })
      path = request.url
    }
    const isPath = outmatch(pattern)(path)
    let isMethod = false
    const methods = _.isString(request.routerMethod) ? [request.routerMethod] : request.routerMethod
    _.each(methods, m => {
      if (outmatch(r.method)(m)) isMethod = true
    })
    if (isPath && isMethod) {
      found = r
      return false
    }
  })
  return found
}
