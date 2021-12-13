const supported = ['generic', 'jwt']
const createJwt = require('../../../../lib/misc/create-jwt')

module.exports = {
  schema: {
    description: 'Create and get your own authentication token',
    tags: ['Auth'],
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Choose between "generic" for standard bearer token or "jwt" for jsonwebtoken'
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
      const siteId = request.site ? request.site.id : null
      const result = await this.ndutAuth.helper.getUserByUsernamePassword(username, password, siteId)
      if (request.params.id === 'generic') return { token: this.ndutAuth.helper.hash(result.password) }
      if (request.params.id === 'jwt') return createJwt(this, result)
    } catch (err) {
      if (!err.isBoom) err = this.Boom.boomify(err)
      err.output.statusCode = 422
      err.reformat()
      throw err
    }
  }
}
