import { configureStore } from '@reduxjs/toolkit';
import jvmReducer from './jvmSlice';
import featuresReducer from './featuresSlice';
import benchmarkReducer from './benchmarkSlice';
import reactiveReducer from './reactiveSlice';

export const store = configureStore({
  reducer: {
    jvm: jvmReducer,
    features: featuresReducer,
    benchmark: benchmarkReducer,
    reactive: reactiveReducer,
  },
});

export default store;
