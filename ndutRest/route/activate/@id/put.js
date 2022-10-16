const schema = require('./put-schema.json')

const handler = async function (request, reply) {
  const { _ } = this.ndut.helper
  const { hash } = this.ndutAuth.helper
  const options = { noThrow: true }
  const where = { or: [
    { username: request.params.id },
    { email: request.params.id }
  ]}
  let existing = await this.ndutApi.helper.dbCall({ method: 'findOne', model: 'AuthUser', params: { where }, options })
  if (_.isEmpty(existing)) throw this.Boom.badData('noSuchUsernameEmailFound', { usernameEmail: 'unknown' })
  if (existing.status !== 'UNVERIFIED') throw this.Boom.badData('userAlreadyVerified', { usernameEmail: 'verified' })
  if (hash(existing.token) !== request.body.key) throw this.Boom.badData('invalidKey', { key: 'invalid' })
  const body = { status: 'ENABLED' }
  const params = { id: existing.id }
  return await this.ndutApi.helper.update({ model: 'AuthUser', body, params, options: { reqId: request.id } })
  // TODO: send email
}

module.exports = { schema, handler }
