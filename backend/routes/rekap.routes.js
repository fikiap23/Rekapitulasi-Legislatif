import express from 'express'
import rekapController from '../controllers/rekapController.js'

const router = express.Router()

router.get('/', rekapController.getAllTpsResult)

export default router
