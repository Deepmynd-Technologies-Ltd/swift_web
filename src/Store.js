// src/store.js
import { configureStore } from '@reduxjs/toolkit';

// Import your reducers here
import walletReducer from './features/wallet/walletSlice';

const store = configureStore({
  reducer: {
    wallet: walletReducer, // Add more reducers as needed
  },
});

export default store;

