import mongoose from 'mongoose'

const VillageSchema = mongoose.Schema(
  {
    village_name: {
      type: String,
      required: true,
    },
    district_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
    },
    total_voters: {
      type: Number,
      required: true,
    },
    valid_ballots: [
      {
        partyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Party',
        },
        code: {
          type: String,
        },
        numberOfVotes: {
          type: Number,
          default: 0,
        },
      },
    ],
    invalid_ballots: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

const DistrictSchema = mongoose.Schema(
  {
    district_name: {
      type: String,
      required: true,
    },
    regency_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Regency',
    },
    villages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Village',
      },
    ],
  },
  { timestamps: true }
)

const RegencySchema = mongoose.Schema(
  {
    regency_name: {
      type: String,
      required: true,
    },
    districts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
      },
    ],
  },
  { timestamps: true }
)

const Village = mongoose.model('Village', VillageSchema)
const District = mongoose.model('District', DistrictSchema)
const Regency = mongoose.model('Regency', RegencySchema)

export { Village, District, Regency }
