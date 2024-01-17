import express from 'express';
import partyController from '../controllers/partyController.js';
import { protectAdminRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

// Route for bulk party creation
router.post('/bulk', protectAdminRoute, partyController.createBulkParties);

// Route for getting all parties
router.get('/', protectAdminRoute, partyController.getAllParties);

export default router;
