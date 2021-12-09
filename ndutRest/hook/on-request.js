const { _, getNdutConfig } = require('ndut-helper')

module.exports = async function (request, reply) {
  const site = request.site || {}
  const config = getNdutConfig(this, 'ndut-auth')
  let user = null
  try {
    // TODO: check route needs to be authenticated or not
    const strategy = _.get(request, 'headers.authorization', '').split(' ')[0]
    if (_.isEmpty(strategy)) throw new Error('Authorization header is empty!')
    if (strategy === 'Basic' && config.strategy.basic) user = await this.ndutAuth.helper.getUserByBasicAuth(request, reply)
  } catch (err) {
    console.log(err)
    if (!err.isBoom) err = this.Boom.boomify(err, { statusCode: 401 })
    throw err
  }
}
