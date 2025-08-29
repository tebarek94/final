import pool from '../config/database';
import { MealPlan, CreateMealPlanRequest, MealPlanItem } from '../types';

export class MealPlanModel {
  static async create(mealPlanData: CreateMealPlanRequest, userId: number): Promise<MealPlan | null> {
    // Start transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Create meal plan
      const [mealPlanResult] = await connection.execute(
        `INSERT INTO meal_plans (
          user_id, name, start_date, end_date
        ) VALUES (?, ?, ?, ?)`,
        [
          userId,
          mealPlanData.name,
          mealPlanData.start_date,
          mealPlanData.end_date
        ]
      );

      const mealPlanId = (mealPlanResult as any).insertId;

      // Add meal plan items
      for (const meal of mealPlanData.meals) {
        await connection.execute(
          `INSERT INTO meal_plan_items (
            meal_plan_id, recipe_id, meal_type, day_of_week, date
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            mealPlanId,
            meal.recipe_id,
            meal.meal_type,
            meal.day_of_week,
            meal.date
          ]
        );
      }

      await connection.commit();

      return this.findById(mealPlanId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findById(id: number): Promise<MealPlan | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM meal_plans WHERE id = ?',
      [id]
    );

    const mealPlans = rows as MealPlan[];
    if (mealPlans.length === 0) return null;

    const mealPlan = mealPlans[0];
    return {
      ...mealPlan,
      start_date: new Date(mealPlan.start_date),
      end_date: new Date(mealPlan.end_date),
      created_at: new Date(mealPlan.created_at),
      updated_at: new Date(mealPlan.updated_at)
    };
  }

  static async findByUser(userId: number): Promise<MealPlan[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM meal_plans WHERE user_id = ? ORDER BY start_date DESC',
      [userId]
    );

    return (rows as MealPlan[]).map(mealPlan => ({
      ...mealPlan,
      start_date: new Date(mealPlan.start_date),
      end_date: new Date(mealPlan.end_date),
      created_at: new Date(mealPlan.created_at),
      updated_at: new Date(mealPlan.updated_at)
    }));
  }

  static async getMealPlanItems(mealPlanId: number): Promise<MealPlanItem[]> {
    const [rows] = await pool.execute(
      `SELECT mpi.*, r.title as recipe_title, r.image_url as recipe_image
       FROM meal_plan_items mpi
       LEFT JOIN recipes r ON mpi.recipe_id = r.id
       WHERE mpi.meal_plan_id = ?
       ORDER BY mpi.date, mpi.meal_type`,
      [mealPlanId]
    );

    return (rows as any[]).map(item => ({
      ...item,
      date: new Date(item.date),
      created_at: new Date(item.created_at)
    }));
  }

  static async updateNutritionTotals(mealPlanId: number): Promise<void> {
    const [rows] = await pool.execute(
      `SELECT 
         SUM(rn.calories) as total_calories,
         SUM(rn.protein) as total_protein,
         SUM(rn.carbohydrates) as total_carbs,
         SUM(rn.fat) as total_fat
       FROM meal_plan_items mpi
       JOIN recipe_nutrition rn ON mpi.recipe_id = rn.recipe_id
       WHERE mpi.meal_plan_id = ?`,
      [mealPlanId]
    );

    const totals = (rows as any[])[0];
    
    await pool.execute(
      `UPDATE meal_plans SET 
         total_calories = ?, total_protein = ?, total_carbs = ?, total_fat = ?,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        totals.total_calories || 0,
        totals.total_protein || 0,
        totals.total_carbs || 0,
        totals.total_fat || 0,
        mealPlanId
      ]
    );
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute(
      'DELETE FROM meal_plans WHERE id = ?',
      [id]
    );

    return (result as any).affectedRows > 0;
  }
}
