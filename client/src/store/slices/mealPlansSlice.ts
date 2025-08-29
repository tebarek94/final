import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MealPlan, MealPlanState } from '../../types';

const initialState: MealPlanState = {
  mealPlans: [],
  currentMealPlan: null,
  loading: false,
  error: null,
};

const mealPlansSlice = createSlice({
  name: 'mealPlans',
  initialState,
  reducers: {
    setMealPlans: (state, action: PayloadAction<MealPlan[]>) => {
      state.mealPlans = action.payload;
    },
    setCurrentMealPlan: (state, action: PayloadAction<MealPlan>) => {
      state.currentMealPlan = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setMealPlans, setCurrentMealPlan, setLoading, setError } = mealPlansSlice.actions;
export default mealPlansSlice.reducer;
