module.exports = async function ({ builder, model, schema, options }) {
  builder.defineProperty(schema.name, 'deletedBy', {
    type: Number,
    required: false,
    index: true,
    default: 0,
    scale: 0
  })
}
