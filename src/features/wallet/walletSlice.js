import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch wallet balance
export const fetchWalletBalance = createAsyncThunk(
  'wallet/fetchBalance',
  async (address, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=btc&address=${address}`);
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    balance: 0,
    address: '',
    privateKey: '',
    isLoading: false,
    error: null,
  },
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setPrivateKey: (state, action) => {
      state.privateKey = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { setAddress, setPrivateKey, setError } = walletSlice.actions;
export default walletSlice.reducer;
