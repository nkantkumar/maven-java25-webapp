import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  loading: true,
  error: null,
  autoRefreshInterval: 5000, // ms (0 means paused)
  lastUpdated: null,
};

export const jvmSlice = createSlice({
  name: 'jvm',
  initialState,
  reducers: {
    setJvmLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setJvmData: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
      state.lastUpdated = new Date().toLocaleTimeString();
    },
    setJvmError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setAutoRefreshInterval: (state, action) => {
      state.autoRefreshInterval = action.payload;
    },
  },
});

export const { setJvmLoading, setJvmData, setJvmError, setAutoRefreshInterval } = jvmSlice.actions;
export default jvmSlice.reducer;
