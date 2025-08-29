import { useState, useEffect, useCallback } from 'react';
import { mealSuggestionsAPI } from '../services/api';
import { UserSuggestedMeal } from '../types';

interface CreateSuggestionData {
  user_id: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe_id?: number;
  custom_meal?: any;
  reason?: string;
}

export const useMealSuggestions = () => {
  const [userSuggestions, setUserSuggestions] = useState<UserSuggestedMeal[]>([]);
  const [receivedSuggestions, setReceivedSuggestions] = useState<UserSuggestedMeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user's sent suggestions
  const fetchUserSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mealSuggestionsAPI.getUserSuggestions();
      setUserSuggestions(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user suggestions');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get received suggestions
  const fetchReceivedSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mealSuggestionsAPI.getReceivedSuggestions();
      setReceivedSuggestions(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch received suggestions');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new suggestion
  const createSuggestion = useCallback(async (data: CreateSuggestionData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mealSuggestionsAPI.create(data);
      await fetchUserSuggestions(); // Refresh the list
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create suggestion');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUserSuggestions]);

  // Accept a suggestion
  const acceptSuggestion = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await mealSuggestionsAPI.accept(id);
      await fetchReceivedSuggestions(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to accept suggestion');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchReceivedSuggestions]);

  // Reject a suggestion
  const rejectSuggestion = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await mealSuggestionsAPI.reject(id);
      await fetchReceivedSuggestions(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject suggestion');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchReceivedSuggestions]);

  // Delete a suggestion
  const deleteSuggestion = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await mealSuggestionsAPI.delete(id);
      await fetchUserSuggestions(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete suggestion');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUserSuggestions]);

  // Load suggestions on mount
  useEffect(() => {
    fetchUserSuggestions();
    fetchReceivedSuggestions();
  }, [fetchUserSuggestions, fetchReceivedSuggestions]);

  return {
    userSuggestions,
    receivedSuggestions,
    loading,
    error,
    createSuggestion,
    acceptSuggestion,
    rejectSuggestion,
    deleteSuggestion,
    fetchUserSuggestions,
    fetchReceivedSuggestions,
  };
};
