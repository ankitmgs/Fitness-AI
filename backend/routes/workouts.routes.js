import { Router } from 'express';
import { getAllWorkouts, addWorkout } from '../controllers/workouts.controller.js';

const router = Router();

router.get('/', getAllWorkouts);
router.post('/', addWorkout);

export default router;
