import express from 'express'
import votesResultController from '../controllers/votesResultController.js'
import calegController from '../controllers/calegController.js'
import { protectAdminRoute } from '../middlewares/protectRoute.js'

const router = express.Router()

router.post(
  '/validBallots/:villageId',
  protectAdminRoute,
  votesResultController.fillValidBallotsDetail
)

router.get('/', protectAdminRoute, votesResultController.getAllResult)
router.get(
  '/districts',
  protectAdminRoute,
  votesResultController.getAllDistricts
)
router.get(
  '/district/:districtId',
  protectAdminRoute,
  votesResultController.getAllResultsByDistrict
)
router.get(
  '/villages/:districtId',
  protectAdminRoute,
  votesResultController.getAllVillageByDistrictId
)
router.get(
  '/village/:villageId',
  protectAdminRoute,
  votesResultController.getVillageByVillageId
)

router.get('/calegs', protectAdminRoute, calegController.getAllCalegs)

export default router
