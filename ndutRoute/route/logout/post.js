module.exports = {
  dependency: ['ndut-session'],
  handler: function (request, reply) {
    const { getNdutConfig } = this.ndut.helper
    const { getUrl } = this.ndutRoute.helper
    const options = getNdutConfig('ndut-auth')
    if (request.session.user) {
      request.session.user = null
      if (options.route.afterLogout) reply.redirect(options.route.afterLogout)
      else reply.view('auth:/logout-successfull')
    } else reply.view('route:/unauthenticated', { url: { login: getUrl('/login', 'auth') } })
  }
}
