// authController.js
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js'
import apiHandler from '../utils/apiHandler.js'
import Admin from '../models/adminModel.js'
import User from '../models/userModel.js'

const authController = {
  signupAdmin: async (req, res) => {
    try {
      const { username, password, repassword } = req.body

      const admin = await Admin.findOne({ username: username })
      if (admin) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Admin already exists',
          error: { type: 'AdminExists', details: 'Admin already exists' },
        })
      }

      if (password !== repassword) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Passwords do not match',
          error: {
            type: 'PasswordMismatch',
            details: 'Passwords do not match',
          },
        })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const newAdmin = new Admin({
        username,
        password: hashedPassword,
      })
      await newAdmin.save()

      if (newAdmin) {
        return apiHandler({
          res,
          status: 'success',
          code: 201,
          message: 'Admin account created successfully',
          data: {
            _id: newAdmin._id,
            username: newAdmin.username,
          },
        })
      } else {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Invalid user data',
          error: { type: 'InvalidUserData', details: 'Invalid user data' },
        })
      }
    } catch (error) {
      return apiHandler({
        res,
        status: 'error',
        code: 500,
        message: 'Internal Server Error',
        error: { type: 'InternalServerError', details: error.message },
      })
    }
  },

  loginUser: async (req, res) => {
    try {
      let { username, password } = req.body

      if (!username || !password) {
        return apiHandler({
          res,
          status: 'error',
          code: 400,
          message: 'Username and password are required',
          error: {
            type: 'MissingCredentials',
            details: 'Username and password are required',
          },
        })
      }

      username = username.toLowerCase()
      const admin = await Admin.findOne({ username: username })

      if (admin) {
        const isPasswordCorrect = await bcrypt.compare(
          password,
          admin?.password || ''
        )

        if (!isPasswordCorrect) {
          return apiHandler({
            res,
            status: 'error',
            code: 400,
            message: 'Invalid username or password',
            error: {
              type: 'InvalidCredentials',
              details: 'Invalid username or password',
            },
          })
        }

        generateTokenAndSetCookie(admin._id, 'admin', res)
        return apiHandler({
          res,
          status: 'success',
          code: 200,
          message: 'Admin logged in successfully',
          data: {
            _id: admin._id,
            name: admin.name,
            username: admin.username,
          },
        })
      } else {
        const user = await User.findOne({ username: username })

        const isPasswordCorrect = await bcrypt.compare(
          password,
          user?.password || ''
        )

        if (!user || !isPasswordCorrect) {
          return apiHandler({
            res,
            status: 'error',
            code: 400,
            message: 'Invalid username or password',
            error: {
              type: 'InvalidCredentials',
              details: 'Invalid username or password',
            },
          })
        }

        generateTokenAndSetCookie(user._id, 'user', res)

        return apiHandler({
          res,
          status: 'success',
          code: 200,
          message: 'User logged in successfully',
          data: {
            _id: user._id,
            village_id: user.village_id,
            username: user.username,
          },
        })
      }
    } catch (error) {
      return apiHandler({
        res,
        status: 'error',
        code: 500,
        message: 'Internal Server Error',
        error: { type: 'InternalServerError', details: error.message },
      })
    }
  },

  logoutUser: (req, res) => {
    try {
      res.cookie('jwt', '', { maxAge: 1 })
      return apiHandler({
        res,
        status: 'success',
        code: 200,
        message: 'User logged out successfully',
        data: null,
        error: null,
      })
    } catch (err) {
      return apiHandler({
        res,
        status: 'error',
        code: 500,
        message: 'Internal Server Error',
        error: { type: 'InternalServerError', details: err.message },
      })
    }
  },
}

export default authController
