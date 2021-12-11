const supported = ['apiKey', 'jwt']
const { _ } = require('ndut-helper')
const createJwt = require('../../../../lib/misc/create-jwt')

module.exports = {
  schema: {
    description: 'Create your own authentication token',
    tags: ['Auth'],
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Choose between "apiKey" for bearer token or "jwt" for jsonwebtoken'
        }
      },
      required: ['id']
    },
    body: {
      type: 'object',
      properties: {
        username: {
          type: 'string'
        },
        password: {
          type: 'string'
        }
      },
      required: ['username', 'password']
    }
  },
  async handler (request, reply) {
    if (!supported.includes(request.params.id)) throw this.Boom.notFound('Resource not found')
    const { username, password } = request.body || {}
    try {
      const result = await this.ndutAuth.helper.getUserByUsernamePassword(username, password)
      if (request.params.id === 'apiKey') return { token: this.ndutAuth.helper.hash(result.password) }
      if (request.params.id === 'jwt') return createJwt(this, result)
    } catch (err) {
      if (!err.isBoom) err = this.Boom.boomify(err)
      err.output.statusCode = 422
      err.reformat()
      throw err
    }
  }
}
