const getStrategy = async request => {
  const { _, getNdutConfig } = request.server.ndut.helper
  const config = getNdutConfig('ndut-auth')
  if (!_.isEmpty(request.query[config.apiKeyQueryString]) && config.strategy.apiKey) return 'apiKeyQs'
  let method = _.get(request, 'headers.authorization', '').split(' ')[0]
  if (method === 'Basic' && config.strategy.apiKey) return 'basic'
  if (method === 'Bearer' && config.strategy.apiKey) return 'apiKey'
  if (!_.isEmpty(request.headers[config.apiKeyHeader.toLowerCase()])) return 'apiKeyHeader'
  return false
}

module.exports = async function (type, request, useUrl) {
  let user = null
  if (request.session && request.session.user) {
    user = request.session.user
    request.authStrategy = 'session'
    request.user = user
  } else request.authStrategy = await getStrategy.call(this, request)
  const protected = !!this.ndutAuth.helper.routeMatch(request, this.ndutAuth.protected[type], useUrl)
  if (!protected) return
  if (!user && request.authStrategy === 'basic') user = await this.ndutAuth.helper.getUserByBasicAuth(request)
  if (!user && request.authStrategy === 'apiKey') user = await this.ndutAuth.helper.getUserByApiKeyAuth(request)
  if (!user && request.authStrategy === 'apiKeyQs') user = await this.ndutAuth.helper.getUserByApiKeyAuth(request, 'qs')
  if (!user && request.authStrategy === 'apiKeyHeader') user = await this.ndutAuth.helper.getUserByApiKeyAuth(request, 'header')
  if (user && request.session && request.authStrategy !== 'session') request.session.user = user
  if (!user) throw new Error('Can\'t find any supported authentication methods')
  request.user = user
  request.protected = protected
}
