import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  streamEvents: [],
  rxJsActive: true,
  emissionCount: 0,
};

export const reactiveSlice = createSlice({
  name: 'reactive',
  initialState,
  reducers: {
    addStreamEvent: (state, action) => {
      const { type, detail } = action.payload;
      state.emissionCount += 1;
      state.streamEvents.unshift({
        id: state.emissionCount,
        timestamp: new Date().toLocaleTimeString(),
        type,
        detail,
      });
      if (state.streamEvents.length > 25) {
        state.streamEvents.pop();
      }
    },
    toggleRxJsActive: (state) => {
      state.rxJsActive = !state.rxJsActive;
    },
    clearStreamEvents: (state) => {
      state.streamEvents = [];
    },
  },
});

export const { addStreamEvent, toggleRxJsActive, clearStreamEvents } = reactiveSlice.actions;
export default reactiveSlice.reducer;
