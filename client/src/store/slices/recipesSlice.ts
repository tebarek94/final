import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { recipesAPI } from '../../services/api';
import { Recipe, CreateRecipeData, NutritionData, RecipeState } from '../../types';

// Async thunks
export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await recipesAPI.getAll(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recipes');
    }
  }
);

export const searchRecipes = createAsyncThunk(
  'recipes/searchRecipes',
  async ({ query, limit }: { query: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await recipesAPI.search(query, limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search recipes');
    }
  }
);

export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchRecipeById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await recipesAPI.getById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recipe');
    }
  }
);

export const createRecipe = createAsyncThunk(
  'recipes/createRecipe',
  async (recipeData: CreateRecipeData, { rejectWithValue }) => {
    try {
      const response = await recipesAPI.create(recipeData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create recipe');
    }
  }
);

export const updateRecipe = createAsyncThunk(
  'recipes/updateRecipe',
  async ({ id, data }: { id: number; data: Partial<CreateRecipeData> }, { rejectWithValue  }) => {
    try {
      const response = await recipesAPI.update(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update recipe');
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  'recipes/deleteRecipe',
  async (id: number, { rejectWithValue }) => {
    try {
      await recipesAPI.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete recipe');
    }
  }
);

export const fetchUserRecipes = createAsyncThunk(
  'recipes/fetchUserRecipes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await recipesAPI.getUserRecipes();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user recipes');
    }
  }
);

export const addRecipeNutrition = createAsyncThunk(
  'recipes/addRecipeNutrition',
  async ({ id, nutritionData }: { id: number; nutritionData: NutritionData }, { rejectWithValue }) => {
    try {
      const response = await recipesAPI.addNutrition(id, nutritionData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add nutrition data');
    }
  }
);

const initialState: RecipeState = {
  recipes: [],
  userRecipes: [],
  currentRecipe: null,
  loading: false,
  error: null,
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRecipe: (state, action: PayloadAction<Recipe>) => {
      state.currentRecipe = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Recipes
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload.recipes || action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Search Recipes
      .addCase(searchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload.recipes || action.payload;
      })
      .addCase(searchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Recipe by ID
      .addCase(fetchRecipeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload.recipe || action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Recipe
      .addCase(createRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.loading = false;
        const newRecipe = action.payload.recipe || action.payload;
        state.recipes.unshift(newRecipe);
        state.userRecipes.unshift(newRecipe);
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Recipe
      .addCase(updateRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRecipe = action.payload.recipe || action.payload;
        state.recipes = state.recipes.map(recipe => 
          recipe.id === updatedRecipe.id ? updatedRecipe : recipe
        );
        state.userRecipes = state.userRecipes.map(recipe => 
          recipe.id === updatedRecipe.id ? updatedRecipe : recipe
        );
        if (state.currentRecipe?.id === updatedRecipe.id) {
          state.currentRecipe = updatedRecipe;
        }
      })
      .addCase(updateRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Recipe
      .addCase(deleteRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.recipes = state.recipes.filter(recipe => recipe.id !== deletedId);
        state.userRecipes = state.userRecipes.filter(recipe => recipe.id !== deletedId);
        if (state.currentRecipe?.id === deletedId) {
          state.currentRecipe = null;
        }
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Recipes
      .addCase(fetchUserRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.userRecipes = action.payload.recipes || action.payload;
      })
      .addCase(fetchUserRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Recipe Nutrition
      .addCase(addRecipeNutrition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRecipeNutrition.fulfilled, (state, action) => {
        state.loading = false;
        const nutritionData = action.payload.nutrition || action.payload;
        if (state.currentRecipe) {
          state.currentRecipe.nutrition = nutritionData;
        }
      })
      .addCase(addRecipeNutrition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentRecipe, clearError, setCurrentRecipe } = recipesSlice.actions;
export default recipesSlice.reducer;
