import { MealPlanModel } from '../models/MealPlan';
import { CreateMealPlanRequest, MealPlan, MealPlanItem } from '../types';

export class MealPlanService {
  static async createMealPlan(mealPlanData: CreateMealPlanRequest, userId: number): Promise<MealPlan | null> {
    const mealPlan = await MealPlanModel.create(mealPlanData, userId);
    
    if (mealPlan) {
      // Update nutrition totals
      await MealPlanModel.updateNutritionTotals(mealPlan.id);
    }

    return mealPlan;
  }

  static async getMealPlan(id: number): Promise<MealPlan | null> {
    return await MealPlanModel.findById(id);
  }

  static async getUserMealPlans(userId: number): Promise<MealPlan[]> {
    return await MealPlanModel.findByUser(userId);
  }

  static async getMealPlanItems(mealPlanId: number): Promise<MealPlanItem[]> {
    return await MealPlanModel.getMealPlanItems(mealPlanId);
  }

  static async deleteMealPlan(id: number, userId: number): Promise<boolean> {
    const mealPlan = await MealPlanModel.findById(id);
    if (!mealPlan) {
      throw new Error('Meal plan not found');
    }

    // Check if user owns the meal plan
    if (mealPlan.user_id !== userId) {
      throw new Error('Unauthorized to delete this meal plan');
    }

    return await MealPlanModel.delete(id);
  }

  static async updateNutritionTotals(mealPlanId: number): Promise<void> {
    await MealPlanModel.updateNutritionTotals(mealPlanId);
  }
}
