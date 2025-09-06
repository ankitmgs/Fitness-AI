import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

import profileRoutes from './profile.routes.js';
import mealRoutes from './meals.routes.js';
import customMealRoutes from './customMeals.routes.js';
import workoutRoutes from './workouts.routes.js';
import weightLogRoutes from './weightLogs.routes.js';
import waterLogRoutes from './waterLogs.routes.js';

const router = Router();

// All routes after this middleware will be protected
router.use(authMiddleware);

router.use('/profile', profileRoutes);
router.use('/meals', mealRoutes);
router.use('/custom-meals', customMealRoutes);
router.use('/workouts', workoutRoutes);
router.use('/weight-logs', weightLogRoutes);
router.use('/water-logs', waterLogRoutes);

export default router;
