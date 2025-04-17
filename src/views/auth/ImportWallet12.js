import { XIcon } from '@heroicons/react/outline'

export default function ImportWalletModal({
    seedWords = Array(12).fill(''),
    handleChange,
    handleKeyDown,
    handleContinue,
    onClose
}) {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.25)',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: 16,
                boxSizing: 'border-box',
                zIndex: 1000
            }}
        >
            <div
                style={{
                    backgroundColor: '#F5F7FA',
                    borderRadius: 16,
                    padding: 32,
                    width: '100%',
                    maxWidth: 700,
                    height: 'auto',
                    marginRight: 'auto',
                    marginLeft: 'auto',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    position: 'relative',
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
                    <XIcon style={{ width: 20, height: 20, color: '#6B7280' }} />
                </button>

                {/* Heading */}
                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#111827' }}>
                    Import Wallet
                </h2>
                <p style={{ marginTop: 4, fontSize: 14, color: '#6B7280' }}>
                    Enter your wallet seed words below to import your wallet
                </p>

                {/* Seed word form */}
                <form onSubmit={handleContinue} style={{ marginTop: 24 }}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            columnGap: 24,
                            rowGap: 16,
                        }}
                    >
                        {seedWords.map((word, idx) => (
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
                                    value={word}
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
                            backgroundColor: '#00693E',
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
    )
}
