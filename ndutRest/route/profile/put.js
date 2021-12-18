module.exports = {
  schema: {
    description: 'Update your own profile',
    tags: ['Auth']
  },
  handler: async function (request, reply) {
    const { _ } = this.ndut.helper
    const id = request.user.id
    const body = _.omit(request.body, ['password', 'token', 'status', 'id', 'siteId'])
    const model = this.ndutDb.helper.getModelByAlias('auth-user')
    await this.ndutDb.update(model, request, { id }, body)
    const data = await this.ndutDb.findById(model, request, id)
    return {
      data,
      message: 'Your profile has been successfully updated'
    }
  }
}
