const { _ } = require('ndut-helper')

const replacePassword = async (scope, item) => {
  const { isBcryptString, hashPassword, hash } = scope.ndutAuth.helper
  if (_.isEmpty(item.password)) return
  if (!isBcryptString(item.password)) item.password = await hashPassword(item.password)
  item.token = hash(hash(item.password))
}

module.exports = {
  'before save': async function (ctx) {
    await replacePassword(this, ctx.instance || ctx.data)
  }
}
