export interface User {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin';
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  fitness_goal?: 'weight_loss' | 'maintenance' | 'muscle_gain';
  dietary_preferences?: string[];
  allergies?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string[];
  cooking_time?: number;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  cuisine_type?: string;
  tags?: string[];
  image_url?: string;
  created_by: number;
  is_approved: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface RecipeNutrition {
  id: number;
  recipe_id: number;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  created_at: Date;
}

export interface MealPlan {
  id: number;
  user_id: number;
  name: string;
  start_date: Date;
  end_date: Date;
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  created_at: Date;
  updated_at: Date;
}

export interface MealPlanItem {
  id: number;
  meal_plan_id: number;
  recipe_id: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  date: Date;
  created_at: Date;
}

export interface UserSuggestedMeal {
  id: number;
  user_id: number;
  suggested_by: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe_id?: number;
  custom_meal?: any;
  reason?: string;
  is_accepted: boolean;
  created_at: Date;
}

export interface AIAnalysisResult {
  id: number;
  user_id: number;
  analysis_type: 'meal_suggestion' | 'nutrition_analysis' | 'diet_optimization';
  input_data: any;
  ai_response: any;
  created_at: Date;
}

export interface FoodCategory {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  fitness_goal?: 'weight_loss' | 'maintenance' | 'muscle_gain';
  dietary_preferences?: string[];
  allergies?: string[];
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  fitness_goal?: 'weight_loss' | 'maintenance' | 'muscle_gain';
  dietary_preferences?: string[];
  allergies?: string[];
  role?: 'user' | 'admin'; // Add this line
}

export interface CreateRecipeRequest {
  title: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string[];
  cooking_time?: number;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  cuisine_type?: string;
  tags?: string[];
  image_url?: string;
}

export interface CreateMealPlanRequest {
  name: string;
  start_date: Date;
  end_date: Date;
  meals: {
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    date: Date;
    recipe_id: number;
  }[];
}

export interface SuggestMealRequest {
  user_id: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe_id?: number;
  custom_meal?: any;
  reason?: string;
}
