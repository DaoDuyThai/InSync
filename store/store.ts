// store.ts
import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './projectSlice';

export const store = configureStore({
  reducer: {
    project: projectReducer, // You will create this slice next
  },
});

// Type for the entire Redux state
export type RootState = ReturnType<typeof store.getState>;

// Type for the dispatch function (for usage in your components)
export type AppDispatch = typeof store.dispatch;
