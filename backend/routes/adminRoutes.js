import express from 'express'
import adminController from '../controllers/adminController.js'
import { protectAdminRoute } from '../middlewares/protectRoute.js'

const router = express.Router()

router.post('/signup', adminController.signupUser)
router.post('/login', adminController.loginUser)
router.post('/logout', adminController.logoutUser)

// Route untuk kelola user
router.post('/users', protectAdminRoute, adminController.createNewUser)

// Route untuk kelola partai
router.post('/parties', protectAdminRoute, adminController.createNewParty)
router.get('/parties/all', adminController.getAllParties)

// Route untuk kelola wilayah desa
router.post('/villages', protectAdminRoute, adminController.createNewVillage)

// Route untuk kelola wilayah kecamatan
router.post('/districts', protectAdminRoute, adminController.createNewDistrict)

// Route untuk kelola wilayah kabupaten
router.post('/regencies', protectAdminRoute, adminController.createNewRegency)

export default router
