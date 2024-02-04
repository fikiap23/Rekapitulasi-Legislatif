import express from 'express'
import userController from '../controllers/userController.js'
import {
  protectUserDistrictRoute,
  protectUserVillageRoute,
} from '../middlewares/protectRoute.js'

const router = express.Router()

// Create a new user
router.post('/', protectUserVillageRoute, userController.createNewUser)
// Delete multiple users
router.post(
  '/deleteUsers',
  protectUserDistrictRoute,
  userController.deleteUsers
)

// Get all users
router.get('/', protectUserDistrictRoute, userController.getAllUsers)

// Update a user
router.put('/:userId', protectUserDistrictRoute, userController.updateUser)

// Delete a user
router.delete('/:userId', protectUserDistrictRoute, userController.deleteUser)

export default router
