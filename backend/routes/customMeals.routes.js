import { Router } from 'express';
import { getCustomMeals, addCustomMeal } from '../controllers/customMeals.controller.js';

const router = Router();

router.get('/', getCustomMeals);
router.post('/', addCustomMeal);

export default router;
