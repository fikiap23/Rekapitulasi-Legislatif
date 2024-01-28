import mongoose from 'mongoose'

const tpsSchema = new mongoose.Schema({
  tps_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tps',
    required: true,
  },
  village_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Village',
    required: true,
  },
  district_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: true,
  },
  total_voters: {
    type: Number,
    required: true,
    min: [0, 'Total pemilih harus non-negatif.'],
  },
  total_invalid_ballots: {
    type: Number,
    default: 0,
    min: [0, 'Total suara tidak sah harus non-negatif.'],
  },
  total_valid_ballots: {
    type: Number,
    default: 0,
    min: [0, 'Total suara sah harus non-negatif.'],
  },
  valid_ballots_detail: [
    {
      party_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
      },
      code: {
        type: String,
      },
      name: {
        type: String,
      },
      logoUrl: {
        type: String,
      },
    },
  ],
})

export default mongoose.model('Tps', tpsSchema)
