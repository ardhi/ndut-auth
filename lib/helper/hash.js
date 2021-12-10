const crypto = require('crypto')

module.exports = function (text, hash = 'md5', digest = 'hex') {
  return crypto.createHash(hash).update(text).digest(digest)
}
