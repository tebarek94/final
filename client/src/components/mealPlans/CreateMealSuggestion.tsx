import React, { useState, useEffect } from 'react';
import { useMealSuggestions } from '../../hooks/useMealSuggestions';
import { useRecipes } from '../../hooks/useRecipes';
import { useAuth } from '../../hooks/useAuth';
import { User, Recipe } from '../../types';

interface CreateMealSuggestionProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateMealSuggestion: React.FC<CreateMealSuggestionProps> = ({ 
  onSuccess, 
  onCancel 
}) => {
  const { user } = useAuth();
  const { recipes } = useRecipes();
  const { createSuggestion, loading, error } = useMealSuggestions();
  
  const [formData, setFormData] = useState({
    user_id: 0,
    meal_type: 'breakfast' as const,
    recipe_id: '',
    custom_meal: '',
    reason: ''
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCustomMeal, setShowCustomMeal] = useState(false);

  useEffect(() => {
    if (recipes.length === 0) {
      // Fetch recipes if not already loaded
      // This assumes useRecipes has a fetchRecipes function
    }
  }, [recipes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      alert('Please select a user to suggest a meal to');
      return;
    }

    try {
      const suggestionData = {
        user_id: selectedUser.id,
        meal_type: formData.meal_type,
        recipe_id: formData.recipe_id ? parseInt(formData.recipe_id) : undefined,
        custom_meal: showCustomMeal ? formData.custom_meal : undefined,
        reason: formData.reason || undefined
      };

      await createSuggestion(suggestionData);
      onSuccess?.();
      // Reset form
      setFormData({
        user_id: 0,
        meal_type: 'breakfast',
        recipe_id: '',
        custom_meal: '',
        reason: ''
      });
      setSelectedUser(null);
    } catch (err) {
      console.error('Failed to create suggestion:', err);
    }
  };

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = parseInt(e.target.value);
    const user = recipes.find(r => r.created_by === userId);
    if (user) {
      setSelectedUser({
        id: user.created_by,
        email: '', // You might want to fetch user details separately
        first_name: '',
        last_name: '',
        role: 'user',
        created_at: '',
        updated_at: ''
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Suggest a Meal</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suggest to User
          </label>
          <select
            name="user_id"
            value={selectedUser?.id || ''}
            onChange={handleUserSelect}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a user</option>
            {recipes.map(recipe => (
              <option key={recipe.id} value={recipe.created_by}>
                User {recipe.created_by} (from recipe: {recipe.title})
              </option>
            ))}
          </select>
        </div>

        {/* Meal Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meal Type
          </label>
          <select
            name="meal_type"
            value={formData.meal_type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        {/* Recipe Selection vs Custom Meal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suggestion Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="suggestionType"
                checked={!showCustomMeal}
                onChange={() => setShowCustomMeal(false)}
                className="mr-2"
              />
              Existing Recipe
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="suggestionType"
                checked={showCustomMeal}
                onChange={() => setShowCustomMeal(true)}
                className="mr-2"
              />
              Custom Meal
            </label>
          </div>
        </div>

        {/* Recipe Selection */}
        {!showCustomMeal && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Recipe
            </label>
            <select
              name="recipe_id"
              value={formData.recipe_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose a recipe</option>
              {recipes.map(recipe => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Custom Meal */}
        {showCustomMeal && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Meal Description
            </label>
            <textarea
              name="custom_meal"
              value={formData.custom_meal}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the custom meal you want to suggest..."
              required
            />
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Suggestion (Optional)
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Why are you suggesting this meal?"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating...' : 'Create Suggestion'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMealSuggestion;
