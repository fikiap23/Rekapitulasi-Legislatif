import express from 'express'
import userController from '../controllers/userController.js'
import villageController from '../controllers/villageController.js'
import districtController from '../controllers/districtController.js'
import { protectUserRoute } from '../middlewares/protectRoute.js'

const router = express.Router()

//! route user
router.post('/login', userController.loginUser)
router.post('/logout', userController.logoutUser)

//! route village
// route validBallots
router.post(
  '/validBallots',
  protectUserRoute,
  villageController.addVotesToValidBallots
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
