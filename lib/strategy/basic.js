const { _ } = require('ndut-helper')

module.exports = async function (request, reply) {
  const fastify = request.server
  const authInfo = (request.headers.authorization || '').split(' ')[1]
  const decoded = Buffer.from(authInfo, 'base64').toString()
  const [username, password] = decoded.split(':')
  const model = fastify.ndutDb.model.AuthUser
  const result = await model.findOne({ where: { username, status: 'ENABLED' } })
  if (!result) {
    reply.header('WWW-Authenticate', 'Basic')
    throw new Error('Unknown user or user is disabled')
  }
  const check = await fastify.ndutAuth.helper.verifyPassword(password, result.password)
  if (!check) {
    reply.header('WWW-Authenticate', 'Basic')
    throw new fastify.Boom.Boom('Invalid password', { statusCode: 401, data: { password: 'invalid' }})
  }
  return result
}
