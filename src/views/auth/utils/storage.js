import localforage from 'localforage';
import CryptoJS from 'crypto-js'; // Add this instead of importing encryption functions

// Configure localForage
localforage.config({
  driver: [
    localforage.INDEXEDDB,
    localforage.LOCALSTORAGE,
    localforage.WEBSQL
  ],
  name: 'WalletApp',
  storeName: 'wallet_data',
  version: 1.0
});

// Built-in encryption functions
/**
 * Encrypt data using AES encryption
 * @param {string} data - Data to encrypt
 * @param {string} key - Encryption key (usually PIN)
 * @returns {string} - Encrypted data as string
 */
const encryptData = (data, key) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, key).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt data using AES encryption
 * @param {string} encryptedData - Encrypted data to decrypt
 * @param {string} key - Decryption key (usually PIN)
 * @returns {string} - Decrypted data as string
 */
const decryptData = (encryptedData, key) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Store encrypted PIN
 * @param {string} pin - User's PIN
 * @returns {Promise<boolean>} - Success indicator
 */
export const storeEncryptedPin = async (pin) => {
  try {
    const dataToStore = {
      pin: encryptData(pin, pin),
      timestamp: Date.now()
    };
    await localforage.setItem('walletPin', dataToStore);
    return true;
  } catch (error) {
    console.error('Error storing PIN:', error);
    throw new Error('Failed to store PIN');
  }
};

/**
 * Verify user's PIN
 * @param {string} enteredPin - PIN to verify
 * @returns {Promise<boolean>} - Whether PIN is valid
 */
export const verifyPin = async (enteredPin) => {
  try {
    const storedData = await localforage.getItem('walletPin');
    if (!storedData) return false;
    
    const storedPin = decryptData(storedData.pin, enteredPin);
    return storedPin === enteredPin;
  } catch (error) {
    console.error('Error verifying PIN:', error);
    throw new Error('Failed to verify PIN');
  }
};

/**
 * Store wallet data with encrypted private keys
 * @param {Array|Object} walletData - Wallet data to store
 * @param {string} pin - PIN for encryption
 * @returns {Promise<boolean>} - Success indicator
 */
export const storeEncryptedWallet = async (walletData, pin) => {
  try {
    // Handle different wallet data formats
    let walletsToStore = [];
    
    // Case 1: Direct array of wallets
    if (Array.isArray(walletData)) {
      walletsToStore = walletData;
    } 
    // Case 2: Object with walletAddresses array
    else if (walletData && walletData.walletAddresses && Array.isArray(walletData.walletAddresses)) {
      walletsToStore = walletData.walletAddresses;
    }
    // Case 3: Single wallet object
    else if (walletData && walletData.address && walletData.private_key) {
      walletsToStore = [walletData];
    }
    // Case 4: API response format
    else if (walletData && walletData.data) {
      walletsToStore = Array.isArray(walletData.data) ? walletData.data : [walletData.data];
    } else {
      console.error("Invalid wallet data format for encryption:", walletData);
      throw new Error("Invalid wallet data format");
    }

    // Validate we have wallets to store
    if (!walletsToStore.length) {
      throw new Error("No valid wallet data found");
    }

    // Encrypt private keys and prepare data for storage
    const securedWallets = walletsToStore.map(wallet => {
      if (!wallet.private_key) {
        console.error("Wallet missing private key:", wallet);
        throw new Error("Wallet missing private key");
      }
      
      return {
        ...wallet,
        private_key: encryptData(wallet.private_key, pin)
      };
    });

    // Store with consistent structure
    const dataToStore = {
      walletAddresses: securedWallets,
      timestamp: Date.now()
    };
    
    await localforage.setItem('encryptedWallet', dataToStore);
    return true;
  } catch (error) {
    console.error('Error storing wallet:', error);
    throw error;
  }
};

/**
 * Retrieve and decrypt wallet data
 * @param {string} pin - PIN for decryption
 * @returns {Promise<Object|null>} - Decrypted wallet data
 */
export const getEncryptedWallet = async (pin) => {
  try {
    const walletStorage = await localforage.getItem('encryptedWallet');
    if (!walletStorage) return null;
    
    // Handle different storage formats
    let walletsToDecrypt = [];
    let returnFormat = { ...walletStorage };
    
    if (walletStorage.walletAddresses && Array.isArray(walletStorage.walletAddresses)) {
      walletsToDecrypt = walletStorage.walletAddresses;
    } else if (Array.isArray(walletStorage)) {
      walletsToDecrypt = walletStorage;
      returnFormat = walletStorage;
    } else {
      console.error("Unknown wallet storage format");
      return walletStorage; // Return as-is if format is unknown
    }
    
    // Decrypt only private keys
    const decryptedWallets = walletsToDecrypt.map(wallet => ({
      ...wallet,
      private_key: decryptData(wallet.private_key, pin)
    }));
    
    // Return in same format as retrieved
    if (Array.isArray(returnFormat)) {
      return decryptedWallets;
    } else {
      return {
        ...returnFormat,
        walletAddresses: decryptedWallets
      };
    }
  } catch (error) {
    console.error('Error retrieving wallet:', error);
    throw error;
  }
};

/**
 * Update a wallet's private key
 * @param {string} walletId - ID of wallet to update
 * @param {string} newPrivateKey - New private key
 * @param {string} pin - PIN for encryption
 * @returns {Promise<boolean>} - Success indicator
 */
export const updateWalletPrivateKey = async (walletId, newPrivateKey, pin) => {
  try {
    const walletStorage = await localforage.getItem('encryptedWallet');
    if (!walletStorage || !walletStorage.walletAddresses) return false;
    
    const updatedData = walletStorage.walletAddresses.map(wallet => {
      if (wallet.id === walletId) {
        return {
          ...wallet,
          private_key: encryptData(newPrivateKey, pin)
        };
      }
      return wallet;
    });
    
    await localforage.setItem('encryptedWallet', {
      ...walletStorage,
      walletAddresses: updatedData
    });
    return true;
  } catch (error) {
    console.error('Error updating private key:', error);
    throw error;
  }
};

/**
 * Add a new wallet to storage
 * @param {Object} walletData - Wallet data to add
 * @param {string} pin - PIN for encryption
 * @returns {Promise<boolean>} - Success indicator
 */
export const addNewWallet = async (walletData, pin) => {
  try {
    const walletStorage = await localforage.getItem('encryptedWallet');
    let currentWallets = [];
    
    if (walletStorage && walletStorage.walletAddresses) {
      currentWallets = [...walletStorage.walletAddresses];
    } else if (Array.isArray(walletStorage)) {
      currentWallets = [...walletStorage];
    }
    
    // Encrypt the private key of the new wallet
    const newWallet = {
      ...walletData,
      private_key: encryptData(walletData.private_key, pin)
    };
    
    // Add the new wallet
    currentWallets.push(newWallet);
    
    // Store with consistent structure
    await localforage.setItem('encryptedWallet', {
      walletAddresses: currentWallets,
      timestamp: Date.now()
    });
    
    return true;
  } catch (error) {
    console.error('Error adding new wallet:', error);
    throw error;
  }
};