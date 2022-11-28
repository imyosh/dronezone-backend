const mongooes = require('mongoose')
const Schema = mongooes.Schema

const NetworkSchema = new Schema(
  {
    nodes: {
      type: Schema.Types.Array,
      required: true,
    },

    exports: {
      type: Schema.Types.Array,
      required: false,
    },

    admin_id: {
      type: String,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const Network = mongooes.model('Network', NetworkSchema)
module.exports = Network
