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
  const protected = !!this.ndutAuth.helper.routeMatch(request, this.ndutAuth.protected[type], useUrl)
  if (!protected) return
  let user = null
  request.authStrategy = await getStrategy.call(this, request)
  if (request.authStrategy === 'basic') user = await this.ndutAuth.helper.getUserByBasicAuth(request)
  else if (request.authStrategy === 'apiKey') user = await this.ndutAuth.helper.getUserByApiKeyAuth(request)
  else if (request.authStrategy === 'apiKeyQs') user = await this.ndutAuth.helper.getUserByApiKeyAuth(request, 'qs')
  else if (request.authStrategy === 'apiKeyHeader') user = await this.ndutAuth.helper.getUserByApiKeyAuth(request, 'header')
  else throw new Error('Can\'t find any supported authentication methods')
  request.user = user
  request.protected = protected
}
