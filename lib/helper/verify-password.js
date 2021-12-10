const bcrypt = require('bcrypt')

module.exports = async function (plain, hash) {
  return bcrypt.compare(plain, hash)
}
