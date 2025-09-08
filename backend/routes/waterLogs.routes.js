import { Router } from 'express';
import { getAllWaterLogs, saveWaterLog, deleteWaterLog } from '../controllers/waterLogs.controller.js';

const router = Router();

router.get('/', getAllWaterLogs);
router.post('/', saveWaterLog);
router.delete('/:id', deleteWaterLog);

export default router;
