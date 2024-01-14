import express from 'express'
import partyController from '../controllers/partyController.js'
import { protectAdminRoute } from '../middlewares/protectRoute.js'

const router = express.Router()

router.post('/bulk', protectAdminRoute, partyController.createBulkParties)

export default router
