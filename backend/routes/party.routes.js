import express from 'express'
import partyController from '../controllers/partyController.js'
import { protectAdminRoute } from '../middlewares/protectRoute.js'

const router = express.Router()

// Route for bulk party creation
router.post('/bulk', protectAdminRoute, partyController.createBulkParties)

// New route for bulk dapil creation per party
router.post(
  '/bulkDapils/:partyId',
  protectAdminRoute,
  partyController.createBulkDapilForParty
)

export default router
