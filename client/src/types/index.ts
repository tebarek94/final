export interface User {
  id: number;
  email: string;
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
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  cooking_time: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine_type?: string;
  tags: string[];
  image_url?: string;
  created_by: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  nutrition?: RecipeNutrition;
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
  created_at: string;
}

export interface MealPlan {
  id: number;
  user_id: number;
  name: string;
  start_date: string;
  end_date: string;
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  created_at: string;
  updated_at: string;
  items?: MealPlanItem[];
}

export interface MealPlanItem {
  id: number;
  meal_plan_id: number;
  recipe_id: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  date: string;
  created_at: string;
  recipe?: Recipe;
}

export interface AIAnalysis {
  id: number;
  user_id: number;
  analysis_type: 'meal_suggestion' | 'nutrition_analysis' | 'diet_optimization';
  input_data: any;
  ai_response: any;
  created_at: string;
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
  created_at: string;
  recipe?: Recipe;
}

export interface FoodCategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface RecipeState {
  recipes: Recipe[];
  userRecipes: Recipe[];
  currentRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
}

export interface MealPlanState {
  mealPlans: MealPlan[];
  currentMealPlan: MealPlan | null;
  loading: boolean;
  error: string | null;
}

export interface AIState {
  analyses: AIAnalysis[];
  loading: boolean;
  error: string | null;
}

export interface AdminState {
  users: User[];
  pendingRecipes: Recipe[];
  systemAnalytics: any;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  recipes: RecipeState;
  mealPlans: MealPlanState;
  ai: AIState;
  admin: AdminState;
  mealSuggestions: MealSuggestionsState;
}

export interface MealSuggestionsState {
  userSuggestions: UserSuggestedMeal[];
  receivedSuggestions: UserSuggestedMeal[];
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
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

export interface UpdateProfileData {
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
}

export interface CreateRecipeData {
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  cooking_time: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine_type?: string;
  tags: string[];
  image_url?: string;
}

export interface CreateMealPlanData {
  name: string;
  start_date: string;
  end_date: string;
  meals: {
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    date: string;
    recipe_id: number;
  }[];
}

export interface NutritionData {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface AIGenerateMealData {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  preferences: string[];
}

export interface AINutritionAnalysisData {
  mealData: {
    name: string;
    ingredients: Ingredient[];
    nutrition?: NutritionData;
  };
}
