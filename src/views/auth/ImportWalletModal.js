import { XIcon } from '@heroicons/react/outline';
import React from 'react';

export default function ImportWalletModal({
  wordCount = 12,
  seedWords = [],
  handleChange,
  handleKeyDown,
  handleContinue,
  onClose
}) {
  return (
    <div className='bg-blueGray-600'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        // backgroundColor: 'rgba(0,0,0,0.25)',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 16,
        boxSizing: 'border-box',
        zIndex: 1000
      }}
    >
      <div  className="no-scrollbar"
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
        {/* Close button */}
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

        {/* Heading */}
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white' }}>
          Import Wallet ({wordCount})
        </h2>
        <p style={{ marginTop: 4, fontSize: 14, color: '#6B7280' }}>
          Enter your {wordCount}-word seed phrase below to import your wallet
        </p>

        {/* Seed word form */}
        <form onSubmit={handleContinue} style={{ marginTop: 24 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              columnGap: 24,
              rowGap: 16
            }}
          >
            {Array.from({ length: wordCount }).map((_, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                <label
                  htmlFor={`seed-${idx}`}
                  style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}
                >
                  {idx + 1}
                </label>
                <input
                  id={`seed-${idx}`}
                  type="text"
                  value={seedWords[idx] || ''}
                  onChange={e => handleChange(e.target.value, idx)}
                  onKeyDown={e => handleKeyDown(e, idx)}
                  autoComplete="off"
                  autoFocus={idx === 0}
                  style={{
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
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              marginTop: 32,
              width: '100%',
              height: 48,
              backgroundColor: '#27C499',
              color: '#FFF',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Continue to Homepage
          </button>
        </form>
      </div>
    </div>
  );
}
