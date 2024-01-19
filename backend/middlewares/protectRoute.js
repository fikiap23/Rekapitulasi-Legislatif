// middleware.js
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'

const protectAdminRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt

    if (!token) return res.status(401).json({ message: 'Unauthorized' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.userType === 'admin') {
      const admin = await User.findById(decoded.userId).select('-password')
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

const protectUserDistrictRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt

    if (!token) return res.status(401).json({ message: 'Unauthorized' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.userType === 'admin' || decoded.userType === 'user_district') {
      const user = await User.findById(decoded.userId).select('-password')
      if (!user) return res.status(401).json({ message: 'Unauthorized' })
      req.user = user
      next()
    } else {
      return res.status(401).json({ message: 'Invalid user type in token' })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
    console.log('Error in protectUserDistrictRoute: ', err.message)
  }
}

const protectUserVillageRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt

    if (!token) return res.status(401).json({ message: 'Unauthorized' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (
      decoded.userType === 'admin' ||
      decoded.userType === 'user_district' ||
      decoded.userType === 'user_village'
    ) {
      const user = await User.findById(decoded.userId).select('-password')
      if (!user) return res.status(401).json({ message: 'Unauthorized' })
      req.user = user
      next()
    } else {
      return res.status(401).json({ message: 'Invalid user type in token' })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
    console.log('Error in protectUserVillageRoute: ', err.message)
  }
}

export { protectUserVillageRoute, protectUserDistrictRoute, protectAdminRoute }
