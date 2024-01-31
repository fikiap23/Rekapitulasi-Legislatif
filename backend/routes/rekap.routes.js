import express from 'express'
import rekapController from '../controllers/rekapController.js'

const router = express.Router()

router.get('/ballot', rekapController.getAllTpsResult)
router.get(
  '/ballot-district/:districtId',
  rekapController.getAllTpsResultByDistrictId
)
router.get('/districts', rekapController.getAllDistrictWithResultVotes)
router.get(
  '/villages/:districtId',
  rekapController.getAllVillageByDistrictIdWithResultVote
)

export default router
