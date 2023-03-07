module.exports = async function (user) {
  return this.ndutAuth.helper.hash(user.password)
}
