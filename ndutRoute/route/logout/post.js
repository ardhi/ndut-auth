module.exports = function (request, reply) {
  const { getNdutConfig } = this.ndut.helper
  const options = getNdutConfig('ndut-auth')
  if (!request.session) throw new Error('Session is not available')
  if (request.session.user) {
    request.session.user = null
    if (options.route.afterLogout) reply.redirect(options.route.afterLogout)
    else reply.send('Logout successfully')
  } else throw new Error('Not Authenticated')
}
