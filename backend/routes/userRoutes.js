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
router.put(
  '/validBallots',
  protectUserRoute,
  villageController.updateVotesToValidBallots
)

// route invalidBallots
router.patch(
  '/invalidBallots',
  protectUserRoute,
  villageController.addVoteToInvalidBallots
)

//! route district
router.get('/districts', districtController.getDistricts)
router.get('/districts/:id', districtController.getVotesSummaryByDistrict)

export default router
