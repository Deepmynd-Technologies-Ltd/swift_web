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

export const fetchAllWalletData = createAsyncThunk(
  'wallet/fetchAllWalletData',
  async (_, { getState, rejectWithValue }) => {
    const { wallet } = getState();

    // Skip API call if data is already fetched
    if (wallet.isFetched) {
      return wallet.wallets;
    }

    try {
      // Fetch market data
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
        if (!address) return 0;
        try {
          const balanceResponse = await fetch(
            `https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=${symbol}&address=${address}`
          );
          const balanceData = await balanceResponse.json();
          return balanceData.success ? balanceData.data : 0;
        } catch (error) {
          console.error(`Error fetching balance for ${symbol}:`, error);
          return 0;
        }
      };

      // Define wallet configurations
      const walletConfigs = [
        {
          symbol: 'bnb',
          abbr: "BNB",
          title: "BNB BEP20",
          marketData: data.binancecoin,
          typeImage: require("../../assets/img/bnb_icon_.png"),
        },
        {
          symbol: 'btc',
          abbr: "BTC",
          title: "Bitcoin",
          marketData: data.bitcoin,
          typeImage: require("../../assets/img/bitcoin_icon.png"),
        },
        {
          symbol: 'doge',
          abbr: "DOGE",
          title: "Doge coin",
          marketData: data.dogecoin,
          typeImage: require("../../assets/img/xrp_icon_.png"),
        },
        {
          symbol: 'eth',
          abbr: "ETH",
          title: "Ethereum",
          marketData: data.ethereum,
          typeImage: require("../../assets/img/ethereum_icon.png"),
        },
        {
          symbol: 'sol',
          abbr: "SOL",
          title: "Solana",
          marketData: data.solana,
          typeImage: require("../../assets/img/solana_icon.png"),
        },
        {
          symbol: 'usdt',
          abbr: "USDT",
          title: "USDT BEP20",
          marketData: data.tether,
          typeImage: require("../../assets/img/usdt_icon_.png"),
        },
      ];

      // Fetch all balances in parallel and construct wallet data
      const walletPromises = walletConfigs.map(async (config) => {
        const walletAddress = walletAddresses.find(w => w.symbols === config.symbol);
        const balance = await fetchBalance(config.symbol, walletAddress?.address);
        
        return {
          abbr: config.abbr,
          title: config.title,
          symbol: config.symbol,
          address: walletAddress?.address || '',
          marketPrice: config.marketData.usd,
          marketPricePercentage: config.marketData.usd_24h_change,
          equivalenceValue: balance,
          equivalenceValueAmount: (config.marketData.usd * balance),
          typeImage: config.typeImage,
          rawMarketPrice: config.marketData.usd
        };
      });

      const formattedData = await Promise.all(walletPromises);
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
    wallets: [],
    loading: false,
    error: null,
    selectedWallet: null,
    isFetched: false,
  },
  reducers: {
    setSelectedWallet: (state, action) => {
      const wallet = state.wallets.find(w => w.abbr === action.payload?.abbr);
      if (wallet) {
        state.selectedWallet = wallet;
      } else {
        state.selectedWallet = null;
      }
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
    updateWallets: (state, action) => {
      const currentSelectedAbbr = state.selectedWallet?.abbr;
      state.wallets = action.payload;
      
      // Restore selected wallet if it exists in the new data
      if (currentSelectedAbbr) {
        const updatedWallet = action.payload.find(w => w.abbr === currentSelectedAbbr);
        if (updatedWallet) {
          state.selectedWallet = updatedWallet;
        } else {
          state.selectedWallet = null;
        }
      }
    },
    updateWalletBalance: (state, action) => {
      const { symbol, balance } = action.payload;
      const wallet = state.wallets.find(w => w.symbol === symbol);
      if (wallet) {
        wallet.equivalenceValue = balance;
        wallet.equivalenceValueAmount = (wallet.rawMarketPrice * balance);
        if (state.selectedWallet?.symbol === symbol) {
          state.selectedWallet = { ...wallet };
        }
      }
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
      .addCase(fetchAllWalletData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllWalletData.fulfilled, (state, action) => {
        const currentSelectedAbbr = state.selectedWallet?.abbr;
        state.wallets = action.payload;
        state.loading = false;
        state.isFetched = true;
        
        // Only set default selected wallet if none is selected and we're on desktop
        if (!currentSelectedAbbr && window.innerWidth > 768 && action.payload.length > 0) {
          state.selectedWallet = action.payload[0];
        }
        // Otherwise, keep the current selection if it exists in the new data
        else if (currentSelectedAbbr) {
          const updatedWallet = action.payload.find(w => w.abbr === currentSelectedAbbr);
          if (updatedWallet) {
            state.selectedWallet = updatedWallet;
          } else {
            state.selectedWallet = null;
          }
        }
      })
      .addCase(fetchAllWalletData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setAddress, 
  setPrivateKey, 
  setSelectedWallet, 
  setError, 
  updateWallets, 
  updateWalletBalance 
} = walletSlice.actions;

export default walletSlice.reducer;