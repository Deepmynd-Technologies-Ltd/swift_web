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

export const fetchWalletData = createAsyncThunk(
  'wallet/fetchWalletData',
  async (_, { getState, rejectWithValue }) => {
    const { wallet } = getState();

    // Skip API call if data is already fetched
    if (wallet.isFetched) {
      return wallet.transactions;
    }

    try {
      const response = await fetch("https://swift-api-g7a3.onrender.com/api/wallet/");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Get wallet addresses from localStorage
      const walletDetails = JSON.parse(localStorage.getItem('walletDetails'));
      const walletAddresses = walletDetails?.walletAddresses || [];

      // Helper function to fetch balance
      const fetchBalance = async (symbol, address) => {
        if (!address) {
          throw new Error(`Address not found for symbol: ${symbol}`);
        }
        const balanceResponse = await fetch(
          `https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=${symbol}&address=${address}`
        );
        const balanceData = await balanceResponse.json();
        return balanceData.data;
      };

      // Process all wallet data in parallel
      const formattedData = await Promise.all([
        {
          abbr: "BNB",
          title: "BNB BEP20",
          marketPrice: `$ ${data.binancecoin.usd.toFixed(2)}`,
          marketPricePercentage: `${data.binancecoin.usd_24h_change.toFixed(2)}%`,
          equivalenceValue: walletAddresses.find(wallet => wallet.symbols === 'bnb') ? await fetchBalance('bnb', walletAddresses.find(wallet => wallet.symbols === 'bnb').address) : 0,
          equivalenceValueAmount: walletAddresses.find(wallet => wallet.symbols === 'bnb') ? `$ ${(data.binancecoin.usd * await fetchBalance('bnb', walletAddresses.find(wallet => wallet.symbols === 'bnb').address)).toFixed(2)}` : '$0.00',
          typeImage: require("../../assets/img/bnb_icon_.png"),
        },
        {
          abbr: "BTC",
          title: "Bitcoin",
          marketPrice: `$ ${data.bitcoin.usd.toFixed(2)}`,
          marketPricePercentage: `${data.bitcoin.usd_24h_change.toFixed(2)}%`,
          equivalenceValue: walletAddresses.find(wallet => wallet.symbols === 'btc') ? await fetchBalance('btc', walletAddresses.find(wallet => wallet.symbols === 'btc').address) : 0,
          equivalenceValueAmount: walletAddresses.find(wallet => wallet.symbols === 'btc') ? `$ ${(data.bitcoin.usd * await fetchBalance('btc', walletAddresses.find(wallet => wallet.symbols === 'btc').address)).toFixed(2)}` : '$0.00',
          typeImage: require("../../assets/img/bitcoin_icon.png"),
        },
        {
          abbr: "DOGE",
          title: "Doge coin",
          marketPrice: `$ ${data.dogecoin.usd.toFixed(4)}`,
          marketPricePercentage: `${data.dogecoin.usd_24h_change.toFixed(2)}%`,
          equivalenceValue: walletAddresses.find(wallet => wallet.symbols === 'doge') ? await fetchBalance('doge', walletAddresses.find(wallet => wallet.symbols === 'doge').address) : 0,
          equivalenceValueAmount: walletAddresses.find(wallet => wallet.symbols === 'doge') ? `$ ${(data.dogecoin.usd * await fetchBalance('doge', walletAddresses.find(wallet => wallet.symbols === 'doge').address)).toFixed(2)}` : '$0.00',
          typeImage: require("../../assets/img/xrp_icon_.png"),
        },
        {
          abbr: "ETH",
          title: "Ethereum",
          marketPrice: `$ ${data.ethereum.usd.toFixed(2)}`,
          marketPricePercentage: `${data.ethereum.usd_24h_change.toFixed(2)}%`,
          equivalenceValue: walletAddresses.find(wallet => wallet.symbols === 'eth') ? await fetchBalance('eth', walletAddresses.find(wallet => wallet.symbols === 'eth').address) : 0,
          equivalenceValueAmount: walletAddresses.find(wallet => wallet.symbols === 'eth') ? `$ ${(data.ethereum.usd * await fetchBalance('eth', walletAddresses.find(wallet => wallet.symbols === 'eth').address)).toFixed(2)}` : '$0.00',
          typeImage: require("../../assets/img/ethereum_icon.png"),
        },
        {
          abbr: "SOL",
          title: "Solana",
          marketPrice: `$ ${data.solana.usd.toFixed(2)}`,
          marketPricePercentage: `${data.solana.usd_24h_change.toFixed(2)}%`,
          equivalenceValue: walletAddresses.find(wallet => wallet.symbols === 'sol') ? await fetchBalance('sol', walletAddresses.find(wallet => wallet.symbols === 'sol').address) : 0,
          equivalenceValueAmount: walletAddresses.find(wallet => wallet.symbols === 'sol') ? `$ ${(data.solana.usd * await fetchBalance('sol', walletAddresses.find(wallet => wallet.symbols === 'sol').address)).toFixed(2)}` : '$0.00',
          typeImage: require("../../assets/img/solana_icon.png"),
        },
        {
          abbr: "USDT",
          title: "USDT BEP20",
          marketPrice: `$ ${data.tether.usd.toFixed(2)}`,
          marketPricePercentage: `${data.tether.usd_24h_change.toFixed(2)}%`,
          equivalenceValue: walletAddresses.find(wallet => wallet.symbols === 'usdt') ? await fetchBalance('usdt', walletAddresses.find(wallet => wallet.symbols === 'usdt').address) : 0,
          equivalenceValueAmount: walletAddresses.find(wallet => wallet.symbols === 'usdt') ? `$ ${(data.tether.usd * await fetchBalance('usdt', walletAddresses.find(wallet => wallet.symbols === 'usdt').address)).toFixed(2)}` : '$0.00',
          typeImage: require("../../assets/img/usdt_icon_.png"),
        },
      ]);

      return formattedData;
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
    transactions: [],
    loading: false,
    error: null,
    selectedWallet: null,
    isFetched: false, // Flag to track if data has been fetched
  },
  reducers: {
    setSelectedWallet: (state, action) => {
      state.selectedWallet = action.payload;
    },
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
        state.loading = true;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
        state.loading = false;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchWalletData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletData.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.loading = false;
        state.isFetched = true; // Mark data as fetched
        // Set default selected wallet on desktop
        if (window.innerWidth > 768 && action.payload.length > 0) {
          state.selectedWallet = action.payload[0];
        }
      })
      .addCase(fetchWalletData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAddress, setPrivateKey, setSelectedWallet, setError } = walletSlice.actions;
export default walletSlice.reducer;