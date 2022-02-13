const handlePreHandler = require('../../lib/handle-pre-handler')

module.exports = {
  level: 40,
  handler: async function (request) {
    await handlePreHandler.call(this, request, 'rest')
  }
}
