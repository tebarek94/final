import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchRecipes } from '../../store/slices/recipesSlice';
import { Recipe } from '../../types';

const Recipes: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { recipes, loading } = useSelector((state: RootState) => state.recipes as any);

  useEffect(() => {
    dispatch(fetchRecipes({} as any));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Recipes</h1>
        <button
          onClick={() => navigate('/recipes/create')}
          className="btn-primary"
        >
          Create Recipe
        </button>
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe: Recipe) => (
            <div
              key={recipe.id}
              onClick={() => navigate(`/recipes/${recipe.id}`)}
              className="card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{recipe.title}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                  {recipe.difficulty}
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">{recipe.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>⏱️ {recipe.cooking_time} min</span>
                <span>👥 {recipe.servings} servings</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🍽️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-600 mb-4">Start by creating your first recipe!</p>
          <button
            onClick={() => navigate('/recipes/create')}
            className="btn-primary"
          >
            Create Recipe
          </button>
        </div>
      )}
    </div>
  );
};

export default Recipes;
