import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transactions: [],
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
    clearTransactions: (state) => {
      state.transactions = [];
    },
  },
});

export const { addTransaction, clearTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
