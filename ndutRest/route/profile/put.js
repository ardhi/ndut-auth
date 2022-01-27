module.exports = {
  schema: {
    description: 'Update your own profile',
    tags: ['Auth']
  },
  handler: async function (request, reply) {
    const { _ } = this.ndut.helper
    const { getModelByAlias } = this.ndutDb.helper
    const body = _.omit(request.body, ['password', 'token', 'status', 'id', 'siteId'])
    const model = await getModelByAlias('auth-user')
    const params = { id: request.user.id }
    const opts = { message: 'Your profile has been successfully updated' }
    return await this.ndutApi.helper.update({ model, params, body, opts })
  }
}
