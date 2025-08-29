import pool from '../config/database';
import { UserSuggestedMeal, SuggestMealRequest } from '../types';

export class UserSuggestedMealModel {
  static async create(suggestionData: SuggestMealRequest, suggestedBy: number): Promise<UserSuggestedMeal | null> {
    const [result] = await pool.execute(
      `INSERT INTO user_suggested_meals (
        user_id, suggested_by, meal_type, recipe_id, custom_meal, reason
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        suggestionData.user_id,
        suggestedBy,
        suggestionData.meal_type,
        suggestionData.recipe_id || null,
        JSON.stringify(suggestionData.custom_meal || null),
        suggestionData.reason || null
      ]
    );

    const suggestionId = (result as any).insertId;
    return this.findById(suggestionId);
  }

  static async findById(id: number): Promise<UserSuggestedMeal | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM user_suggested_meals WHERE id = ?',
      [id]
    );

    const suggestions = rows as UserSuggestedMeal[];
    if (suggestions.length === 0) return null;

    const suggestion = suggestions[0];
    return {
      ...suggestion,
      custom_meal: suggestion.custom_meal ? JSON.parse(suggestion.custom_meal as any) : null,
      created_at: new Date(suggestion.created_at)
    };
  }

  static async findByUser(userId: number): Promise<UserSuggestedMeal[]> {
    const [rows] = await pool.execute(
      `SELECT usm.*, u.first_name as admin_first_name, u.last_name as admin_last_name,
              r.title as recipe_title, r.image_url as recipe_image
       FROM user_suggested_meals usm
       LEFT JOIN users u ON usm.suggested_by = u.id
       LEFT JOIN recipes r ON usm.recipe_id = r.id
       WHERE usm.user_id = ?
       ORDER BY usm.created_at DESC`,
      [userId]
    );

    return (rows as any[]).map(suggestion => ({
      ...suggestion,
      custom_meal: suggestion.custom_meal ? JSON.parse(suggestion.custom_meal) : null,
      created_at: new Date(suggestion.created_at)
    }));
  }

  static async findByAdmin(adminId: number): Promise<UserSuggestedMeal[]> {
    const [rows] = await pool.execute(
      `SELECT usm.*, u.first_name as user_first_name, u.last_name as user_last_name,
              r.title as recipe_title, r.image_url as recipe_image
       FROM user_suggested_meals usm
       LEFT JOIN users u ON usm.user_id = u.id
       LEFT JOIN recipes r ON usm.recipe_id = r.id
       WHERE usm.suggested_by = ?
       ORDER BY usm.created_at DESC`,
      [adminId]
    );

    return (rows as any[]).map(suggestion => ({
      ...suggestion,
      custom_meal: suggestion.custom_meal ? JSON.parse(suggestion.custom_meal) : null,
      created_at: new Date(suggestion.created_at)
    }));
  }

  static async updateAcceptance(id: number, isAccepted: boolean): Promise<boolean> {
    const [result] = await pool.execute(
      'UPDATE user_suggested_meals SET is_accepted = ? WHERE id = ?',
      [isAccepted, id]
    );

    return (result as any).affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute(
      'DELETE FROM user_suggested_meals WHERE id = ?',
      [id]
    );

    return (result as any).affectedRows > 0;
  }
}
