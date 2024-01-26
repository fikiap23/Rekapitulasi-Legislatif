import mongoose from 'mongoose'

const VillageSchema = mongoose.Schema(
  {
    village_name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
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
    },
    is_fillBallot: {
      type: Boolean,
      default: false,
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
    code: {
      type: String,
      required: true,
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

const Village = mongoose.model('Village', VillageSchema)
const District = mongoose.model('District', DistrictSchema)

export { Village, District }
