import mongoose from 'mongoose'

const resultVoteHistorySchema = mongoose.Schema(
  {
    votesResultId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VotesResult',
      required: true,
    },
    village_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Village',
      required: true,
    },
    village_name: String,
    history: [
      {
        updated_at: {
          type: Date,
          required: true,
        },
        created_by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },

        total_voters: Number,
        total_invalid_ballots: Number,
        total_valid_ballots: Number,
        valid_ballots_detail: [
          {
            party_id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Party',
            },
            code: String,
            name: String,
            total_votes_party: Number,
            candidates: [
              {
                candidate_id: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Candidate',
                },
                name: String,
                number_of_votes: Number,
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true }
)

const VotesResultHistory = mongoose.model(
  'VotesResultHistory',
  resultVoteHistorySchema
)

export default VotesResultHistory
