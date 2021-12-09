const { _ } = require('ndut-helper')

module.exports = async function (request, reply) {
  const authInfo = (request.headers.authorization || '').split(' ')[1]
  const decoded = Buffer.from(authInfo, 'base64').toString()
  const [username, password] = decoded.split(':')
  const model = request.server.ndutDb.model.AuthUser
  const result = await model.findOne({ where: { username, status: 'ENABLED' } })
  if (!result) {
    reply.header('WWW-Authenticate', 'Basic')
    throw new Error('Unknown user or user is disabled!')
  }
  return result
}
