import { Router } from 'express';
import { getAllMeals, addMeal } from '../controllers/meals.controller.js';

const router = Router();

router.get('/', getAllMeals);
router.post('/', addMeal);

export default router;
