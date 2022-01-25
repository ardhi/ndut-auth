module.exports = async function (model, request, ...args) {
  const private = await this.ndutAuth.helper.isPrivateModel(model)
  args[0] = args[0] || {}
  if (private && request.user) args[0].userId = request.user.id
  args[1] = args[1] || {}
  if (request.user) args[1].userId = request.user.id
  return args
}
