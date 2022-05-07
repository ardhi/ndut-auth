module.exports = async function beforeRemoveAuth ({ model, params = {}, filter = {} }) {
  const { _ } = this.ndut.helper
  const user = await this.ndutApi.helper.findOne({ model: 'AuthUser', params: { where: { id: params.id } } })
  if (['admin'].includes(_.get(user, 'data.username'))) throw this.Boom.forbidden('cantRemoveAdmin', { ndut: 'auth' })
}
