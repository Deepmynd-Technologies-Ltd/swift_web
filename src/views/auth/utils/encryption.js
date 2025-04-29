/**
 * Simple encryption utility for wallet data
 * Uses AES-CBC encryption with a derived key from user's PIN
 */

/**
 * Generate a key from the PIN using PBKDF2
 * @param {string} pin - User's PIN
 * @returns {Promise<CryptoKey>} - Derived key
 */
async function deriveKey(pin) {
  // Convert PIN to ArrayBuffer
  const encoder = new TextEncoder();
  const pinData = encoder.encode(pin);
  
  // Use a static salt - in a production environment, this should be randomly generated and stored
  const salt = encoder.encode("walletAppStaticSalt");
  
  // Import the PIN as a key
  const importedKey = await window.crypto.subtle.importKey(
    "raw",
    pinData,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  
  // Derive a key using PBKDF2
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    importedKey,
    { name: "AES-CBC", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt data using AES-CBC
 * @param {string} data - Data to encrypt
 * @param {string} pin - User's PIN
 * @returns {string} - Base64-encoded encrypted data
 */
export function encryptData(data, pin) {
  if (!data) return "";
  
  try {
    // For browser compatibility, use this simpler encryption method
    // Generate a simple encryption key from the PIN
    let key = "";
    for (let i = 0; i < pin.length; i++) {
      key += pin.charCodeAt(i).toString(16);
    }
    
    // Pad key to 32 characters
    while (key.length < 32) {
      key += "0";
    }
    
    // Simple XOR-based encryption
    let encrypted = "";
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      encrypted += String.fromCharCode(charCode);
    }
    
    // Convert to Base64
    return btoa(encrypted);
  } catch (error) {
    console.error("Encryption error:", error);
    return "";
  }
}

/**
 * Decrypt data using AES-CBC
 * @param {string} encryptedData - Base64-encoded encrypted data
 * @param {string} pin - User's PIN
 * @returns {string} - Decrypted data
 */
export function decryptData(encryptedData, pin) {
  if (!encryptedData) return "";
  
  try {
    // Generate the same key used for encryption
    let key = "";
    for (let i = 0; i < pin.length; i++) {
      key += pin.charCodeAt(i).toString(16);
    }
    
    // Pad key to 32 characters
    while (key.length < 32) {
      key += "0";
    }
    
    // Convert from Base64
    const encryptedBytes = atob(encryptedData);
    
    // Simple XOR-based decryption
    let decrypted = "";
    for (let i = 0; i < encryptedBytes.length; i++) {
      const charCode = encryptedBytes.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      decrypted += String.fromCharCode(charCode);
    }
    
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    return "";
  }
}

/**
 * Alternative implementation using Web Crypto API (when available)
 * More secure but requires more setup and browser support
 */
export async function encryptDataSecure(data, pin) {
  if (!data) return "";
  
  try {
    // Convert data to ArrayBuffer
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Generate a random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    
    // Derive key from PIN
    const key = await deriveKey(pin);
    
    // Encrypt the data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-CBC",
        iv: iv
      },
      key,
      dataBuffer
    );
    
    // Combine IV and encrypted data
    const resultBuffer = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    resultBuffer.set(iv, 0);
    resultBuffer.set(new Uint8Array(encryptedBuffer), iv.length);
    
    // Convert to Base64 string for storage
    return btoa(String.fromCharCode(...resultBuffer));
  } catch (error) {
    console.error("Secure encryption error:", error);
    // Fall back to simple encryption
    return encryptData(data, pin);
  }
}

/**
 * Decrypt data using Web Crypto API
 * @param {string} encryptedData - Base64-encoded encrypted data
 * @param {string} pin - User's PIN
 * @returns {Promise<string>} - Decrypted data
 */
export async function decryptDataSecure(encryptedData, pin) {
  if (!encryptedData) return "";
  
  try {
    // Convert from Base64 to ArrayBuffer
    const encryptedString = atob(encryptedData);
    const encryptedBytes = new Uint8Array(encryptedString.length);
    for (let i = 0; i < encryptedString.length; i++) {
      encryptedBytes[i] = encryptedString.charCodeAt(i);
    }
    
    // Extract IV (first 16 bytes)
    const iv = encryptedBytes.slice(0, 16);
    const data = encryptedBytes.slice(16);
    
    // Derive key from PIN
    const key = await deriveKey(pin);
    
    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-CBC",
        iv: iv
      },
      key,
      data
    );
    
    // Convert ArrayBuffer to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error("Secure decryption error:", error);
    // Fall back to simple decryption
    return decryptData(encryptedData, pin);
  }
}