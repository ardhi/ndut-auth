module.exports = async function beforeFindAuth ({ model, params = {}, filter = {} }) {
  const private = await this.ndutAuth.helper.isPrivateModel(model)
  params.where = params.where || {}
  filter.user = filter.user || {}
  if (private && filter.user.id && filter.user.username !== 'admin') params.where.userId = filter.user.id
}
