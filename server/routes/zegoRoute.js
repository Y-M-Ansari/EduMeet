import express from 'express';
import { generateZegoToken } from '../controllers/zegoController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected token generation endpoint
router.post('/token', protect, generateZegoToken);

export default router;
