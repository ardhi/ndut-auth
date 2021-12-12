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
  if (!_.isEmpty(request.query[config.apiKeyQueryString]) && config.strategy.apiKey) return 'apiKeyQs'
  let method = _.get(request, 'headers.authorization', '').split(' ')[0]
  if (method === 'Basic' && config.strategy.apiKey) return 'basic'
  if (method === 'Bearer' && config.strategy.apiKey) return 'apiKey'
  if (!_.isEmpty(request.headers[config.apiKeyHeader.toLowerCase()])) return 'apiKeyHeader'
  return false
}

module.exports = async function (request, reply) {
  if (!isProtectedRoute(request)) return
  let user = null
  const strategy = getStrategy(request)
  try {
    if (strategy === 'basic') user = await this.ndutAuth.helper.getUserByBasicAuth(request, reply)
    else if (strategy === 'apiKey') user = await this.ndutAuth.helper.getUserByApiKeyAuth(request, reply)
    else if (strategy === 'apiKeyQs') user = await this.ndutAuth.helper.getUserByApiKeyAuth(request, reply, 'qs')
    else if (strategy === 'apiKeyHeader') user = await this.ndutAuth.helper.getUserByApiKeyAuth(request, reply, 'header')
    else throw this.Boom.unauthorized('Can\'t find any supported authentication methods')
    request.user = user
  } catch (err) {
    if (!err.isBoom) err = this.Boom.boomify(err)
    err.output.statusCode = 401
    err.reformat()
    reply.header('WWW-Authenticate', strategy)
    throw err
  }
}
