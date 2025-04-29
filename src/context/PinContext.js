import { createContext, useState, useContext, useCallback } from 'react';
import { storeEncryptedPin, verifyPin } from '../views/auth/utils/storage';

export const PinContext = createContext();

export const PinProvider = ({ children }) => {
  const [pin, setPin] = useState(null);
  const [pinVerified, setPinVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastVerified, setLastVerified] = useState(null);

  // Check if PIN session is still valid (1 hour)
  const isPinSessionValid = useCallback(() => {
    if (!lastVerified) return false;
    const oneHour = 60 * 60 * 1000;
    return (Date.now() - lastVerified) < oneHour;
  }, [lastVerified]);

  // Verify PIN and start session
  const verifyStoredPin = useCallback(async (enteredPin) => {
    try {
      setLoading(true);
      const isValid = await verifyPin(enteredPin);
      if (isValid) {
        setPin(enteredPin);
        setPinVerified(true);
        setLastVerified(Date.now());
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('PIN verification error:', err);
      setError('PIN verification failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Store PIN securely
  const storePin = useCallback(async (newPin) => {
    try {
      setLoading(true);
      await storeEncryptedPin(newPin);
      setPin(newPin);
      setPinVerified(true);
      setLastVerified(Date.now());
      setError(null);
      return true;
    } catch (err) {
      console.error('PIN storage error:', err);
      setError('Failed to store PIN');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if PIN verification is needed
  const checkPinVerification = useCallback(async () => {
    return isPinSessionValid();
  }, [isPinSessionValid]);

  // Clear all sensitive data
  const clearSession = useCallback(() => {
    setPin(null);
    setPinVerified(false);
    setError(null);
  }, []);

  return (
    <PinContext.Provider
      value={{
        // State
        pin,
        pinVerified,
        loading,
        error,
        
        // Actions
        storePin,
        verifyStoredPin,
        checkPinVerification,
        clearSession,
        setError
      }}
    >
      {children}
    </PinContext.Provider>
  );
};

export const usePinContext = () => {
  const context = useContext(PinContext);
  if (!context) {
    throw new Error('usePinContext must be used within a PinProvider');
  }
  return context;
};