import { Router } from 'express';
import { getAllWorkouts, addWorkout, updateWorkout, deleteWorkout } from '../controllers/workouts.controller.js';

const router = Router();

router.get('/', getAllWorkouts);
router.post('/', addWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

export default router;