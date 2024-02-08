import express from 'express'
import authController from '../controllers/authController.js'

const router = express.Router()

router.post('/register', authController.registerAdmin)
router.post('/login', authController.loginUser)
router.post('/logout', authController.logoutUser)
router.post('/change-password/:userId', authController.changePassword)

export default router
