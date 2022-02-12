module.exports = async function beforeCreateAuth ({ model, body = {}, filter = {} }) {
  const supported = await this.ndutAuth.helper.isUserSupportedModel(model)
  const private = await this.ndutAuth.helper.isPrivateModel(model)
  if ((supported || private) && (filter.user || {}).id) body.userId = filter.user.id
}
