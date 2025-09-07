import { Router } from 'express';
import { getAllMeals, addMeal, updateMeal, deleteMeal } from '../controllers/meals.controller.js';

const router = Router();

router.get('/', getAllMeals);
router.post('/', addMeal);
router.put('/:id', updateMeal);
router.delete('/:id', deleteMeal);

export default router;