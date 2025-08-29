import { Request, Response } from 'express';
import { AIService } from '../services/AIService';
import { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/User';

export class AIController {
  static async generatePersonalizedMeal(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { mealType, preferences } = req.body;
      
      if (!mealType) {
        res.status(400).json({ error: 'Meal type is required' });
        return;
      }

      const user = await UserModel.findById(req.user!.id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const mealSuggestion = await AIService.generatePersonalizedMeal(
        user,
        mealType,
        preferences || []
      );

      res.json({
        message: 'Personalized meal generated successfully',
        mealSuggestion
      });
    } catch (error) {
      console.error('Generate personalized meal error:', error);
      res.status(500).json({ error: 'Failed to generate personalized meal' });
    }
  }

  static async analyzeMealNutrition(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { mealData } = req.body;
      
      if (!mealData) {
        res.status(400).json({ error: 'Meal data is required' });
        return;
      }

      const analysis = await AIService.analyzeMealNutrition(mealData, req.user!.id);

      res.json({
        message: 'Meal nutrition analyzed successfully',
        analysis
      });
    } catch (error) {
      console.error('Analyze meal nutrition error:', error);
      res.status(500).json({ error: 'Failed to analyze meal nutrition' });
    }
  }

  static async getAnalysisHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const history = await AIService.getAnalysisHistory(req.user!.id, limit);
      
      res.json({ history });
    } catch (error) {
      console.error('Get analysis history error:', error);
      res.status(500).json({ error: 'Failed to get analysis history' });
    }
  }

  static async getAnalysisByType(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      
      const analyses = await AIService.getAnalysisByType(type, limit);
      
      res.json({ analyses });
    } catch (error) {
      console.error('Get analysis by type error:', error);
      res.status(500).json({ error: 'Failed to get analysis by type' });
    }
  }
}
