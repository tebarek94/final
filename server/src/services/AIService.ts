import { generateMealSuggestion, analyzeNutrition } from '../config/gemini';
import { AIAnalysisModel } from '../models/AIAnalysis';
import { User } from '../types';

export class AIService {
  static async generatePersonalizedMeal(
    user: User,
    mealType: string,
    preferences: string[] = []
  ): Promise<any> {
    try {
      // Generate meal suggestion using Gemini AI
      const aiResponse = await generateMealSuggestion(user, mealType, preferences);

      // Store analysis result
      await AIAnalysisModel.create({
        user_id: user.id,
        analysis_type: 'meal_suggestion',
        input_data: {
          user_profile: {
            age: user.age,
            gender: user.gender,
            weight: user.weight,
            height: user.height,
            activity_level: user.activity_level,
            fitness_goal: user.fitness_goal,
            dietary_preferences: user.dietary_preferences,
            allergies: user.allergies
          },
          meal_type: mealType,
          preferences
        },
        ai_response: aiResponse
      });

      return aiResponse;
    } catch (error) {
      console.error('Error generating personalized meal:', error);
      throw new Error('Failed to generate personalized meal');
    }
  }

  static async analyzeMealNutrition(mealData: any, userId: number): Promise<any> {
    try {
      // Analyze nutrition using Gemini AI
      const aiResponse = await analyzeNutrition(mealData);

      // Store analysis result
      await AIAnalysisModel.create({
        user_id: userId,
        analysis_type: 'nutrition_analysis',
        input_data: mealData,
        ai_response: aiResponse
      });

      return aiResponse;
    } catch (error) {
      console.error('Error analyzing meal nutrition:', error);
      throw new Error('Failed to analyze meal nutrition');
    }
  }

  static async getAnalysisHistory(userId: number, limit: number = 50): Promise<any[]> {
    return await AIAnalysisModel.findByUser(userId, limit);
  }

  static async getAnalysisByType(analysisType: string, limit: number = 50): Promise<any[]> {
    return await AIAnalysisModel.findByType(analysisType, limit);
  }
}
