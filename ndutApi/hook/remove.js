module.exports = async function beforeRemoveAuth ({ model, params = {}, filter = {} }) {
  const private = await this.ndutAuth.helper.isPrivateModel(model)
  if (private && (filter.user || {}).id) params.userId = filter.user.id
}
