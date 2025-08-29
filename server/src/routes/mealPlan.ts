import { Router } from 'express';
import { MealPlanController } from '../controllers/MealPlanController';
import { validateMealPlan } from '../middleware/validation';
import { authenticateToken, requireUser } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);
router.use(requireUser);

router.post('/', validateMealPlan, MealPlanController.createMealPlan);
router.get('/user', MealPlanController.getUserMealPlans);
router.get('/:id', MealPlanController.getMealPlan);
router.get('/:id/items', MealPlanController.getMealPlanItems);
router.delete('/:id', MealPlanController.deleteMealPlan);
router.put('/:id/nutrition', MealPlanController.updateNutritionTotals);

export default router;
