module.exports = async function beforeCreateAuth ({ model, body = {}, filter = {} }) {
  const supported = await this.ndutAuth.helper.isUserSupportedModel(model)
  const private = await this.ndutAuth.helper.isPrivateModel(model)
  const createdBy = await this.ndutAuth.helper.isCreatedByModel(model)
  const filterUserId = (filter.user || {}).id
  if (createdBy && filterUserId) body.createdBy = filterUserId
  if (private && filterUserId) {
    body.userId = filterUserId
    return
  }
  if (supported && filterUserId && !body.userId) body.userId = filterUserId
}
