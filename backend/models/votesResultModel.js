import mongoose from 'mongoose'

const resultVoteSchema = mongoose.Schema(
  {
    village_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Village',
      required: function () {
        return this.result_type === 'village'
      },
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
        total_votes_party: {
          type: Number,
          default: 0,
          min: [0, 'Total suara partai harus non-negatif.'],
        },
        candidates: [
          {
            candidate_id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Candidate',
            },
            number_of_votes: {
              type: Number,
              default: 0,
              min: [0, 'Jumlah suara kandidat harus non-negatif.'],
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
)

resultVoteSchema.index({ village_id: 1, result_type: 1 })
resultVoteSchema.index({ district_id: 1, result_type: 1 })
resultVoteSchema.index({ regency_id: 1, result_type: 1 })

const VotesResult = mongoose.model('VotesResult', resultVoteSchema)

export default VotesResult
