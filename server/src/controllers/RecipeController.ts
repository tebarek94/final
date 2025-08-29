import { Request, Response } from 'express';
import { RecipeService } from '../services/RecipeService';
import { AuthRequest } from '../middleware/auth';

export class RecipeController {
  static async createRecipe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipe = await RecipeService.createRecipe(req.body, req.user!.id);
      
      if (!recipe) {
        res.status(500).json({ error: 'Failed to create recipe' });
        return;
      }

      res.status(201).json({
        message: 'Recipe created successfully',
        recipe
      });
    } catch (error) {
      console.error('Create recipe error:', error);
      res.status(500).json({ error: 'Failed to create recipe' });
    }
  }

  static async getRecipe(req: Request, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.id);
      const recipe = await RecipeService.getRecipe(recipeId);
      
      if (!recipe) {
        res.status(404).json({ error: 'Recipe not found' });
        return;
      }

      res.json({ recipe });
    } catch (error) {
      console.error('Get recipe error:', error);
      res.status(500).json({ error: 'Failed to get recipe' });
    }
  }

  static async getAllRecipes(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = parseInt(req.query.offset as string) || 0;
      const approvedOnly = req.query.approved !== 'false';

      const recipes = await RecipeService.getAllRecipes(limit, offset, approvedOnly);
      
      res.json({
        recipes,
        pagination: {
          limit,
          offset,
          total: recipes.length
        }
      });
    } catch (error) {
      console.error('Get all recipes error:', error);
      res.status(500).json({ error: 'Failed to get recipes' });
    }
  }

  static async getUserRecipes(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipes = await RecipeService.getUserRecipes(req.user!.id);
      
      res.json({ recipes });
    } catch (error) {
      console.error('Get user recipes error:', error);
      res.status(500).json({ error: 'Failed to get user recipes' });
    }
  }

  static async searchRecipes(req: Request, res: Response): Promise<void> {
    try {
      const { q, limit } = req.query;
      
      if (!q || typeof q !== 'string') {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      const searchLimit = parseInt(limit as string) || 50;
      const recipes = await RecipeService.searchRecipes(q, searchLimit);
      
      res.json({
        recipes,
        search: {
          query: q,
          results: recipes.length,
          limit: searchLimit
        }
      });
    } catch (error) {
      console.error('Search recipes error:', error);
      res.status(500).json({ error: 'Failed to search recipes' });
    }
  }

  static async updateRecipe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.id);
      const recipe = await RecipeService.updateRecipe(recipeId, req.body, req.user!.id);
      
      if (!recipe) {
        res.status(404).json({ error: 'Recipe not found' });
        return;
      }

      res.json({
        message: 'Recipe updated successfully',
        recipe
      });
    } catch (error: any) {
      if (error.message === 'Unauthorized to update this recipe') {
        res.status(403).json({ error: error.message });
      } else if (error.message === 'Recipe not found') {
        res.status(404).json({ error: error.message });
      } else {
        console.error('Update recipe error:', error);
        res.status(500).json({ error: 'Failed to update recipe' });
      }
    }
  }

  static async deleteRecipe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.id);
      const success = await RecipeService.deleteRecipe(recipeId, req.user!.id);
      
      if (success) {
        res.json({ message: 'Recipe deleted successfully' });
      } else {
        res.status(404).json({ error: 'Recipe not found' });
      }
    } catch (error: any) {
      if (error.message === 'Unauthorized to delete this recipe') {
        res.status(403).json({ error: error.message });
      } else if (error.message === 'Recipe not found') {
        res.status(404).json({ error: error.message });
      } else {
        console.error('Delete recipe error:', error);
        res.status(500).json({ error: 'Failed to delete recipe' });
      }
    }
  }

  static async approveRecipe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.id);
      const success = await RecipeService.approveRecipe(recipeId);
      
      if (success) {
        res.json({ message: 'Recipe approved successfully' });
      } else {
        res.status(404).json({ error: 'Recipe not found' });
      }
    } catch (error) {
      console.error('Approve recipe error:', error);
      res.status(500).json({ error: 'Failed to approve recipe' });
    }
  }

  static async addNutritionInfo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.id);
      const nutrition = await RecipeService.addNutritionInfo(recipeId, req.body);
      
      res.status(201).json({
        message: 'Nutrition information added successfully',
        nutrition
      });
    } catch (error) {
      console.error('Add nutrition info error:', error);
      res.status(500).json({ error: 'Failed to add nutrition information' });
    }
  }

  static async getNutritionInfo(req: Request, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.id);
      const nutrition = await RecipeService.getNutritionInfo(recipeId);
      
      if (!nutrition) {
        res.status(404).json({ error: 'Nutrition information not found' });
        return;
      }

      res.json({ nutrition });
    } catch (error) {
      console.error('Get nutrition info error:', error);
      res.status(500).json({ error: 'Failed to get nutrition information' });
    }
  }
}
