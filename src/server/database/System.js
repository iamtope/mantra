import mongoose from 'mongoose'

const SystemSchema = new mongoose.Schema({
  options: {
    key: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }
})

export default mongoose.model('System', SystemSchema)
