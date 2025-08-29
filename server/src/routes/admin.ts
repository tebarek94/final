import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// User Management
router.get('/users', AdminController.getAllUsers);
router.get('/users/:id', AdminController.getUserById);
router.put('/users/:id/role', AdminController.updateUserRole);
router.delete('/users/:id', AdminController.deleteUser);

// Recipe Management
router.get('/recipes/pending', AdminController.getPendingRecipes);
router.put('/recipes/:id/approve', AdminController.approveRecipe);
router.delete('/recipes/:id/reject', AdminController.rejectRecipe);

// User Suggested Meals
router.get('/suggested-meals', AdminController.getSuggestedMealsByAdmin);
router.post('/suggest-meal', AdminController.suggestMealToUser);
router.put('/suggested-meals/:id/status', AdminController.updateMealSuggestionStatus);

// Analytics
router.get('/analytics/system', AdminController.getSystemAnalytics);
router.get('/analytics/users/:id', AdminController.getUserAnalytics);

export default router;
