import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AIAnalysis, AIState } from '../../types';

const initialState: AIState = {
  analyses: [],
  loading: false,
  error: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setAnalyses: (state, action: PayloadAction<AIAnalysis[]>) => {
      state.analyses = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAnalyses, setLoading, setError } = aiSlice.actions;
export default aiSlice.reducer;
