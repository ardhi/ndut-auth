module.exports = {
  dependency: ['ndut-session'],
  handler: async function (request, reply) {
    if (request.user) reply.view('auth:/authenticated')
    else reply.view('auth:/login-form', { url: { login: request.url } })
  }
}
