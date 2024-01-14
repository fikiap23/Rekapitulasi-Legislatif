import express from 'express'
import userController from '../controllers/userController.js'
import { protectAdminRoute } from '../middlewares/protectRoute.js'

const router = express.Router()

router.post('/', protectAdminRoute, userController.createNewUser)

export default router
