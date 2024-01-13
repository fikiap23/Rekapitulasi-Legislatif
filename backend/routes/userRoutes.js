import express from 'express'
import villageController from '../controllers/villageController.js'
import { protectUserRoute } from '../middlewares/protectRoute.js'

const router = express.Router()

//! route village
// route validBallots
router.post(
  '/validBallots',
  protectUserRoute,
  villageController.addVotesArrayToValidBallots
)

export default router
