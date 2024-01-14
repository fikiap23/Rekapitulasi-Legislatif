import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    role: {
      type: String,
      enum: ['user_village', 'user_district', 'admin'],
      required: true,
      default: '',
    },
    village_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Village',
      required: function () {
        return this.role === 'user_village'
      },
    },
    district_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      required: function () {
        return this.role === 'user_district'
      },
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

export default User
