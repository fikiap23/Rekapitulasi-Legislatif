import mongoose from 'mongoose'

const villageResultSchema = mongoose.Schema({
  village_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Village',
  },
  total_voters: {
    type: Number,
    required: true,
  },
  total_invalid_ballots: {
    type: Number,
    default: 0,
  },
  total_valid_ballots: {
    type: Number,
    default: 0,
  },
  valid_ballots_detail: [
    {
      partyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
      },
      code: {
        type: String,
      },
      total_votes_party: {
        type: Number,
        default: 0,
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
          },
        },
      ],
    },
  ],
})

const districtResultSchema = mongoose.Schema({
  district_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
  },
  total_voters: {
    type: Number,
    required: true,
  },
  total_invalid_ballots: {
    type: Number,
    default: 0,
  },
  total_valid_ballots: {
    type: Number,
    default: 0,
  },

  valid_ballots_detail: [
    {
      partyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
      },
      code: {
        type: String,
      },
      total_votes_party: {
        type: Number,
        default: 0,
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
          },
        },
      ],
    },
  ],

  villages_detail: [
    {
      village_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Village',
      },
    },
  ],
})

const regencyResultSchema = mongoose.Schema({
  regency_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Regency',
  },
  total_voters: {
    type: Number,
    required: true,
  },
  total_invalid_ballots: {
    type: Number,
    default: 0,
  },
  total_valid_ballots: {
    type: Number,
    default: 0,
  },

  valid_ballots_detail: [
    {
      partyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Party',
      },
      code: {
        type: String,
      },
      total_votes_party: {
        type: Number,
        default: 0,
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
          },
        },
      ],
    },
  ],

  districts_detail: [
    {
      district_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
      },
    },
  ],
})

const VillageResult = mongoose.model('VillageResult', villageResultSchema)
const DistrictResult = mongoose.model('DistrictResult', districtResultSchema)
const RegencyResult = mongoose.model('RegencyResult', regencyResultSchema)

export { VillageResult, DistrictResult, RegencyResult }
