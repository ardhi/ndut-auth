module.exports = async function (model, request, ...args) {
  const private = await this.ndutAuth.helper.isPrivateModel(model)
  args[0] = args[0] || {}
  const where = args[0].where || {}
  if (private && request.user) where.userId = request.user.id
  args[0].where = where
  // findOne() doesn't support options, so pushed in query/filter
  if (request.user) args[0].userId = request.user.id
  return args
}
