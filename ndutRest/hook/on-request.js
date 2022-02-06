const handleOnRequest = require('../../lib/handle-on-request')

module.exports = {
  level: 40,
  handler: async function (request) {
    await handleOnRequest.call(this, request, 'rest')
  }
}
