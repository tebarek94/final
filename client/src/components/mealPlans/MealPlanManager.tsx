import React, { useState, useEffect } from 'react';
import { useMealPlans } from '../../hooks/useMealPlans';
import { useRecipes } from '../../hooks/useRecipes';
import { MealPlan, CreateMealPlanData, MealPlanItem, Recipe } from '../../types';

const MealPlanManager: React.FC = () => {
  const {
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
  } = useMealPlans();

  const { recipes } = useRecipes();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingMealPlan, setEditingMealPlan] = useState<MealPlan | null>(null);
  const [selectedMealPlanId, setSelectedMealPlanId] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateMealPlanData>({
    name: '',
    start_date: '',
    end_date: '',
    meals: [],
  });

  const [newMeal, setNewMeal] = useState({
    meal_type: 'breakfast' as const,
    day_of_week: 'monday' as const,
    date: '',
    recipe_id: 0,
  });

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewMealChange = (field: keyof typeof newMeal, value: string | number) => {
    setNewMeal(prev => ({ ...prev, [field]: value }));
  };

  const addMealToPlan = () => {
    if (newMeal.recipe_id && newMeal.date && newMeal.day_of_week) {
      setFormData(prev => ({
        ...prev,
        meals: [...prev.meals, { ...newMeal }],
      }));
      
      // Reset new meal form
      setNewMeal({
        meal_type: 'breakfast',
        day_of_week: 'monday',
        date: '',
        recipe_id: 0,
      });
    }
  };

  const removeMealFromPlan = (index: number) => {
    setFormData(prev => ({
      ...prev,
      meals: prev.meals.filter((_, i) => i !== index),
    }));
  };

  const getDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getMealTypeName = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getRecipeName = (recipeId: number) => {
    const recipe = recipes.find(r => r.id === recipeId);
    return recipe ? recipe.title : 'Unknown Recipe';
  };

  // Handle form submissions
  const handleCreateMealPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.meals.length === 0) {
      alert('Please add at least one meal to the plan');
      return;
    }
    
    try {
      await createMealPlan(formData);
      setShowCreateForm(false);
      setFormData({
        name: '',
        start_date: '',
        end_date: '',
        meals: [],
      });
    } catch (err) {
      console.error('Failed to create meal plan:', err);
    }
  };

  const handleUpdateMealPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMealPlan) return;
    
    try {
      await updateMealPlan(editingMealPlan.id, formData);
      setShowEditForm(false);
      setEditingMealPlan(null);
      setFormData({
        name: '',
        start_date: '',
        end_date: '',
        meals: [],
      });
    } catch (err) {
      console.error('Failed to update meal plan:', err);
    }
  };

  const handleDeleteMealPlan = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this meal plan?')) {
      try {
        await deleteMealPlan(id);
      } catch (err) {
        console.error('Failed to delete meal plan:', err);
      }
    }
  };

  const openEditForm = (mealPlan: MealPlan) => {
    setEditingMealPlan(mealPlan);
    setFormData({
      name: mealPlan.name,
      start_date: mealPlan.start_date,
      end_date: mealPlan.end_date,
      meals: mealPlan.items?.map(item => ({
        meal_type: item.meal_type,
        day_of_week: item.day_of_week,
        date: item.date,
        recipe_id: item.recipe_id,
      })) || [],
    });
    setShowEditForm(true);
  };

  const viewMealPlan = async (id: number) => {
    try {
      await getMealPlanById(id);
      await getMealPlanItems(id);
    } catch (err) {
      console.error('Failed to fetch meal plan:', err);
    }
  };

  const calculateNutritionTotals = (meals: MealPlanItem[]) => {
    return meals.reduce((totals, meal) => {
      if (meal.recipe?.nutrition) {
        totals.calories += meal.recipe.nutrition.calories || 0;
        totals.protein += meal.recipe.nutrition.protein || 0;
        totals.carbohydrates += meal.recipe.nutrition.carbohydrates || 0;
        totals.fat += meal.recipe.nutrition.fat || 0;
      }
      return totals;
    }, { calories: 0, protein: 0, carbohydrates: 0, fat: 0 });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Meal Plan Manager</h1>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Create Meal Plan
          </button>
          
          <button
            onClick={getUserMealPlans}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Refresh Plans
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button
              onClick={clearError}
              className="ml-2 text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Meal Plans List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mealPlans.map((mealPlan) => (
          <div key={mealPlan.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {mealPlan.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => viewMealPlan(mealPlan.id)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openEditForm(mealPlan)}
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMealPlan(mealPlan.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                <p>📅 {new Date(mealPlan.start_date).toLocaleDateString()} - {new Date(mealPlan.end_date).toLocaleDateString()}</p>
                {mealPlan.total_calories && (
                  <p>🔥 Total Calories: {mealPlan.total_calories}</p>
                )}
              </div>
              
              {mealPlan.items && mealPlan.items.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Meals:</h4>
                  {mealPlan.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      <span className="font-medium">{getDayName(item.day_of_week)}</span> - {getMealTypeName(item.meal_type)}: {getRecipeName(item.recipe_id)}
                    </div>
                  ))}
                  {mealPlan.items.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{mealPlan.items.length - 3} more meals
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Meal Plan Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Create New Meal Plan</h2>
              <form onSubmit={handleCreateMealPlan}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Weekly Healthy Plan"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Add Meals</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meal Type
                        </label>
                        <select
                          value={newMeal.meal_type}
                          onChange={(e) => handleNewMealChange('meal_type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {mealTypes.map(type => (
                            <option key={type} value={type}>{getMealTypeName(type)}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Day of Week
                        </label>
                        <select
                          value={newMeal.day_of_week}
                          onChange={(e) => handleNewMealChange('day_of_week', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {daysOfWeek.map(day => (
                            <option key={day} value={day}>{getDayName(day)}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={newMeal.date}
                          onChange={(e) => handleNewMealChange('date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Recipe
                        </label>
                        <select
                          value={newMeal.recipe_id}
                          onChange={(e) => handleNewMealChange('recipe_id', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={0}>Select Recipe</option>
                          {recipes.map(recipe => (
                            <option key={recipe.id} value={recipe.id}>{recipe.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={addMealToPlan}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      + Add Meal to Plan
                    </button>
                  </div>

                  {formData.meals.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Current Meals in Plan:</h4>
                      <div className="space-y-2">
                        {formData.meals.map((meal, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded">
                            <div className="flex items-center gap-4 text-sm">
                              <span className="font-medium">{getDayName(meal.day_of_week)}</span>
                              <span className="text-gray-600">{getMealTypeName(meal.meal_type)}</span>
                              <span className="text-gray-600">{new Date(meal.date).toLocaleDateString()}</span>
                              <span className="font-medium">{getRecipeName(meal.recipe_id)}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeMealFromPlan(index)}
                              className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Create Meal Plan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Meal Plan Modal */}
      {showEditForm && editingMealPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Edit Meal Plan: {editingMealPlan.name}</h2>
              <form onSubmit={handleUpdateMealPlan}>
                {/* Same form fields as create, but with update handler */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Weekly Healthy Plan"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Meals</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meal Type
                        </label>
                        <select
                          value={newMeal.meal_type}
                          onChange={(e) => handleNewMealChange('meal_type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {mealTypes.map(type => (
                            <option key={type} value={type}>{getMealTypeName(type)}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Day of Week
                        </label>
                        <select
                          value={newMeal.day_of_week}
                          onChange={(e) => handleNewMealChange('day_of_week', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {daysOfWeek.map(day => (
                            <option key={day} value={day}>{getDayName(day)}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={newMeal.date}
                          onChange={(e) => handleNewMealChange('date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Recipe
                        </label>
                        <select
                          value={newMeal.recipe_id}
                          onChange={(e) => handleNewMealChange('recipe_id', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={0}>Select Recipe</option>
                          {recipes.map(recipe => (
                            <option key={recipe.id} value={recipe.id}>{recipe.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={addMealToPlan}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      + Add Meal to Plan
                    </button>
                  </div>

                  {formData.meals.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Current Meals in Plan:</h4>
                      <div className="space-y-2">
                        {formData.meals.map((meal, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded">
                            <div className="flex items-center gap-4 text-sm">
                              <span className="font-medium">{getDayName(meal.day_of_week)}</span>
                              <span className="text-gray-600">{getMealTypeName(meal.meal_type)}</span>
                              <span className="text-gray-600">{new Date(meal.date).toLocaleDateString()}</span>
                              <span className="font-medium">{getRecipeName(meal.recipe_id)}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeMealFromPlan(index)}
                              className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    Update Meal Plan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Meal Plan Detail View */}
      {currentMealPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{currentMealPlan.name}</h2>
                  <p className="text-gray-600 mt-2">
                    {new Date(currentMealPlan.start_date).toLocaleDateString()} - {new Date(currentMealPlan.end_date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentMealPlan(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {currentMealPlan.items && currentMealPlan.items.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Meal Schedule</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {daysOfWeek.map(day => {
                      const dayMeals = currentMealPlan.items?.filter(item => item.day_of_week === day) || [];
                      if (dayMeals.length === 0) return null;
                      
                      return (
                        <div key={day} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-lg mb-3 text-blue-600">{getDayName(day)}</h4>
                          <div className="space-y-3">
                            {dayMeals.map((meal, index) => (
                              <div key={index} className="bg-white p-3 rounded border">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-gray-900">{getMealTypeName(meal.meal_type)}</span>
                                  <span className="text-sm text-gray-500">{new Date(meal.date).toLocaleDateString()}</span>
                                </div>
                                <div className="text-gray-700">{getRecipeName(meal.recipe_id)}</div>
                                {meal.recipe?.nutrition && (
                                  <div className="text-xs text-gray-500 mt-2">
                                    {meal.recipe.nutrition.calories} cal | {meal.recipe.nutrition.protein}g protein | {meal.recipe.nutrition.carbohydrates}g carbs
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Nutrition Summary */}
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-3">Nutrition Summary</h4>
                    {(() => {
                      const totals = calculateNutritionTotals(currentMealPlan.items || []);
                      return (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Total Calories:</span>
                            <span className="ml-2 font-medium">{totals.calories}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Total Protein:</span>
                            <span className="ml-2 font-medium">{totals.protein}g</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Total Carbs:</span>
                            <span className="ml-2 font-medium">{totals.carbohydrates}g</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Total Fat:</span>
                            <span className="ml-2 font-medium">{totals.fat}g</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanManager;
