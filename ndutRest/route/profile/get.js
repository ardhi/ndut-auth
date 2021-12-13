module.exports = {
  schema: {
    description: 'Show your own profile',
    tags: ['Auth']
  },
  handler: async function (request, reply) {
    return {
      data: request.user
    }
  }
}
