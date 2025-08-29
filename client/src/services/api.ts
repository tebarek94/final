import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://final-ufhk.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure token is not too long and clean it
      const cleanToken = token.trim();
      if (cleanToken.length > 1000) {
        console.warn('Token is unusually long, clearing it');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return config;
      }
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Health Check API
export const healthAPI = {
  check: () => api.get('/health'),
};

// Auth API - matches Postman collection exactly
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: any) => api.put('/auth/change-password', data),
};

// Recipes API - matches Postman collection exactly
export const recipesAPI = {
  getAll: (params?: { limit?: number; offset?: number }) => api.get('/recipes', { params }),
  search: (query: string, limit?: number) => api.get('/recipes/search', { params: { q: query, limit } }),
  getById: (id: number) => api.get(`/recipes/${id}`),
  create: (data: any) => api.post('/recipes', data),
  update: (id: number, data: any) => api.put(`/recipes/${id}`, data),
  delete: (id: number) => api.delete(`/recipes/${id}`),
  getUserRecipes: () => api.get('/recipes/user/me'),
  addNutrition: (id: number, data: any) => api.post(`/recipes/${id}/nutrition`, data),
  getNutrition: (id: number) => api.get(`/recipes/${id}/nutrition`),
};

// Meal Plans API - matches Postman collection exactly
export const mealPlansAPI = {
  create: (data: any) => api.post('/meal-plans', data),
  getUserPlans: () => api.get('/meal-plans/user'),
  getById: (id: number) => api.get(`/meal-plans/${id}`),
  getItems: (id: number) => api.get(`/meal-plans/${id}/items`),
  update: (id: number, data: any) => api.put(`/meal-plans/${id}`, data),
  delete: (id: number) => api.delete(`/meal-plans/${id}`),
};

// AI API - matches Postman collection exactly
export const aiAPI = {
  generateMeal: (data: any) => api.post('/ai/generate-meal', data),
  analyzeNutrition: (data: any) => api.post('/ai/analyze-nutrition', data),
  getHistory: (limit?: number) => api.get('/ai/history', { params: { limit } }),
};

// Admin API - matches Postman collection exactly
export const adminAPI = {
  getAllUsers: (params?: { limit?: number; offset?: number }) => api.get('/admin/users', { params }),
  getUserById: (id: number) => api.get(`/admin/users/${id}`),
  updateUserRole: (id: number, data: { role: string }) => api.put(`/admin/users/${id}/role`, data),
  getPendingRecipes: () => api.get('/admin/recipes/pending'),
  approveRecipe: (id: number) => api.put(`/admin/recipes/${id}/approve`),
  rejectRecipe: (id: number) => api.delete(`/admin/recipes/${id}/reject`),
  getSystemAnalytics: () => api.get('/admin/analytics/system'),
  getUserAnalytics: (id: number) => api.get(`/admin/analytics/users/${id}`),
};

// Meal Suggestions API
export const mealSuggestionsAPI = {
  create: (data: any) => api.post('/meal-suggestions', data),
  getUserSuggestions: () => api.get('/meal-suggestions/user'),
  getReceivedSuggestions: () => api.get('/meal-suggestions/received'),
  accept: (id: number) => api.put(`/meal-suggestions/${id}/accept`),
  reject: (id: number) => api.put(`/meal-suggestions/${id}/reject`),
  delete: (id: number) => api.delete(`/meal-suggestions/${id}`),
};

export default api;
