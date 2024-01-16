import { Village, District } from '../models/regionModel.js'
import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import apiHandler from '../utils/apiHandler.js'

const userController = {
  createNewUser: async (req, res) => {
    try {
      const { password, role, village_id, district_id } = req.body
      let { username } = req.body

      if (!username || !password) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Username and password are required',
          error: null,
        })
      }

      username = username.toLowerCase()

      //   Check if user already exists
      const userExists = await User.findOne({ username })
      if (userExists) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'User already exists',
          error: null,
        })
      }

      // check what user wants to create
      if (role === 'admin') {
        // Admin user
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
          username,
          password: hashedPassword,
          role,
        })
        await newUser.save()

        return apiHandler({
          res,
          status: 'success',
          code: 201,
          message: 'Admin user created successfully',
          data: {
            _id: newUser._id,
            username: newUser.username,
            role: newUser.role,
          },
          error: null,
        })
      } else if (role === 'user_district') {
        // check district id not null

        if (!district_id) {
          return apiHandler({
            res,
            status: 'error',
            code: 400,
            message: 'District id is required',
            error: null,
          })
        }

        // check if district exists
        const district = await District.findById(district_id)
        if (!district) {
          return apiHandler({
            res,
            status: 'error',
            code: 400,
            message: 'District not found',
            error: null,
          })
        }

        // User with district role
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
          username,
          password: hashedPassword,
          role,
          district_id,
        })
        await newUser.save()

        return apiHandler({
          res,
          status: 'success',
          code: 201,
          message: 'User with district role created successfully',
          data: {
            _id: newUser._id,
            username: newUser.username,
            district_id: newUser.district_id,
            role: newUser.role,
          },
          error: null,
        })
      } else if (role === 'user_village') {
        // User with village role

        // check village id not null
        if (!village_id) {
          return apiHandler({
            res,
            status: 'error',
            code: 400,
            message: 'Village id is required',
            error: null,
          })
        }

        // check if village exists
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

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
          username,
          password: hashedPassword,
          role,
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
            role: newUser.role,
            village_id: newUser.village_id,
          },
          error: null,
        })
      } else {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Invalid role',
          error: null,
        })
      }
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
   getAllUsers: async (req, res) => {
    try {
      // Fetch all users
      const users = await User.find().select('-password').populate('village_id', 'village_name').populate('district_id', 'district_name');

      // Return the list of users
      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'List of all users retrieved successfully',
        data:users,
        error: null,
      });
    } catch (error) {
      // Handle errors
      return apiHandler({
        res,
        status: 'error',
        code: 500,
        message: 'Internal Server Error',
        data: null,
        error: { type: 'InternalServerError', details: error.message },
      });
    }
  },
}

export default userController
