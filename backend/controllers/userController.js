import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js'

const userController = {
  loginUser: async (req, res) => {
    try {
      let { username, password } = req.body // 'username' can be either username or email
      username = username.toLowerCase()
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
        villageId: user.villageId,
        username: user.username,
      })
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

export default userController
