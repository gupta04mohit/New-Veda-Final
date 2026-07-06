import express from 'express';
import { addWellnessLog, getHealthHistory, uploadMedicalReport, getDailyHabitScore } from '../controllers/healthController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/wellness', protect, addWellnessLog);
router.get('/history', protect, getHealthHistory);
router.get('/habit-score', protect, getDailyHabitScore);
router.post('/reports', protect, uploadMedicalReport);

export default router;
