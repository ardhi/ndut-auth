module.exports = async function beforeUpdateAuth ({ model, params = {}, body = {}, filter = {} }) {
  const private = await this.ndutAuth.helper.isPrivateModel(model)
  const updatedBy = await this.ndutAuth.helper.isUpdatedByModel(model)
  const filterUserId = (filter.user || {}).id
  if (updatedBy && filterUserId) body.updatedBy = filterUserId
  if (private && filterUserId) params.userId = filterUserId
}
