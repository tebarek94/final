import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserSuggestedMeal } from '../../types';
import { mealSuggestionsAPI } from '../../services/api';

interface CreateSuggestionData {
  user_id: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe_id?: number;
  custom_meal?: any;
  reason?: string;
}

interface MealSuggestionsState {
  userSuggestions: UserSuggestedMeal[];
  receivedSuggestions: UserSuggestedMeal[];
  loading: boolean;
  error: string | null;
}

const initialState: MealSuggestionsState = {
  userSuggestions: [],
  receivedSuggestions: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchUserSuggestions = createAsyncThunk(
  'mealSuggestions/fetchUserSuggestions',
  async () => {
    const response = await mealSuggestionsAPI.getUserSuggestions();
    return response.data;
  }
);

export const fetchReceivedSuggestions = createAsyncThunk(
  'mealSuggestions/fetchReceivedSuggestions',
  async () => {
    const response = await mealSuggestionsAPI.getReceivedSuggestions();
    return response.data;
  }
);

export const createSuggestion = createAsyncThunk(
  'mealSuggestions/createSuggestion',
  async (data: CreateSuggestionData) => {
    const response = await mealSuggestionsAPI.create(data);
    return response.data;
  }
);

export const acceptSuggestion = createAsyncThunk(
  'mealSuggestions/acceptSuggestion',
  async (id: number) => {
    await mealSuggestionsAPI.accept(id);
    return id;
  }
);

export const rejectSuggestion = createAsyncThunk(
  'mealSuggestions/rejectSuggestion',
  async (id: number) => {
    await mealSuggestionsAPI.reject(id);
    return id;
  }
);

export const deleteSuggestion = createAsyncThunk(
  'mealSuggestions/deleteSuggestion',
  async (id: number) => {
    await mealSuggestionsAPI.delete(id);
    return id;
  }
);

const mealSuggestionsSlice = createSlice({
  name: 'mealSuggestions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuggestions: (state) => {
      state.userSuggestions = [];
      state.receivedSuggestions = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch user suggestions
    builder
      .addCase(fetchUserSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.userSuggestions = action.payload;
      })
      .addCase(fetchUserSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user suggestions';
      });

    // Fetch received suggestions
    builder
      .addCase(fetchReceivedSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceivedSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.receivedSuggestions = action.payload;
      })
      .addCase(fetchReceivedSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch received suggestions';
      });

    // Create suggestion
    builder
      .addCase(createSuggestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSuggestion.fulfilled, (state, action) => {
        state.loading = false;
        state.userSuggestions.unshift(action.payload);
      })
      .addCase(createSuggestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create suggestion';
      });

    // Accept suggestion
    builder
      .addCase(acceptSuggestion.fulfilled, (state, action) => {
        const suggestion = state.receivedSuggestions.find(s => s.id === action.payload);
        if (suggestion) {
          suggestion.is_accepted = true;
        }
      });

    // Reject suggestion
    builder
      .addCase(rejectSuggestion.fulfilled, (state, action) => {
        state.receivedSuggestions = state.receivedSuggestions.filter(s => s.id !== action.payload);
      });

    // Delete suggestion
    builder
      .addCase(deleteSuggestion.fulfilled, (state, action) => {
        state.userSuggestions = state.userSuggestions.filter(s => s.id !== action.payload);
      });
  },
});

export const { clearError, clearSuggestions } = mealSuggestionsSlice.actions;
export default mealSuggestionsSlice.reducer;
