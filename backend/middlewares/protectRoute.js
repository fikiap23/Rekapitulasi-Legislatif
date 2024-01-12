// middleware.js
import User from '../models/userModel.js'
import Admin from '../models/adminModel.js'
import jwt from 'jsonwebtoken'

const protectUserRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt

    if (!token) return res.status(401).json({ message: 'Unauthorized' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.userType === 'user') {
      const user = await User.findById(decoded.userId).select('-password')
      if (!user) return res.status(401).json({ message: 'Unauthorized' })
      req.user = user
      next()
    } else {
      return res.status(401).json({ message: 'Invalid user type in token' })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
    console.log('Error in protectUserRoute: ', err.message)
  }
}

const protectAdminRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt

    if (!token) return res.status(401).json({ message: 'Unauthorized' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.userType === 'admin') {
      const admin = await Admin.findById(decoded.userId).select('-password')
      if (!admin) return res.status(401).json({ message: 'Unauthorized' })
      req.user = admin
      next()
    } else {
      return res.status(401).json({ message: 'Invalid user type in token' })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
    console.log('Error in protectAdminRoute: ', err.message)
  }
}

export { protectUserRoute, protectAdminRoute }
