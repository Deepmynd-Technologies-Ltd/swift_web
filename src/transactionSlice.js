import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";

// Helper function to get icon based on transaction type and symbol
const getTransactionIcon = (type, symbol) => {
  const typeIcons = {
    sent: require("./assets/img/send_icon.png"),
    received: require("./assets/img/receive_icon.png"),
    swap: require("./assets/img/swap_icon.png"),
    buy: require("./assets/img/business_icon.png"),
    sell: require("./assets/img/dollar_icon.png")
  };
  
  const symbolIcons = {
    usdt: require("./assets/img/usdt_icon.png"),
    bnb: require("./assets/img/bnb_icon.png"),
    eth: require("./assets/img/eth_icon.png"),
    doge: require("./assets/img/doge_icon.png"),
    sol: require("./assets/img/sol_icon.png"),
    btc: require("./assets/img/btc_icon.png"),
  };

  return typeIcons[type.toLowerCase()] || symbolIcons[symbol.toLowerCase()] || typeIcons.sent;
};

// Async action to fetch transactions for a specific symbol
export const fetchTransactions = (symbol, address) => async (dispatch) => {
  try {
    dispatch(fetchTransactionsStart());
    
    const response = await axios.get(
      `https://swift-api-g7a3.onrender.com/api/wallet/get_transaction/`,
      { params: { symbol: symbol.toLowerCase(), address } }
    );

    if (response.data.success) {
      const formattedTransactions = response.data.data.map(tx => ({
        id: tx.hash || `${symbol}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        hash: tx.hash,
        type: tx.transaction_type || 'sent', // Default to sent if not specified
        typeImage: getTransactionIcon(tx.transaction_type, symbol),
        symbol: symbol.toUpperCase(),
        amount: tx.amount,
        value: tx.value || 0, // Add value if available
        timestamp: tx.timestamp,
        date: new Date(tx.timestamp).toLocaleDateString(),
        description: tx.description || 
          `${tx.transaction_type === 'sent' ? 'Sent' : 
            tx.transaction_type === 'received' ? 'Received' : 
            tx.transaction_type === 'swap' ? 'Swap' :
            tx.transaction_type === 'buy' ? 'Buy' :
            tx.transaction_type === 'sell' ? 'Sell' : 
            'Transaction'} ${symbol.toUpperCase()}`,
        status: tx.status || 'completed',
        fromAddress: tx.from_address,
        toAddress: tx.to_address
      }));
      
      // Sort transactions by timestamp (newest first)
      formattedTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      dispatch(fetchTransactionsSuccess(formattedTransactions));
    } else {
      throw new Error(response.data.message || 'Failed to fetch transactions');
    }
  } catch (error) {
    dispatch(fetchTransactionsFailure(error.message));
  }
};

// Async action to add a new transaction (for buy/sell/swap that happen in-app)
export const addNewTransaction = (transactionData) => (dispatch) => {
  const newTransaction = {
    id: `${transactionData.symbol}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    hash: transactionData.hash || null,
    type: transactionData.type || 'sent',
    typeImage: getTransactionIcon(transactionData.type, transactionData.symbol),
    symbol: transactionData.symbol?.toUpperCase() || 'ETH',
    amount: transactionData.amount,
    value: transactionData.value || 0,
    timestamp: transactionData.timestamp || new Date().toISOString(),
    date: new Date(transactionData.timestamp || Date.now()).toLocaleDateString(),
    description: transactionData.description || 
      `${transactionData.type === 'sent' ? 'Sent' : 
        transactionData.type === 'received' ? 'Received' : 
        transactionData.type === 'swap' ? 'Swap' :
        transactionData.type === 'buy' ? 'Buy' :
        transactionData.type === 'sell' ? 'Sell' : 
        'Transaction'} ${(transactionData.symbol || 'ETH').toUpperCase()}`,
    status: transactionData.status || 'completed',
    fromAddress: transactionData.fromAddress,
    toAddress: transactionData.toAddress
  };

  dispatch(addTransaction(newTransaction));
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
      // Merge new transactions with existing ones, avoiding duplicates
      const existingIds = new Set(state.transactions.map(tx => tx.id));
      const newTransactions = action.payload.filter(tx => !existingIds.has(tx.id));
      state.transactions = [...newTransactions, ...state.transactions];
      state.loading = false;
    },
    fetchTransactionsFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload); // Add to beginning of array
    },
    clearTransactions: (state) => {
      state.transactions = [];
    },
    updateTransactionStatus: (state, action) => {
      const { hash, status } = action.payload;
      const transaction = state.transactions.find(tx => tx.hash === hash);
      if (transaction) {
        transaction.status = status;
      }
    }
  },
});

export const { 
  fetchTransactionsStart, 
  fetchTransactionsSuccess, 
  fetchTransactionsFailure,
  addTransaction,
  clearTransactions,
  updateTransactionStatus
} = transactionSlice.actions;

export default transactionSlice.reducer;