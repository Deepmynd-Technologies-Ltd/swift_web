import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";

export const fetchTransactions = (symbol, address) => async (dispatch) => {
  try {
    dispatch(fetchTransactionsStart());
    
    const response = await axios.get(
      `https://swift-api-g7a3.onrender.com/api/wallet/get_transaction/`,
      {
        params: { symbol, address }
      }
    );

    if (response.data.success) {
      // Transform API data to match your UI needs
      const formattedTransactions = response.data.data.map(tx => ({
        hash: tx.hash,
        type: tx.transaction_type === 'sent' ? 'Sent' : 'Received',
        typeImage: tx.transaction_type === 'sent' ? 
          require("./assets/img/send_icon.png") : 
          require("./assets/img/receive_icon.png"),
        amount: tx.amount,
        date: new Date(tx.timestamp).toLocaleDateString(),
        description: `${tx.transaction_type === 'sent' ? 'Sent' : 'Received'} ${symbol.toUpperCase()}`
      }));
      
      dispatch(fetchTransactionsSuccess(formattedTransactions));
    } else {
      throw new Error(response.data.message || 'Failed to fetch transactions');
    }
  } catch (error) {
    dispatch(fetchTransactionsFailure(error.message));
  }
};



const initialState = {
  transactions: [],
  loading: false,
  error: null
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    fetchTransactionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTransactionsSuccess: (state, action) => {
      state.transactions = action.payload;
      state.loading = false;
    },
    fetchTransactionsFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearTransactions: (state) => {
      state.transactions = [];
    },
  },
});

export const { 
  fetchTransactionsStart, 
  fetchTransactionsSuccess, 
  fetchTransactionsFailure,
  clearTransactions 
} = transactionSlice.actions;

export default transactionSlice.reducer;