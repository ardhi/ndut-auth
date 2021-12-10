const { _ } = require('ndut-helper')

module.exports = async function (request, reply) {
  const authInfo = (request.headers.authorization || '').split(' ')[1]
  const decoded = Buffer.from(authInfo, 'base64').toString()
  const [username, password] = decoded.split(':')
  return await this.ndutAuth.helper.getUserByUsernamePassword(username, password)
}
