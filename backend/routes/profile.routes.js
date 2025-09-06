import { Router } from 'express';
import { getProfile, createOrUpdateProfile } from '../controllers/profile.controller.js';

const router = Router();

router.get('/', getProfile);
router.post('/', createOrUpdateProfile);

export default router;
