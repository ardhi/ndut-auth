module.exports = function (request, routes) {
  const { _, outmatch } = request.server.ndut.helper
  let found = false
  _.each(routes, r => {
    const isPath = outmatch(r.path)(request.routerPath)
    let isMethod = false
    const methods = _.isString(request.routerMethod) ? [request.routerMethod] : request.routerMethod
    _.each(methods, m => {
      if (outmatch(r.method)(m)) isMethod = true
    })
    if (isPath && isMethod) {
      found = true
      return false
    }
  })
  return found
}
