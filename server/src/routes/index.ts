import { Router } from 'express';
import authRoutes from './auth';
import recipeRoutes from './recipe';
import mealPlanRoutes from './mealPlan';
import aiRoutes from './ai';
import adminRoutes from './admin';

const router = Router();

router.use('/auth', authRoutes);
router.use('/recipes', recipeRoutes);
router.use('/meal-plans', mealPlanRoutes);
router.use('/ai', aiRoutes);
router.use('/admin', adminRoutes);

export default router;
