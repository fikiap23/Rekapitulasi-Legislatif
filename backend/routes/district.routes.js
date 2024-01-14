import express from 'express'
import districtController from '../controllers/districtController.js'
import { protectAdminRoute } from '../middlewares/protectRoute.js'

const router = express.Router()

//! route district
router.post('/', protectAdminRoute, districtController.createNewDistrict)
router.get('/', protectAdminRoute, districtController.getAllDistricts)

router.post(
  '/bulk/:regency_id',
  protectAdminRoute,
  districtController.createMultipleDistrictsByRegency
)

export default router
