import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import recipesReducer from './slices/recipesSlice';
import mealPlansReducer from './slices/mealPlansSlice';
import aiReducer from './slices/aiSlice';
import adminReducer from './slices/adminSlice';
import mealSuggestionsReducer from './slices/mealSuggestionsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipesReducer,
    mealPlans: mealPlansReducer,
    ai: aiReducer,
    admin: adminReducer,
    mealSuggestions: mealSuggestionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
