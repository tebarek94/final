import { useState, useEffect, useCallback } from 'react';
import { mealPlansAPI } from '../services/api';
import { MealPlan, CreateMealPlanData } from '../types';

interface UseMealPlansReturn {
  mealPlans: MealPlan[];
  currentMealPlan: MealPlan | null;
  loading: boolean;
  error: string | null;
  createMealPlan: (data: CreateMealPlanData) => Promise<MealPlan>;
  getUserMealPlans: () => Promise<void>;
  getMealPlanById: (id: number) => Promise<void>;
  getMealPlanItems: (id: number) => Promise<void>;
  updateMealPlan: (id: number, data: Partial<CreateMealPlanData>) => Promise<MealPlan>;
  deleteMealPlan: (id: number) => Promise<void>;
  clearError: () => void;
  setCurrentMealPlan: (mealPlan: MealPlan | null) => void;
}

export const useMealPlans = (): UseMealPlansReturn => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const createMealPlan = useCallback(async (data: CreateMealPlanData): Promise<MealPlan> => {
    try {
      setLoading(true);
      setError(null);
      const response = await mealPlansAPI.create(data);
      const newMealPlan = response.data.mealPlan || response.data;
      
      // Add to meal plans list
      setMealPlans(prev => [newMealPlan, ...prev]);
      
      return newMealPlan;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create meal plan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserMealPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mealPlansAPI.getUserPlans();
      setMealPlans(response.data.mealPlans || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch meal plans');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMealPlanById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mealPlansAPI.getById(id);
      const mealPlan = response.data.mealPlan || response.data;
      setCurrentMealPlan(mealPlan);
      return mealPlan;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch meal plan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMealPlanItems = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mealPlansAPI.getItems(id);
      const items = response.data.items || response.data;
      
      // Update current meal plan with items
      if (currentMealPlan?.id === id) {
        setCurrentMealPlan(prev => prev ? { ...prev, items } : null);
      }
      
      // Update in meal plans list
      setMealPlans(prev => prev.map(plan => 
        plan.id === id ? { ...plan, items } : plan
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch meal plan items');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentMealPlan]);

  const updateMealPlan = useCallback(async (id: number, data: Partial<CreateMealPlanData>): Promise<MealPlan> => {
    try {
      setLoading(true);
      setError(null);
      const response = await mealPlansAPI.update(id, data);
      const updatedMealPlan = response.data.mealPlan || response.data;
      
      // Update in meal plans list
      setMealPlans(prev => prev.map(plan => 
        plan.id === id ? updatedMealPlan : plan
      ));
      
      // Update current meal plan if it's the one being edited
      if (currentMealPlan?.id === id) {
        setCurrentMealPlan(updatedMealPlan);
      }
      
      return updatedMealPlan;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update meal plan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentMealPlan]);

  const deleteMealPlan = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await mealPlansAPI.delete(id);
      
      // Remove from meal plans list
      setMealPlans(prev => prev.filter(plan => plan.id !== id));
      
      // Clear current meal plan if it's the one being deleted
      if (currentMealPlan?.id === id) {
        setCurrentMealPlan(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete meal plan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentMealPlan]);

  // Load initial data
  useEffect(() => {
    getUserMealPlans();
  }, [getUserMealPlans]);

  return {
    mealPlans,
    currentMealPlan,
    loading,
    error,
    createMealPlan,
    getUserMealPlans,
    getMealPlanById,
    getMealPlanItems,
    updateMealPlan,
    deleteMealPlan,
    clearError,
    setCurrentMealPlan,
  };
};
