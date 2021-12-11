const { _, getNdutConfig } = require('ndut-helper')
const outmatch = require('outmatch')
const strategies = ['Basic', 'Bearer', 'JWT']

module.exports = async function (request, reply) {
  const site = request.site || {}
  const config = getNdutConfig(this, 'ndut-auth')
  const restConfig = getNdutConfig(this, 'ndut-rest')
  if (!request.routerPath || !request.routerMethod) return
  let found = false
  _.each(this.ndutAuth.protectedRoutes, p => {
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
  if (!found) return
  let user = null
  let strategy = _.get(request, 'headers.authorization', '').split(' ')[0]
  if (_.isEmpty(strategy)) throw this.Boom.unauthorized('Access denied')
  if (!strategies.includes(strategy)) throw this.Boom.unauthorized('Unsupported authentication method')
  try {
    if (strategy === 'Basic' && config.strategy.basic) user = await this.ndutAuth.helper.getUserByBasicAuth(request, reply)
    else if (strategy === 'Bearer' && config.strategy.bearer) user = await this.ndutAuth.helper.getUserByBearerAuth(request, reply)
    else if (strategy === 'JWT' && config.strategy.jwt) user = await this.ndutAuth.helper.getUserByJwtAuth(request, reply)
    else throw new Error(`Authentication method '${strategy}' is disabled`)
  } catch (err) {
    if (!err.isBoom) err = this.Boom.boomify(err)
    err.output.statusCode = 401
    err.reformat()
    if (strategies.includes(strategy)) reply.header('WWW-Authenticate', strategy)
    throw err
  }
}
