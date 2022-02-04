const verifyPassword = require('../../../lib/misc/verify-password')

module.exports = {
  schema: {
    description: 'Change your password',
    tags: ['Auth'],
    body: {
      type: 'object',
      properties: {
        current: {
          type: 'string'
        },
        new: {
          type: 'string'
        }
      },
      required: ['current', 'new']
    }
  },
  handler: async function (request, reply) {
    const { t } = this.ndutI18N.helper
    const model = 'AuthUser'
    // TODO: strong password detection
    const check = await verifyPassword(request.body.current, request.user.password, request.site.id)
    if (!check) throw this.Boom.badData('invalidPassword', { current: 'invalid', ndut: 'auth' })
    const params = { id: request.user.id }
    const body = { password: request.body.new }
    await this.ndutApi.helper.update({ model, params, body })
    return {
      message: t('passwordUpdated', { ns: 'auth' })
    }
  }
}
