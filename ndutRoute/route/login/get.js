module.exports = async function (request, reply) {
  if (request.user) reply.view('auth:/authenticated')
  else reply.view('auth:/login-form', { url: { login: request.url } })
}
