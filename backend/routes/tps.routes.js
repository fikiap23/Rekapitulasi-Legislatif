import express from 'express'
import tpsController from '../controllers/tpsController.js'
import { protectUserVillageRoute } from '../middlewares/protectRoute.js'

const router = express.Router()

router.get('/', tpsController.getAllTps)
router.post('/bulk', tpsController.bulkTps)
router.post(
  '/fill/:tpsId',
  protectUserVillageRoute,
  tpsController.fillValidBallotsDetail
)

export default router
