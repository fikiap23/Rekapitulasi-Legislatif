import express from 'express';
import userController from '../controllers/userController.js';
import { protectAdminRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

// Create a new user
router.post('/', protectAdminRoute, userController.createNewUser);
// Delete multiple users
router.post('/deleteUsers', protectAdminRoute, userController.deleteUsers);


// Get all users
router.get('/', protectAdminRoute, userController.getAllUsers);

// Update a user
router.put('/:userId', protectAdminRoute, userController.updateUser);

// Delete a user
router.delete('/:userId', protectAdminRoute, userController.deleteUser);

export default router;
