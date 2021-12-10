const { createVerifier } = require('fast-jwt')
const { _, getNdutConfig } = require('ndut-helper')

module.exports = async function (token) {
  const config = getNdutConfig(this, 'ndut-auth')
  const options = _.cloneDeep(config.jwt)
  options.complete = true
  const verifier = createVerifier(options)
  return await verifier(token)
}
