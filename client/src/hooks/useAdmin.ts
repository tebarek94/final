import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../services/api';
import { User, Recipe } from '../types';

interface UseAdminReturn {
  users: User[];
  pendingRecipes: Recipe[];
  systemAnalytics: any;
  userAnalytics: any;
  loading: boolean;
  error: string | null;
  getAllUsers: (limit?: number, offset?: number) => Promise<void>;
  getUserById: (id: number) => Promise<User>;
  updateUserRole: (id: number, role: string) => Promise<void>;
  getPendingRecipes: () => Promise<void>;
  approveRecipe: (id: number) => Promise<void>;
  rejectRecipe: (id: number) => Promise<void>;
  getSystemAnalytics: () => Promise<void>;
  getUserAnalytics: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useAdmin = (): UseAdminReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingRecipes, setPendingRecipes] = useState<Recipe[]>([]);
  const [systemAnalytics, setSystemAnalytics] = useState<any>(null);
  const [userAnalytics, setUserAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const getAllUsers = useCallback(async (limit = 10, offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getAllUsers({ limit, offset });
      setUsers(response.data.users || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (id: number): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getUserById(id);
      const user = response.data.user || response.data;
      return user;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserRole = useCallback(async (id: number, role: string) => {
    try {
      setLoading(true);
      setError(null);
      await adminAPI.updateUserRole(id, { role });
      
      // Update user in the list
      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, role: role as 'user' | 'admin' } : user
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user role');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPendingRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getPendingRecipes();
      setPendingRecipes(response.data.recipes || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch pending recipes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveRecipe = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await adminAPI.approveRecipe(id);
      
      // Remove from pending recipes
      setPendingRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve recipe');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectRecipe = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await adminAPI.rejectRecipe(id);
      
      // Remove from pending recipes
      setPendingRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject recipe');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSystemAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getSystemAnalytics();
      setSystemAnalytics(response.data.analytics || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch system analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserAnalytics = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getUserAnalytics(id);
      setUserAnalytics(response.data.analytics || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    getAllUsers();
    getPendingRecipes();
    getSystemAnalytics();
  }, [getAllUsers, getPendingRecipes, getSystemAnalytics]);

  return {
    users,
    pendingRecipes,
    systemAnalytics,
    userAnalytics,
    loading,
    error,
    getAllUsers,
    getUserById,
    updateUserRole,
    getPendingRecipes,
    approveRecipe,
    rejectRecipe,
    getSystemAnalytics,
    getUserAnalytics,
    clearError,
  };
};
