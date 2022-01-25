module.exports = async function ({ builder, model, schema, options }) {
  if (!model.definition.properties.userId) {
    builder.defineProperty(schema.name, 'userId', {
      type: Number,
      required: false,
      index: true,
      default: 0,
      scale: 0
    })
  }
}
