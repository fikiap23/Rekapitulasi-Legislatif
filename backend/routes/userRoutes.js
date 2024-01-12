import express from 'express'
import villageController from '../controllers/villageController.js'
import districtController from '../controllers/districtController.js'
import { protectUserRoute } from '../middlewares/protectRoute.js'

const router = express.Router()

//! route village
// route validBallots
router.post(
  '/validBallots',
  protectUserRoute,
  villageController.addVotesArrayToValidBallots
)

//! route district
router.get('/districts', districtController.getDistricts)
router.get('/districts/:id', districtController.getVotesSummaryByDistrict)

export default router
