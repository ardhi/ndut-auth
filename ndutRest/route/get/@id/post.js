const supported = ['apiToken', 'jwt']
const { _ } = require('ndut-helper')
const createJwt = require('../../../../lib/misc/create-jwt')

module.exports = {
  async handler (request, reply) {
    if (!supported.includes(request.params.id)) throw this.Boom.notFound('Resource not found')
    const { username, password } = request.body || {}
    if (_.isEmpty(username)) throw this.Boom.badData('Username is required', { username: 'required' })
    if (_.isEmpty(password)) throw this.Boom.badData('Password is required', { password: 'required' })
    try {
      const result = await this.ndutAuth.helper.getUserByUsernamePassword(username, password)
      if (request.params.id === 'apiToken') return { token: this.ndutAuth.helper.hash(result.password) }
      if (request.params.id === 'jwt') return createJwt(this, result)
    } catch (err) {
      if (!err.isBoom) err = this.Boom.boomify(err)
      err.output.statusCode = 422
      err.reformat()
      throw err
    }
  }
}
