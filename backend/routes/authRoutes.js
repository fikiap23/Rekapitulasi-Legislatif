import express from 'express'
import authController from '../controllers/authController.js'

const router = express.Router()

router.post('/signup', authController.signupAdmin)
router.post('/login', authController.loginUser)
router.post('/logout', authController.logoutUser)

export default router
