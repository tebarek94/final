import { useState, useEffect, useCallback } from 'react';
import { recipesAPI } from '../services/api';
import { Recipe, CreateRecipeData, NutritionData } from '../types';

interface UseRecipesReturn {
  recipes: Recipe[];
  userRecipes: Recipe[];
  currentRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
  getAllRecipes: (limit?: number, offset?: number) => Promise<void>;
  searchRecipes: (query: string, limit?: number) => Promise<void>;
  getRecipeById: (id: number) => Promise<void>;
  createRecipe: (data: CreateRecipeData) => Promise<Recipe>;
  updateRecipe: (id: number, data: Partial<CreateRecipeData>) => Promise<Recipe>;
  deleteRecipe: (id: number) => Promise<void>;
  getUserRecipes: () => Promise<void>;
  addNutritionInfo: (id: number, data: NutritionData) => Promise<void>;
  getRecipeNutrition: (id: number) => Promise<void>;
  clearError: () => void;
  setCurrentRecipe: (recipe: Recipe | null) => void;
}

export const useRecipes = (): UseRecipesReturn => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const getAllRecipes = useCallback(async (limit = 10, offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipesAPI.getAll({ limit, offset });
      setRecipes(response.data.recipes || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch recipes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchRecipes = useCallback(async (query: string, limit = 5) => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipesAPI.search(query, limit);
      setRecipes(response.data.recipes || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search recipes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecipeById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipesAPI.getById(id);
      const recipe = response.data.recipe || response.data;
      setCurrentRecipe(recipe);
      return recipe;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch recipe');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRecipe = useCallback(async (data: CreateRecipeData): Promise<Recipe> => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipesAPI.create(data);
      const newRecipe = response.data.recipe || response.data;
      
      // Add to user recipes
      setUserRecipes(prev => [newRecipe, ...prev]);
      
      return newRecipe;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create recipe');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRecipe = useCallback(async (id: number, data: Partial<CreateRecipeData>): Promise<Recipe> => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipesAPI.update(id, data);
      const updatedRecipe = response.data.recipe || response.data;
      
      // Update in recipes list
      setRecipes(prev => prev.map(recipe => 
        recipe.id === id ? updatedRecipe : recipe
      ));
      
      // Update in user recipes
      setUserRecipes(prev => prev.map(recipe => 
        recipe.id === id ? updatedRecipe : recipe
      ));
      
      // Update current recipe if it's the one being edited
      if (currentRecipe?.id === id) {
        setCurrentRecipe(updatedRecipe);
      }
      
      return updatedRecipe;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update recipe');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentRecipe]);

  const deleteRecipe = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await recipesAPI.delete(id);
      
      // Remove from recipes list
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
      
      // Remove from user recipes
      setUserRecipes(prev => prev.filter(recipe => recipe.id !== id));
      
      // Clear current recipe if it's the one being deleted
      if (currentRecipe?.id === id) {
        setCurrentRecipe(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete recipe');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentRecipe]);

  const getUserRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipesAPI.getUserRecipes();
      setUserRecipes(response.data.recipes || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user recipes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addNutritionInfo = useCallback(async (id: number, data: NutritionData) => {
    try {
      setLoading(true);
      setError(null);
      await recipesAPI.addNutrition(id, data);
      
      // Refresh the recipe to get updated nutrition info
      await getRecipeById(id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add nutrition info');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getRecipeById]);

  const getRecipeNutrition = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipesAPI.getNutrition(id);
      const nutrition = response.data.nutrition || response.data;
      
      // Update current recipe with nutrition info
      if (currentRecipe?.id === id) {
        setCurrentRecipe(prev => prev ? { ...prev, nutrition } : null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch recipe nutrition');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentRecipe]);

  // Load initial data
  useEffect(() => {
    getAllRecipes();
  }, [getAllRecipes]);

  return {
    recipes,
    userRecipes,
    currentRecipe,
    loading,
    error,
    getAllRecipes,
    searchRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getUserRecipes,
    addNutritionInfo,
    getRecipeNutrition,
    clearError,
    setCurrentRecipe,
  };
};
