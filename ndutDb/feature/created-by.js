module.exports = async function ({ builder, model, schema, options }) {
  builder.defineProperty(schema.name, 'createdBy', {
    type: Number,
    required: false,
    index: true,
    default: 0,
    scale: 0
  })
}
