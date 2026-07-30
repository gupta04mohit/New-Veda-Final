import express from 'express';
import { uploadReport, generateWeeklyReport } from '../controllers/reportController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/upload', protect, uploadReport);
router.get('/weekly-report', protect, generateWeeklyReport);

export default router;
