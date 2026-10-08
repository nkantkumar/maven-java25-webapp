import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  taskCount: 5000,
  delayMs: 50,
  running: false,
  result: null,
  error: null,
  history: [],
};

export const benchmarkSlice = createSlice({
  name: 'benchmark',
  initialState,
  reducers: {
    setTaskCount: (state, action) => {
      state.taskCount = action.payload;
    },
    setDelayMs: (state, action) => {
      state.delayMs = action.payload;
    },
    startBenchmark: (state) => {
      state.running = true;
      state.error = null;
    },
    setBenchmarkResult: (state, action) => {
      state.running = false;
      state.result = action.payload;
      state.error = null;
      state.history.unshift({
        id: Date.now(),
        taskCount: action.payload.taskCount,
        duration: action.payload.totalDurationMs,
        throughput: action.payload.throughputTasksPerSec,
        timestamp: new Date().toLocaleTimeString(),
      });
      if (state.history.length > 5) state.history.pop();
    },
    setBenchmarkError: (state, action) => {
      state.running = false;
      state.error = action.payload;
    },
  },
});

export const {
  setTaskCount,
  setDelayMs,
  startBenchmark,
  setBenchmarkResult,
  setBenchmarkError,
} = benchmarkSlice.actions;

export default benchmarkSlice.reducer;
