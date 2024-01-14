import express from 'express'
import votesResultController from '../controllers/votesResultController.js'
import { protectAdminRoute } from '../middlewares/protectRoute.js'

const router = express.Router()

router.post(
  '/validBallots/:villageId',
  protectAdminRoute,
  votesResultController.fillValidBallotsDetail
)

export default router
