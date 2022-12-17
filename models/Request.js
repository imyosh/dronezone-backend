const mongooes = require('mongoose')
const Schema = mongooes.Schema

const RequestSchema = new Schema(
  {
    sender_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    senderData: {
      type: Object,
      required: true,
    },

    receiver_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    receiverData: {
      type: Object,
      required: true,
    },

    export_id: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Processing', 'Shipping', 'Delivered', 'Canceled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
)

const Request = mongooes.model('Request', RequestSchema)
module.exports = Request
