import express from 'express'
import tpsController from '../controllers/tpsController.js'
import { protectUserVillageRoute } from '../middlewares/protectRoute.js'

const router = express.Router()

router.post('/bulk', tpsController.bulkTps)
router.post(
  '/fill/:tpsId',
  protectUserVillageRoute,
  tpsController.fillValidBallotsDetail
)

router.get('/', tpsController.getAllTpsResult)

export default router
