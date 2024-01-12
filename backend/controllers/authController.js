import Admin from '../models/adminModel.js'
import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js'

const authController = {
  signupAdmin: async (req, res) => {
    try {
      // property yg ada di req.body
      const { username, password, repassword } = req.body

      // cek apakah user ada di db
      const admin = await Admin.findOne({ username: username })
      if (admin) {
        return res.status(400).json({ error: 'Admin already exists' })
      }

      // cek apakah password dan repassword sama
      if (password !== repassword) {
        return res.status(400).json({ error: 'Passwords do not match' })
      }

      // encrypt password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // buat Admin baru
      const newAdmin = new Admin({
        username,
        password: hashedPassword,
      })
      await newAdmin.save()

      // buat response
      if (newAdmin) {
        // generate token
        generateTokenAndSetCookie(newAdmin._id, res)
        res.status(201).json({
          _id: newAdmin._id,
          username: newAdmin.username,
        })
      } else {
        res.status(400).json({ error: 'Invalid user data' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
      console.log('error di signup', error.message)
    }
  },
  loginUser: async (req, res) => {
    try {
      let { username, password } = req.body
      // check username and password not null
      if (!username || !password) {
        return res
          .status(400)
          .json({ error: 'Username and password are required' })
      }

      username = username.toLowerCase()
      const admin = await Admin.findOne({ username: username })

      if (admin) {
        const isPasswordCorrect = await bcrypt.compare(
          password,
          admin?.password || ''
        )

        if (!isPasswordCorrect)
          return res.status(400).json({ error: 'Invalid username or password' })

        generateTokenAndSetCookie(admin._id, 'admin', res)
        res.status(200).json({
          _id: admin._id,
          name: admin.name,
          username: admin.username,
        })
      } else {
        const user = await User.findOne({ username: username })

        const isPasswordCorrect = await bcrypt.compare(
          password,
          user?.password || ''
        )

        if (!user || !isPasswordCorrect)
          return res.status(400).json({ error: 'Invalid username or password' })

        generateTokenAndSetCookie(user._id, 'user', res)

        res.status(200).json({
          _id: user._id,
          village_id: user.village_id,
          username: user.username,
        })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
      console.log('Error in loginUser: ', error.message)
    }
  },
  logoutUser: (req, res) => {
    try {
      res.cookie('jwt', '', { maxAge: 1 })
      res.status(200).json({ message: 'User logged out successfully' })
    } catch (err) {
      res.status(500).json({ error: err.message })
      console.log('Error in logout: ', err.message)
    }
  },
}

export default authController
