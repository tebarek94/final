import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Recipe, AdminState } from '../../types';

const initialState: AdminState = {
  users: [],
  pendingRecipes: [],
  systemAnalytics: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setPendingRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.pendingRecipes = action.payload;
    },
    setSystemAnalytics: (state, action: PayloadAction<any>) => {
      state.systemAnalytics = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setUsers, setPendingRecipes, setSystemAnalytics, setLoading, setError } = adminSlice.actions;
export default adminSlice.reducer;
