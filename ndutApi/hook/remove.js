module.exports = async function beforeRemoveAuth ({ model, params = {}, filter = {} }) {
  const private = await this.ndutAuth.helper.isPrivateModel(model)
  filter.user = filter.user || {}
  if (!filter.user.id) return
  if (private) {
    if (filter.user.username === 'admin') return
    params.userId = filter.user.id
  }
}
