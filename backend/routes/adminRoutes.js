import express from 'express'
import adminUserController from '../controllers/admin_userController.js'
import adminPartyController from '../controllers/admin_partyController.js'
import adminVillageController from '../controllers/admin_villageController.js'
import adminDistrictController from '../controllers/admin_districtController.js'
import adminRegencyController from '../controllers/admin_regencyController.js'

import { protectAdminRoute } from '../middlewares/protectRoute.js'

const router = express.Router()

// Route untuk kelola user
router.post('/users', protectAdminRoute, adminUserController.createNewUser)
router.get(
  '/users/all',
  protectAdminRoute,
  adminUserController.getAllUsersAndAdmins
)

// Route untuk kelola partai
router.post(
  '/parties',
  protectAdminRoute,
  adminPartyController.createMultipleParties
)
router.post('/party', protectAdminRoute, adminPartyController.createNewParty)
router.get('/parties/all', adminPartyController.getAllParties)

// Route untuk kelola wilayah desa
router.post(
  '/village',
  protectAdminRoute,
  adminVillageController.createOneVillage
)
router.post(
  '/villages',
  protectAdminRoute,
  adminVillageController.createManyVillage
)
router.post(
  '/villages/ballot/:villageId',
  protectAdminRoute,
  adminVillageController.addVotesArrayToValidBallots
)
router.post(
  '/villages/district/:district_id',
  protectAdminRoute,
  adminVillageController.createManyVillageByDistrict
)

// Route untuk kelola wilayah kecamatan
router.post(
  '/district',
  protectAdminRoute,
  adminDistrictController.createNewDistrict
)
router.post(
  '/districts',
  protectAdminRoute,
  adminDistrictController.createMultipleDistricts
)
router.post(
  '/districts/regency/:regency_id',
  protectAdminRoute,
  adminDistrictController.createMultipleDistrictsByRegency
)

router.get(
  '/districts',
  protectAdminRoute,
  adminDistrictController.getAllDistricts
)

// Route untuk kelola wilayah kabupaten
router.post(
  '/regencies',
  protectAdminRoute,
  adminRegencyController.createNewRegency
)

export default router
