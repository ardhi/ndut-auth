const isBcryptString = require('../../lib/is-bcrypt-string')
const hashPassword = require('../../lib/hash-password')
const hash = require('../../lib/hash')
const { _ } = require('ndut-helper')

const replacePassword = async item => {
  if (_.isEmpty(item.password)) return
  if (!isBcryptString(item.password)) item.password = await hashPassword(item.password)
  item.token = hash(hash(item.password))
}

module.exports = {
  'before save': async function (ctx) {
    await replacePassword(ctx.instance || ctx.data)
  }
}
