module.exports = async function (request, reply) {
  const { _, getNdutConfig } = this.ndut.helper
  const { getUserByUsernamePassword } = this.ndutAuth.helper
  if (!request.session) throw new Error('Session is not available')
  const options = getNdutConfig('ndut-auth')
  if (!options.strategy.login) throw new Error('Login is disabled')
  const { username, password } = request.body
  if (_.isEmpty(username)) throw this.Boom.badData('Username is required', { username: 'required' })
  if (_.isEmpty(password)) throw this.Boom.badData('Password is required', { password: 'required' })
  const user = await getUserByUsernamePassword(username, password, (request.site || {}).id)
  request.session.user = user
  if (options.route.afterLogin) reply.redirect(options.route.afterLogin)
  else reply.send('Login successfully')
}