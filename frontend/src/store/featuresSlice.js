import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  activeTab: 0,
  searchQuery: '',
  loading: true,
  error: null,
};

export const featuresSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {
    setFeaturesLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setFeaturesData: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setFeaturesError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setFeaturesLoading,
  setFeaturesData,
  setFeaturesError,
  setActiveTab,
  setSearchQuery,
} = featuresSlice.actions;

export default featuresSlice.reducer;
