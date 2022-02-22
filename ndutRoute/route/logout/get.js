module.exports = {
  dependency: ['ndut-session'],
  handler: async function (request, reply) {
    const { getUrl } = this.ndutRoute.helper
    if (!request.user) reply.view('route:/unauthenticated', { url: { login: getUrl('/login', 'auth') } })
    else reply.view('auth:/logout-form', { url: { logout: request.url } })
  }
}
