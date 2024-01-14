import mongoose from 'mongoose'

const PartySchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  number_party: {
    type: Number,
    required: true,
  },

  path: {
    type: String,
    required: true,
  },

  logoUrl: {
    type: String,
    required: true,
  },

  dapil: [
    {
      number_dapil: {
        type: Number,
        required: true,
      },
      candidates: [
        {
          candidate_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Candidate',
          },
          candidate_name: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
})

const Party = mongoose.model('Party', PartySchema)

export default Party
