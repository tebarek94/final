import { Request, Response } from 'express';
import { MealPlanService } from '../services/MealPlanService';
import { AuthRequest } from '../middleware/auth';

export class MealPlanController {
  static async createMealPlan(req: AuthRequest, res: Response): Promise<void> {
    try {
      const mealPlan = await MealPlanService.createMealPlan(req.body, req.user!.id);
      
      if (!mealPlan) {
        res.status(500).json({ error: 'Failed to create meal plan' });
        return;
      }

      res.status(201).json({
        message: 'Meal plan created successfully',
        mealPlan
      });
    } catch (error) {
      console.error('Create meal plan error:', error);
      res.status(500).json({ error: 'Failed to create meal plan' });
    }
  }

  static async getMealPlan(req: Request, res: Response): Promise<void> {
    try {
      const mealPlanId = parseInt(req.params.id);
      const mealPlan = await MealPlanService.getMealPlan(mealPlanId);
      
      if (!mealPlan) {
        res.status(404).json({ error: 'Meal plan not found' });
        return;
      }

      res.json({ mealPlan });
    } catch (error) {
      console.error('Get meal plan error:', error);
      res.status(500).json({ error: 'Failed to get meal plan' });
    }
  }

  static async getUserMealPlans(req: AuthRequest, res: Response): Promise<void> {
    try {
      const mealPlans = await MealPlanService.getUserMealPlans(req.user!.id);
      
      res.json({ mealPlans });
    } catch (error) {
      console.error('Get user meal plans error:', error);
      res.status(500).json({ error: 'Failed to get user meal plans' });
    }
  }

  static async getMealPlanItems(req: Request, res: Response): Promise<void> {
    try {
      const mealPlanId = parseInt(req.params.id);
      const items = await MealPlanService.getMealPlanItems(mealPlanId);
      
      res.json({ items });
    } catch (error) {
      console.error('Get meal plan items error:', error);
      res.status(500).json({ error: 'Failed to get meal plan items' });
    }
  }

  static async deleteMealPlan(req: AuthRequest, res: Response): Promise<void> {
    try {
      const mealPlanId = parseInt(req.params.id);
      const success = await MealPlanService.deleteMealPlan(mealPlanId, req.user!.id);
      
      if (success) {
        res.json({ message: 'Meal plan deleted successfully' });
      } else {
        res.status(404).json({ error: 'Meal plan not found' });
      }
    } catch (error: any) {
      if (error.message === 'Unauthorized to delete this meal plan') {
        res.status(403).json({ error: error.message });
      } else if (error.message === 'Meal plan not found') {
        res.status(404).json({ error: error.message });
      } else {
        console.error('Delete meal plan error:', error);
        res.status(500).json({ error: 'Failed to delete meal plan' });
      }
    }
  }

  static async updateNutritionTotals(req: AuthRequest, res: Response): Promise<void> {
    try {
      const mealPlanId = parseInt(req.params.id);
      await MealPlanService.updateNutritionTotals(mealPlanId);
      
      res.json({ message: 'Nutrition totals updated successfully' });
    } catch (error) {
      console.error('Update nutrition totals error:', error);
      res.status(500).json({ error: 'Failed to update nutrition totals' });
    }
  }
}
