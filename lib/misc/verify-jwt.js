const { createVerifier } = require('fast-jwt')

module.exports = async function (token) {
  const { _, getNdutConfig } = this.ndut.helper
  const config = getNdutConfig('ndut-auth')
  const options = _.cloneDeep(config.jwt)
  options.complete = true
  const verifier = createVerifier(options)
  return await verifier(token)
}
