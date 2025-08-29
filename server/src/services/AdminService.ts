import { UserModel } from '../models/User';
import { RecipeModel } from '../models/Recipe';
import { UserSuggestedMealModel } from '../models/UserSuggestedMeal';
import { AIAnalysisModel } from '../models/AIAnalysis';
import { User, Recipe } from '../types';

export class AdminService {
  // User Management
  static async getAllUsers(limit: number = 100, offset: number = 0): Promise<User[]> {
    return await UserModel.findAll(limit, offset);
  }

  static async getUserById(id: number): Promise<User | null> {
    return await UserModel.findById(id);
  }

  static async updateUserRole(userId: number, newRole: 'user' | 'admin'): Promise<User | null> {
    return await UserModel.update(userId, { role: newRole });
  }

  static async deleteUser(userId: number): Promise<boolean> {
    return await UserModel.delete(userId);
  }

  // Recipe Management
  static async getPendingRecipes(): Promise<Recipe[]> {
    return await RecipeModel.findAll(100, 0, false);
  }

  static async approveRecipe(recipeId: number): Promise<boolean> {
    return await RecipeModel.approve(recipeId);
  }

  static async rejectRecipe(recipeId: number): Promise<boolean> {
    return await RecipeModel.delete(recipeId);
  }

  // User Suggested Meals
  static async getSuggestedMealsByAdmin(adminId: number): Promise<any[]> {
    return await UserSuggestedMealModel.findByAdmin(adminId);
  }

  static async suggestMealToUser(suggestionData: any, adminId: number): Promise<any> {
    return await UserSuggestedMealModel.create(suggestionData, adminId);
  }

  static async updateMealSuggestionStatus(suggestionId: number, isAccepted: boolean): Promise<boolean> {
    return await UserSuggestedMealModel.updateAcceptance(suggestionId, isAccepted);
  }

  // Analytics
  static async getSystemAnalytics(): Promise<any> {
    try {
      // Get user count
      const [userCountResult] = await (await import('../config/database')).default.execute(
        'SELECT COUNT(*) as total_users FROM users'
      );
      const totalUsers = (userCountResult as any[])[0].total_users;

      // Get recipe count
      const [recipeCountResult] = await (await import('../config/database')).default.execute(
        'SELECT COUNT(*) as total_recipes, COUNT(CASE WHEN is_approved = true THEN 1 END) as approved_recipes FROM recipes'
      );
      const recipeStats = (recipeCountResult as any[])[0];

      // Get meal plan count
      const [mealPlanCountResult] = await (await import('../config/database')).default.execute(
        'SELECT COUNT(*) as total_meal_plans FROM meal_plans'
      );
      const totalMealPlans = (mealPlanCountResult as any[])[0].total_meal_plans;

      // Get AI analysis count
      const [aiAnalysisCountResult] = await (await import('../config/database')).default.execute(
        'SELECT COUNT(*) as total_analyses FROM ai_analysis_results'
      );
      const totalAnalyses = (aiAnalysisCountResult as any[])[0].total_analyses;

      // Get recent activity
      const [recentActivityResult] = await (await import('../config/database')).default.execute(
        `SELECT 
           'user_registration' as type,
           u.created_at as date,
           CONCAT(u.first_name, ' ', u.last_name) as description
         FROM users u
         WHERE u.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
         UNION ALL
         SELECT 
           'recipe_creation' as type,
           r.created_at as date,
           r.title as description
         FROM recipes r
         WHERE r.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
         ORDER BY date DESC
         LIMIT 20`
      );

      return {
        users: {
          total: totalUsers
        },
        recipes: {
          total: recipeStats.total_recipes,
          approved: recipeStats.approved_recipes,
          pending: recipeStats.total_recipes - recipeStats.approved_recipes
        },
        mealPlans: {
          total: totalMealPlans
        },
        aiAnalysis: {
          total: totalAnalyses
        },
        recentActivity: recentActivityResult
      };
    } catch (error) {
      console.error('Error getting system analytics:', error);
      throw new Error('Failed to get system analytics');
    }
  }

  static async getUserAnalytics(userId: number): Promise<any> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get user's meal plans
      const [mealPlanCountResult] = await (await import('../config/database')).default.execute(
        'SELECT COUNT(*) as total_meal_plans FROM meal_plans WHERE user_id = ?',
        [userId]
      );
      const totalMealPlans = (mealPlanCountResult as any[])[0].total_meal_plans;

      // Get user's recipes
      const [recipeCountResult] = await (await import('../config/database')).default.execute(
        'SELECT COUNT(*) as total_recipes FROM recipes WHERE created_by = ?',
        [userId]
      );
      const totalRecipes = (recipeCountResult as any[])[0].total_recipes;

      // Get user's AI analysis count
      const [aiAnalysisCountResult] = await (await import('../config/database')).default.execute(
        'SELECT COUNT(*) as total_analyses FROM ai_analysis_results WHERE user_id = ?',
        [userId]
      );
      const totalAnalyses = (aiAnalysisCountResult as any[])[0].total_analyses;

      // Get user's suggested meals
      const [suggestedMealsResult] = await (await import('../config/database')).default.execute(
        'SELECT COUNT(*) as total_suggestions FROM user_suggested_meals WHERE user_id = ?',
        [userId]
      );
      const totalSuggestions = (suggestedMealsResult as any[])[0].total_suggestions;

      return {
        user: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.role,
          joined: user.created_at
        },
        stats: {
          mealPlans: totalMealPlans,
          recipes: totalRecipes,
          aiAnalyses: totalAnalyses,
          suggestedMeals: totalSuggestions
        }
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw new Error('Failed to get user analytics');
    }
  }
}
