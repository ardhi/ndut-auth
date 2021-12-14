const getStrategy = request => {
  const { _, getNdutConfig } = request.server.ndut.helper
  const config = getNdutConfig(request.server, 'ndut-auth')
  if (!_.isEmpty(request.query[config.apiKeyQueryString]) && config.strategy.apiKey) return 'apiKeyQs'
  let method = _.get(request, 'headers.authorization', '').split(' ')[0]
  if (method === 'Basic' && config.strategy.apiKey) return 'basic'
  if (method === 'Bearer' && config.strategy.apiKey) return 'apiKey'
  if (!_.isEmpty(request.headers[config.apiKeyHeader.toLowerCase()])) return 'apiKeyHeader'
  return false
}

module.exports = async function (request, reply) {
  request.protectedRoute = this.ndutAuth.helper.routeMatch(request, this.ndutAuth.protectedRoutes)
  if (!request.protectedRoute) return
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
