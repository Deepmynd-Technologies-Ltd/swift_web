import CryptoJS from 'crypto-js';


// In storage.js
export const encryptData = (data, key) => {
  try {
    // Convert key to CryptoJS format
    const keyHash = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(data, keyHash, { 
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return iv.toString() + encrypted.toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

export const decryptData = (encryptedData, key) => {
  try {
    // Extract IV (first 32 chars)
    const iv = CryptoJS.enc.Hex.parse(encryptedData.substring(0, 32));
    const encrypted = encryptedData.substring(32);
    const keyHash = CryptoJS.enc.Utf8.parse(key);
    
    const decrypted = CryptoJS.AES.decrypt(encrypted, keyHash, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};