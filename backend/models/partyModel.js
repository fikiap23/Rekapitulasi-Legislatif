import mongoose from 'mongoose'

const candidateSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const partySchema = mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    number_party: { type: Number, required: true, unique: true },
    path: { type: String, required: true },
    logoUrl: { type: String, required: true },
    dapil: [
      {
        number_dapil: { type: Number, required: true },
        candidates: [candidateSchema], // Subschema for candidates
      },
    ],
  },
  { timestamps: true }
)

const Party = mongoose.model('Party', partySchema)

export default Party
