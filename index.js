module.exports = async function (fastify) {
  const options = {}
  const dependency = ['ndut-db']
  return { options, dependency }
}
