import { Router } from 'express';
import { getAllWaterLogs, saveWaterLog } from '../controllers/waterLogs.controller.js';

const router = Router();

router.get('/', getAllWaterLogs);
router.post('/', saveWaterLog);

export default router;
