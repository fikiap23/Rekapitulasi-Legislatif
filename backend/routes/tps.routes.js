import express from 'express'
import tpsController from '../controllers/tpsController.js'

const router = express.Router()

router.post('/bulk', tpsController.bulkTps)

export default router
