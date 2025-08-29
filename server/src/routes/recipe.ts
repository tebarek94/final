import { Router } from 'express';
import { RecipeController } from '../controllers/RecipeController';
import { validateRecipe } from '../middleware/validation';
import { authenticateToken, requireUser, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', RecipeController.getAllRecipes);
router.get('/search', RecipeController.searchRecipes);
router.get('/:id', RecipeController.getRecipe);
router.get('/:id/nutrition', RecipeController.getNutritionInfo);

// Protected routes
router.post('/', authenticateToken, requireUser, validateRecipe, RecipeController.createRecipe);
router.get('/user/me', authenticateToken, requireUser, RecipeController.getUserRecipes);
router.put('/:id', authenticateToken, requireUser, validateRecipe, RecipeController.updateRecipe);
router.delete('/:id', authenticateToken, requireUser, RecipeController.deleteRecipe);
router.post('/:id/nutrition', authenticateToken, requireUser, RecipeController.addNutritionInfo);

// Admin routes
router.put('/:id/approve', authenticateToken, requireAdmin, RecipeController.approveRecipe);

export default router;
