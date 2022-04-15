const schema = require('./post-schema.json')

const handler = async function (request, reply) {
  const { _ } = this.ndut.helper
  const { username, email } = request.body || {}
  const options = { noThrow: true  }
  let existing = await this.ndutApi.helper.findOne({ model: 'AuthUser', params: { where: { username } }, options })
  if (!_.isEmpty(existing.data)) throw this.Boom.badData('usernameTaken', { username: 'taken' })
  existing = await this.ndutApi.helper.findOne({ model: 'AuthUser', params: { where: { email } }, options })
  if (!_.isEmpty(existing.data)) throw this.Boom.badData('emailTaken', { email: 'taken' })
  const { body, site } = request
  body.status = 'UNVERIFIED'
  return await this.ndutApi.helper.create({ model: 'AuthUser', body, filter: { site }, options: { reqId: request.id } })
  // TODO: send email
}

module.exports = { schema, handler }
