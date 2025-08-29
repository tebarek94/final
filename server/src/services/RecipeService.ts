import { RecipeModel } from '../models/Recipe';
import { Recipe, CreateRecipeRequest } from '../types';

export class RecipeService {
  static async createRecipe(recipeData: CreateRecipeRequest, userId: number): Promise<Recipe | null> {
    return await RecipeModel.create(recipeData, userId);
  }

  static async getRecipe(id: number): Promise<Recipe | null> {
    return await RecipeModel.findById(id);
  }

  static async getAllRecipes(limit: number = 100, offset: number = 0, approvedOnly: boolean = true): Promise<Recipe[]> {
    return await RecipeModel.findAll(limit, offset, approvedOnly);
  }

  static async getUserRecipes(userId: number): Promise<Recipe[]> {
    return await RecipeModel.findByUser(userId);
  }

  static async searchRecipes(query: string, limit: number = 50): Promise<Recipe[]> {
    return await RecipeModel.search(query, limit);
  }

  static async updateRecipe(id: number, updateData: Partial<CreateRecipeRequest>, userId: number): Promise<Recipe | null> {
    const recipe = await RecipeModel.findById(id);
    if (!recipe) {
      throw new Error('Recipe not found');
    }

    // Check if user owns the recipe or is admin
    if (recipe.created_by !== userId) {
      throw new Error('Unauthorized to update this recipe');
    }

    return await RecipeModel.update(id, updateData);
  }

  static async approveRecipe(id: number): Promise<boolean> {
    return await RecipeModel.approve(id);
  }

  static async deleteRecipe(id: number, userId: number): Promise<boolean> {
    const recipe = await RecipeModel.findById(id);
    if (!recipe) {
      throw new Error('Recipe not found');
    }

    // Check if user owns the recipe or is admin
    if (recipe.created_by !== userId) {
      throw new Error('Unauthorized to delete this recipe');
    }

    return await RecipeModel.delete(id);
  }

  static async addNutritionInfo(recipeId: number, nutrition: any): Promise<any> {
    return await RecipeModel.addNutrition(recipeId, nutrition);
  }

  static async getNutritionInfo(recipeId: number): Promise<any> {
    return await RecipeModel.getNutrition(recipeId);
  }
}
