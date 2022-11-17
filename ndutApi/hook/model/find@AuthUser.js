module.exports = {
  before: async function ({ model, params = {}, options = {}, filter = {} }) {
    options.omittedColumns = ['password', 'token']
  }
}
