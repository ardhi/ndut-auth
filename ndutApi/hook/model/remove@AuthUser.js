module.exports = async function beforeRemoveAuth ({ model, params = {}, filter = {} }) {
  const { _ } = this.ndut.helper
  const user = await this.ndutApi.helper.dbCall({ method: 'findOne', model: 'AuthUser', params: { where: { id: params.id } } })
  if (['admin'].includes(_.get(user, 'username'))) throw this.Boom.forbidden('cantRemoveAdmin', { ndut: 'auth' })
}
