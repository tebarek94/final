import { Router } from 'express';
import { AIController } from '../controllers/AIController';
import { authenticateToken, requireUser } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);
router.use(requireUser);

router.post('/generate-meal', AIController.generatePersonalizedMeal);
router.post('/analyze-nutrition', AIController.analyzeMealNutrition);
router.get('/history', AIController.getAnalysisHistory);
router.get('/history/:type', AIController.getAnalysisByType);

export default router;
