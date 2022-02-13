module.exports = {
  level: 40,
  handler: async function (request) {
    await handlePreHandler.call(this, request, 'static')
  }
}
