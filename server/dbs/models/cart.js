import mongoose from 'mongoose'

let schema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  detail: {
    type: Array,
    required: true
  },
  cartNo: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  }
})

export default mongoose.model('Cart', schema)
