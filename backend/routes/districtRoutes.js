import express from 'express'

import districtController from '../controllers/districtController.js'

const router = express.Router()

//! route district
router.get('/', districtController.getDistricts)
router.get('/all', districtController.getAllDistricts)
router.get('/:id', districtController.getVotesSummaryByDistrict)

export default router
