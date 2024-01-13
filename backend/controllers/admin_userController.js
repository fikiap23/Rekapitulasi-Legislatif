import { Village } from '../models/regionModel.js'
import User from '../models/userModel.js'
import Admin from '../models/adminModel.js'
import bcrypt from 'bcryptjs'
import apiHandler from '../utils/apiHandler.js'

const adminUserController = {
  createNewUser: async (req, res) => {
    try {
      const { username, password, village_id } = req.body

      if (!username || !password || !village_id) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'All fields are required',
          error: null,
        })
      }

      const village = await Village.findById(village_id)
      if (!village) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Village not found',
          error: null,
        })
      }

      const existingUser = await User.findOne({ username })
      if (existingUser) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'User already exists',
          error: null,
        })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const newUser = new User({
        username,
        password: hashedPassword,
        village_id,
      })
      await newUser.save()

      return apiHandler({
        res,
        status: 'success',
        code: 201,
        message: 'User created successfully',
        data: {
          _id: newUser._id,
          username: newUser.username,
          village_id: newUser.village_id,
        },
        error: null,
      })
    } catch (error) {
      return apiHandler({
        res,
        status: 'error',
        code: 500,
        message: 'Internal Server Error',
        data: null,
        error: { type: 'InternalServerError', details: error.message },
      })
    }
  },

  getAllUsersAndAdmins: async (req, res) => {
    try {
      const users = await User.find()
        .select('-password')
        .populate('village_id', 'village_name')
      const admins = await Admin.find().select('-password')

      const allUsers = users.map((user) => ({ ...user._doc, role: 'user' }))
      const allAdmins = admins.map((admin) => ({
        ...admin._doc,
        role: 'admin',
      }))

      const combinedData = [...allUsers, ...allAdmins]

      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'All users and admins retrieved successfully',
        data: combinedData,
        error: null,
      })
    } catch (error) {
      return apiHandler({
        res,
        status: 'error',
        code: 500,
        message: 'Internal Server Error',
        data: null,
        error: { type: 'InternalServerError', details: error.message },
      })
    }
  },
}

export default adminUserController
