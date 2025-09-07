import { Router } from 'express';
import { getWeightHistory, addWeightLog, updateWeightLog, deleteWeightLog } from '../controllers/weightLogs.controller.js';

const router = Router();

router.get('/', getWeightHistory);
router.post('/', addWeightLog);
router.put('/:id', updateWeightLog);
router.delete('/:id', deleteWeightLog);

export default router;