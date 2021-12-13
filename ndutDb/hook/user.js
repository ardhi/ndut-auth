const hashPassword = require('../../lib/misc/hash-password')

const replacePassword = async (scope, item, _) => {
  const { isBcryptString, hash } = scope.ndutAuth.helper
  if (_.isEmpty(item.password)) return
  if (!isBcryptString(item.password)) item.password = await hashPassword(item.password)
  item.token = hash(hash(item.password))
}

module.exports = {
  'before save': async function (ctx) {
    const { _ } = this.ndut.helper
    await replacePassword(this, ctx.instance || ctx.data, _)
  }
}
