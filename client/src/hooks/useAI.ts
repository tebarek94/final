import { useState, useEffect, useCallback } from 'react';
import { aiAPI } from '../services/api';
import { AIAnalysis, AIGenerateMealData, AINutritionAnalysisData } from '../types';

interface UseAIReturn {
  analyses: AIAnalysis[];
  loading: boolean;
  error: string | null;
  generateMeal: (data: AIGenerateMealData) => Promise<any>;
  analyzeNutrition: (data: AINutritionAnalysisData) => Promise<any>;
  getAnalysisHistory: (limit?: number) => Promise<void>;
  clearError: () => void;
}

export const useAI = (): UseAIReturn => {
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const generateMeal = useCallback(async (data: AIGenerateMealData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiAPI.generateMeal(data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate meal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeNutrition = useCallback(async (data: AINutritionAnalysisData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiAPI.analyzeNutrition(data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze nutrition');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAnalysisHistory = useCallback(async (limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiAPI.getHistory(limit);
      setAnalyses(response.data.analyses || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch analysis history');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    getAnalysisHistory();
  }, [getAnalysisHistory]);

  return {
    analyses,
    loading,
    error,
    generateMeal,
    analyzeNutrition,
    getAnalysisHistory,
    clearError,
  };
};
