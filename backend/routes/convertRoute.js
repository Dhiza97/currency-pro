import express from 'express'
import { convertCurrency, convertWithSavedPair } from '../controllers/convertcontrollers.js'
import { getConversionHistory, getRateHistory } from '../controllers/historyController.js'
import { protect, optionalProtect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Allow guest conversion
router.get('/', optionalProtect, convertCurrency)

router.get("/rates/history", optionalProtect, getRateHistory)

router.get('/history', protect, getConversionHistory)
router.get("/pair", protect, convertWithSavedPair)

export default router