const { _, getNdutConfig } = require('ndut-helper')
const outmatch = require('outmatch')

const isProtectedRoute = (request) => {
  const restConfig = getNdutConfig(request.server, 'ndut-rest')
  let found = false
  _.each(request.server.ndutAuth.protectedRoutes, p => {
    const isPath = outmatch(`/${restConfig.prefix}${p.path}`)(request.routerPath)
    let isMethod = false
    const methods = _.isString(request.routerMethod) ? [request.routerMethod] : request.routerMethod
    _.each(methods, m => {
      if (outmatch(p.method)(m)) isMethod = true
    })
    if (isPath && isMethod) {
      found = true
      return false
    }
  })
  return found
}

const getStrategy = request => {
  const config = getNdutConfig(request.server, 'ndut-auth')
  if (!_.isEmpty(request.query[config.apiKeyQueryString]) && config.strategy.apiKey) return 'apiKeyQuery'
  const method = _.get(request, 'headers.authorization', '').split(' ')[0]
  if (method === 'Basic' && config.strategy.apiKey) return 'basic'
  if (method === 'Bearer' && config.strategy.apiKey) return 'apiKey'
  return false
}

module.exports = async function (request, reply) {
  if (!request.routerPath || !request.routerMethod) return
  if (!isProtectedRoute(request)) return
  let user = null
  const strategy = getStrategy(request)
  try {
    if (strategy === 'basic') user = await this.ndutAuth.helper.getUserByBasicAuth(request, reply)
    else if (strategy === 'apiKey') user = await this.ndutAuth.helper.getUserByApiKeyAuth(request, reply)
    else if (strategy === 'apiKeyQuery') user = await this.ndutAuth.helper.getUserByApiKeyAuth(request, reply, true)
    else throw this.Boom.unauthorized('Can\'t find any supported authentication methods')
  } catch (err) {
    if (!err.isBoom) err = this.Boom.boomify(err)
    err.output.statusCode = 401
    err.reformat()
    reply.header('WWW-Authenticate', strategy)
    throw err
  }
}
