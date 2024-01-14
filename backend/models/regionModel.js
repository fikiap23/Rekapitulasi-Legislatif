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

const RegencySchema = mongoose.Schema(
  {
    regency_name: {
      type: String,
      required: true,
    },
    code: {
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
