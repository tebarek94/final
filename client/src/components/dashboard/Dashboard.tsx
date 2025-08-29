import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchRecipes } from '../../store/slices/recipesSlice';
import { Recipe } from '../../types';
import { useMealSuggestions } from '../../hooks/useMealSuggestions';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { recipes, loading } = useSelector((state: RootState) => state.recipes as any);
  const { receivedSuggestions, userSuggestions } = useMealSuggestions();

  useEffect(() => {
    dispatch(fetchRecipes({ limit: 5 }));
  }, [dispatch]);

  const quickActions = [
    {
      title: 'Create Recipe',
      description: 'Add a new recipe to your collection',
      icon: '🍳',
      action: () => navigate('/recipes/create'),
      color: 'bg-primary-500',
    },
    {
      title: 'Plan Meals',
      description: 'Create a new meal plan',
      icon: '📅',
      action: () => navigate('/meal-plans/create'),
      color: 'bg-success-500',
    },
    {
      title: 'Suggest Meal',
      description: 'Suggest a meal to another user',
      icon: '💡',
      action: () => navigate('/meal-suggestions'),
      color: 'bg-warning-500',
    },
    {
      title: 'Browse Recipes',
      description: 'Discover new recipes',
      icon: '🔍',
      action: () => navigate('/recipes'),
      color: 'bg-secondary-500',
    },
    {
      title: 'Update Profile',
      description: 'Manage your preferences',
      icon: '👤',
      action: () => navigate('/profile'),
      color: 'bg-purple-500',
    },
  ];

  const stats = [
    {
      name: 'Total Recipes',
      value: recipes.length,
      icon: '🍽️',
      color: 'text-primary-600',
    },
    {
      name: 'This Week',
      value: '0',
      icon: '📊',
      color: 'text-success-600',
    },
    {
      name: 'Calories Goal',
      value: '2000',
      icon: '🔥',
      color: 'text-warning-600',
    },
    {
      name: 'Protein Goal',
      value: '150g',
      icon: '💪',
      color: 'text-secondary-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.first_name}! 👋
        </h1>
        <p className="text-primary-100 text-lg">
          Ready to plan your next healthy meal? Let's get cooking!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card text-center">
            <div className={`text-3xl mb-2 ${stat.color}`}>{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.name}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={action.action}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-white text-xl mb-3 group-hover:scale-110 transition-transform duration-200`}>
                {action.icon}
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Recipes */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Recipes</h2>
          <button
            onClick={() => navigate('/recipes')}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View all →
          </button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.slice(0, 6).map((recipe: Recipe) => (
              <div
                key={recipe.id}
                onClick={() => navigate(`/recipes/${recipe.id}`)}
                className="card-hover p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 line-clamp-2">{recipe.title}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                    {recipe.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{recipe.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>⏱️ {recipe.cooking_time} min</span>
                  <span>👥 {recipe.servings} servings</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes yet</h3>
            <p className="text-gray-600 mb-4">Start building your recipe collection!</p>
            <button
              onClick={() => navigate('/recipes/create')}
              className="btn-primary"
            >
              Create Your First Recipe
            </button>
          </div>
        )}
      </div>

      {/* Meal Suggestions Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Received Suggestions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">💡 Meal Suggestions</h2>
            <button
              onClick={() => navigate('/meal-suggestions')}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all →
            </button>
          </div>
          
          {receivedSuggestions.length > 0 ? (
            <div className="space-y-3">
              {receivedSuggestions.slice(0, 3).map((suggestion) => (
                <div key={suggestion.id} className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {suggestion.meal_type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(suggestion.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {suggestion.recipe ? (
                    <p className="text-sm text-gray-600">{suggestion.recipe.title}</p>
                  ) : suggestion.custom_meal ? (
                    <p className="text-sm text-gray-600">{suggestion.custom_meal}</p>
                  ) : null}
                  {!suggestion.is_accepted && (
                    <div className="flex space-x-2 mt-2">
                      <button className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                        Accept
                      </button>
                      <button className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-2xl mb-2">💡</div>
              <p className="text-sm text-gray-600">No meal suggestions yet</p>
            </div>
          )}
        </div>

        {/* Sent Suggestions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">📤 Your Suggestions</h2>
            <button
              onClick={() => navigate('/meal-suggestions')}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all →
            </button>
          </div>
          
          {userSuggestions.length > 0 ? (
            <div className="space-y-3">
              {userSuggestions.slice(0, 3).map((suggestion) => (
                <div key={suggestion.id} className="p-3 bg-gray-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {suggestion.meal_type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(suggestion.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {suggestion.recipe ? (
                    <p className="text-sm text-gray-600">{suggestion.recipe.title}</p>
                  ) : suggestion.custom_meal ? (
                    <p className="text-sm text-gray-600">{suggestion.custom_meal}</p>
                  ) : null}
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      suggestion.is_accepted 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {suggestion.is_accepted ? 'Accepted' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-2xl mb-2">📤</div>
              <p className="text-sm text-gray-600">No suggestions sent yet</p>
              <button
                onClick={() => navigate('/meal-suggestions')}
                className="text-xs text-primary-600 hover:text-primary-700 mt-2"
              >
                Suggest a meal →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Health Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">💡 Health Tip</h2>
          <p className="text-gray-700 mb-4">
            Did you know? Eating a variety of colorful fruits and vegetables ensures you get a wide range of essential nutrients and antioxidants.
          </p>
          <div className="text-sm text-gray-500">
            Source: Nutrition Foundation
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 Today's Goal</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Calories</span>
              <span className="font-medium">1,200 / 2,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Protein</span>
              <span className="font-medium">45g / 150g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-success-600 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
