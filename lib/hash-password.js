const bcrypt = require('bcrypt')

module.exports = async function (text, salt = 10) {
  return bcrypt.hash(text, salt)
}
