module.exports = {
  schema: {
    description: 'Update your own profile',
    tags: ['Auth']
  },
  handler: async function (request, reply) {
    const { _ } = this.ndut.helper
    const { getModelByAlias } = this.ndutDb.helper
    const id = request.user.id
    const body = _.omit(request.body, ['password', 'token', 'status', 'id', 'siteId'])
    const model = await getModelByAlias('auth-user')
    return await this.ndutApi.helper.update(model, { id }, body, { message: 'Your profile has been successfully updated' })
  }
}
