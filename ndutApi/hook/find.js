module.exports = async function beforeFindAuth ({ model, params = {}, filter = {} }) {
  const private = await this.ndutAuth.helper.isPrivateModel(model)
  params.where = params.where || {}
  if (private && (filter.user || {}).id) params.where.userId = filter.user.id
}
