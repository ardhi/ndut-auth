module.exports = async function beforeCreateAuth ({ model, body = {}, filter = {} }) {
  const supported = await this.ndutAuth.helper.isUserSupportedModel(model)
  const private = await this.ndutAuth.helper.isPrivateModel(model)
  const createdBy = await this.ndutAuth.helper.isCreatedByModel(model)
  const updatedBy = await this.ndutAuth.helper.isUpdatedByModel(model)
  filter.user = filter.user || {}
  if (!filter.user.id) return
  if (createdBy) body.createdBy = filter.user.id
  if (updatedBy) body.updatedBy = filter.user.id
  if (private) {
    if (filter.user.username === 'admin' && body.userId) return
    body.userId = filter.user.id
    return
  }
  if (supported && !body.userId) body.userId = filter.user.id
}
