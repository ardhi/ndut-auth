const handleOnRequest = require('../../lib/handle-on-request')

module.exports = async function (request) {
  await handleOnRequest.call(this, request, 'static', true)
}
