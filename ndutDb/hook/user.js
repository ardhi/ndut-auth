const hashPassword = require('../../lib/misc/hash-password')
const isBcryptString = require('../../lib/helper/is-bcrypt-string')
const hash = require('../../lib/helper/hash')

module.exports = {
  'before save': async function (ctx) {
    const { _ } = this.ndut.helper
    const item = ctx.instance || ctx.data
    if (_.isEmpty(item.password)) return
    if (!isBcryptString(item.password)) item.password = await hashPassword(item.password)
    item.token = hash(hash(item.password))
  }
}
