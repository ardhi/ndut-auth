const { _, getNdutConfig } = require('ndut-helper')

const strategies = ['Basic', 'Bearer', 'JWT']

module.exports = async function (request, reply) {
  const site = request.site || {}
  const config = getNdutConfig(this, 'ndut-auth')
  // TODO: check route needs to be authenticated or not
  let user = null
  let strategy = _.get(request, 'headers.authorization', '').split(' ')[0]
  if (_.isEmpty(strategy)) throw new Error('Authorization header is empty!')
  if (!strategies.includes(strategy)) throw new Error('Unsupported authentication method')
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

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImFwaUtleSI6ImZjYTFhMDg5ODIzNjBlZjQyNDFmZDNjN2M5MGFkNzgwIiwiaWF0IjoxNjM5MTExNTM4LCJleHAiOjE2Mzk3MTYzMzh9.c0YuyjkPNZQd4JihZW4jBR4RrQVXeyL55bWbOTTcftQ