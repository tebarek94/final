import pool from '../config/database';
import { Recipe, CreateRecipeRequest, RecipeNutrition } from '../types';

export class RecipeModel {
  static async create(recipeData: CreateRecipeRequest, createdBy: number): Promise<Recipe | null> {
    const [result] = await pool.execute(
      `INSERT INTO recipes (
        title, description, ingredients, instructions, cooking_time,
        servings, difficulty, cuisine_type, tags, image_url, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recipeData.title,
        recipeData.description || null,
        JSON.stringify(recipeData.ingredients),
        JSON.stringify(recipeData.instructions),
        recipeData.cooking_time || null,
        recipeData.servings || null,
        recipeData.difficulty || null,
        recipeData.cuisine_type || null,
        JSON.stringify(recipeData.tags || []),
        recipeData.image_url || null,
        createdBy
      ]
    );

    const recipeId = (result as any).insertId;
    return this.findById(recipeId);
  }

  static async findById(id: number): Promise<Recipe | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM recipes WHERE id = ?',
      [id]
    );

    const recipes = rows as Recipe[];
    if (recipes.length === 0) return null;

    const recipe = recipes[0];
    return {
      ...recipe,
      ingredients: this.parseJsonField(recipe.ingredients),
      instructions: this.parseJsonField(recipe.instructions),
      tags: this.parseJsonField(recipe.tags),
      created_at: new Date(recipe.created_at),
      updated_at: new Date(recipe.updated_at)
    };
  }

  static async findAll(limit: number = 10, offset: number = 0, approvedOnly: boolean = true): Promise<Recipe[]> {
    // Ensure limit and offset are valid integers
    const validLimit = Math.max(1, Math.min(100, parseInt(limit.toString()) || 10));
    const validOffset = Math.max(0, parseInt(offset.toString()) || 0);
    
    const [rows] = await pool.execute(
      'SELECT * FROM recipes WHERE is_approved = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [approvedOnly, validLimit, validOffset]
    );

    const recipes = rows as Recipe[];
    return recipes.map(recipe => ({
      ...recipe,
      ingredients: this.parseJsonField(recipe.ingredients),
      instructions: this.parseJsonField(recipe.instructions),
      tags: this.parseJsonField(recipe.tags),
      created_at: new Date(recipe.created_at),
      updated_at: new Date(recipe.updated_at)
    }));
  }

  static async findByUser(userId: number): Promise<Recipe[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM recipes WHERE created_by = ? ORDER BY created_at DESC',
      [userId]
    );

    return (rows as Recipe[]).map(recipe => ({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients as any),
      instructions: JSON.parse(recipe.instructions as any),
      tags: JSON.parse(recipe.tags as any || '[]'),
      created_at: new Date(recipe.created_at),
      updated_at: new Date(recipe.updated_at)
    }));
  }

  static async search(query: string, limit: number = 50): Promise<Recipe[]> {
    // Ensure limit is a valid integer
    const validLimit = Math.max(1, Math.min(100, parseInt(limit.toString()) || 50));
    
    const [rows] = await pool.execute(
      `SELECT * FROM recipes 
       WHERE (title LIKE ? OR description LIKE ? OR JSON_SEARCH(tags, 'one', ?) IS NOT NULL)
       AND is_approved = true
       ORDER BY created_at DESC
       LIMIT ?`,
      [`%${query}%`, `%${query}%`, query, validLimit]
    );

    return (rows as Recipe[]).map(recipe => ({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients as any),
      instructions: JSON.parse(recipe.instructions as any),
      tags: JSON.parse(recipe.tags as any || '[]'),
      created_at: new Date(recipe.created_at),
      updated_at: new Date(recipe.updated_at)
    }));
  }

  static async update(id: number, updateData: Partial<CreateRecipeRequest>): Promise<Recipe | null> {
    const fields = [];
    const values = [];

    if (updateData.title !== undefined) {
      fields.push('title = ?');
      values.push(updateData.title);
    }
    if (updateData.description !== undefined) {
      fields.push('description = ?');
      values.push(updateData.description);
    }
    if (updateData.ingredients !== undefined) {
      fields.push('ingredients = ?');
      values.push(JSON.stringify(updateData.ingredients));
    }
    if (updateData.instructions !== undefined) {
      fields.push('instructions = ?');
      values.push(JSON.stringify(updateData.instructions));
    }
    if (updateData.cooking_time !== undefined) {
      fields.push('cooking_time = ?');
      values.push(updateData.cooking_time);
    }
    if (updateData.servings !== undefined) {
      fields.push('servings = ?');
      values.push(updateData.servings);
    }
    if (updateData.difficulty !== undefined) {
      fields.push('difficulty = ?');
      values.push(updateData.difficulty);
    }
    if (updateData.cuisine_type !== undefined) {
      fields.push('cuisine_type = ?');
      values.push(updateData.cuisine_type);
    }
    if (updateData.tags !== undefined) {
      fields.push('tags = ?');
      values.push(JSON.stringify(updateData.tags));
    }
    if (updateData.image_url !== undefined) {
      fields.push('image_url = ?');
      values.push(updateData.image_url);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await pool.execute(
      `UPDATE recipes SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async approve(id: number): Promise<boolean> {
    const [result] = await pool.execute(
      'UPDATE recipes SET is_approved = true WHERE id = ?',
      [id]
    );

    return (result as any).affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute(
      'DELETE FROM recipes WHERE id = ?',
      [id]
    );

    return (result as any).affectedRows > 0;
  }

  static async addNutrition(recipeId: number, nutrition: Omit<RecipeNutrition, 'id' | 'recipe_id' | 'created_at'>): Promise<RecipeNutrition> {
    const [result] = await pool.execute(
      `INSERT INTO recipe_nutrition (
        recipe_id, calories, protein, carbohydrates, fat, fiber, sugar, sodium
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recipeId,
        nutrition.calories || null,
        nutrition.protein || null,
        nutrition.carbohydrates || null,
        nutrition.fat || null,
        nutrition.fiber || null,
        nutrition.sugar || null,
        nutrition.sodium || null
      ]
    );

    const nutritionId = (result as any).insertId;
    
    const [rows] = await pool.execute(
      'SELECT * FROM recipe_nutrition WHERE id = ?',
      [nutritionId]
    );

    const nutritionData = (rows as RecipeNutrition[])[0];
    return {
      ...nutritionData,
      created_at: new Date(nutritionData.created_at)
    };
  }

  static async getNutrition(recipeId: number): Promise<RecipeNutrition | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM recipe_nutrition WHERE recipe_id = ?',
      [recipeId]
    );

    const nutrition = (rows as RecipeNutrition[])[0];
    if (!nutrition) return null;

    return {
      ...nutrition,
      created_at: new Date(nutrition.created_at)
    };
  }

  // Add this helper method to safely parse JSON fields
  private static parseJsonField(field: any): any[] {
    if (!field) return [];
    
    try {
      // If it's already an array, return it
      if (Array.isArray(field)) return field;
      
      // If it's a string, try to parse it
      if (typeof field === 'string') {
        return JSON.parse(field);
      }
      
      // If it's already parsed JSON, return it
      return field;
    } catch (error) {
      console.error('Error parsing JSON field:', error);
      return [];
    }
  }
}
