import mongoose from 'mongoose'

let schema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  value: {
    type: String,
    unique: true,
    required: true
  }
})

export default mongoose.model('Province', schema)
