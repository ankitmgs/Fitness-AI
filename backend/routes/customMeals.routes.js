import { Router } from 'express';
import { getCustomMeals, addCustomMeal, updateCustomMeal, deleteCustomMeal } from '../controllers/customMeals.controller.js';

const router = Router();

router.get('/', getCustomMeals);
router.post('/', addCustomMeal);
router.put('/:id', updateCustomMeal);
router.delete('/:id', deleteCustomMeal);

export default router;
