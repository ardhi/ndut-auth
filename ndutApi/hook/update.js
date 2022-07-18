module.exports = async function beforeUpdateAuth ({ model, params = {}, body = {}, filter = {} }) {
  const private = await this.ndutAuth.helper.isPrivateModel(model)
  const updatedBy = await this.ndutAuth.helper.isUpdatedByModel(model)
  filter.user = filter.user || {}
  if (!filter.user.id) return
  if (updatedBy) body.updatedBy = filter.user.id
  if (private) {
    if (filter.user.username === 'admin' && body.userId) return
    params.userId = filter.user.id
    body.userId = filter.user.id
  }
}
