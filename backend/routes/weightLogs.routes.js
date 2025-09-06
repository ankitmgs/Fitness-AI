import { Router } from 'express';
import { getWeightHistory, addWeightLog } from '../controllers/weightLogs.controller.js';

const router = Router();

router.get('/', getWeightHistory);
router.post('/', addWeightLog);

export default router;
