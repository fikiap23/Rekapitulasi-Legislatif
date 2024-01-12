import mongoose from 'mongoose'

const PartySchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },

  path: {
    type: String,
    required: true,
  },

  logoUrl: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },
})

const Party = mongoose.model('Party', PartySchema)

export default Party
