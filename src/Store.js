// src/store.js
import { configureStore } from '@reduxjs/toolkit';

// Import your reducers here
import walletReducer from './features/wallet/walletSlice';
import transactionReducer from "./transactionSlice";

const store = configureStore({
  reducer: {
    wallet: walletReducer, // Add more reducers as needed
    transactions: transactionReducer,
  },
});

export default store;

