import express from 'express'
import regencyController from '../controllers/regencyController.js'
import { protectAdminRoute } from '../middlewares/protectRoute.js'

const router = express.Router()

// Route untuk kelola wilayah kabupaten
router.post('/', protectAdminRoute, regencyController.createNewRegency)

export default router
