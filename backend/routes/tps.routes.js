import express from 'express'
import tpsController from '../controllers/tpsController.js'
import { protectUserVillageRoute } from '../middlewares/protectRoute.js'

const router = express.Router()

router.get('/', tpsController.getAllTps)
router.get('/village/:villageId', tpsController.getAllTpsByVillageId)
router.get('/district/:districtId', tpsController.getAllTpsByDistrictId)
router.post('/bulk', tpsController.bulkTps)
router.post(
  '/fill/:tpsId',
  protectUserVillageRoute,
  tpsController.fillValidBallotsDetail
)

export default router
