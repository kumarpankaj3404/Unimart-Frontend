import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import orderReducer from './orderSlice'; // Import the new slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    order: orderReducer, // Add it to the store
  },
});