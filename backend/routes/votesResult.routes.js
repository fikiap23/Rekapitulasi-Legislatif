import express from 'express'
import votesResultController from '../controllers/votesResultController.js'
import calegController from '../controllers/calegController.js'
import {
  protectAdminRoute,
  protectUserVillageRoute,
} from '../middlewares/protectRoute.js'

const router = express.Router()

router.post(
  '/validBallots/:villageId',
  protectUserVillageRoute,
  votesResultController.fillValidBallotsDetail
)

router.get('/', protectUserVillageRoute, votesResultController.getAllResult)
router.get(
  '/districts',
  protectUserVillageRoute,
  votesResultController.getAllDistricts
)
router.get(
  '/district/:districtId',
  protectUserVillageRoute,
  votesResultController.getAllResultsByDistrict
)
router.get(
  '/villages/:districtId',
  protectUserVillageRoute,
  votesResultController.getAllVillageByDistrictId
)
router.get(
  '/village/:villageId',
  protectUserVillageRoute,
  votesResultController.getVillageByVillageId
)

router.get('/calegs', protectUserVillageRoute, calegController.getAllCalegs)
router.get(
  '/calegs/district/:districtId',
  protectUserVillageRoute,
  calegController.getAllCalegByDistrict
)
router.get(
  '/calegs/village/:villageId',
  protectUserVillageRoute,
  calegController.getAllCalegByVillage
)

router.get('/history/:villageId', votesResultController.getHistoryByVillageId)

export default router
