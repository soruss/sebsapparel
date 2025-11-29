import React from 'react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // High contrast overlay
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'grayscale(100%) blur(2px)'
        }}>
            <div style={{
                backgroundColor: 'var(--color-bg)',
                border: '4px solid var(--color-text-main)', // Thick border
                padding: 'var(--space-8)',
                maxWidth: '500px',
                width: '90%',
                position: 'relative',
                boxShadow: '12px 12px 0px var(--color-text-main)' // Hard shadow
            }}>
                {/* Header */}
                <div style={{
                    borderBottom: '2px solid var(--color-text-main)',
                    marginBottom: 'var(--space-6)',
                    paddingBottom: 'var(--space-4)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        margin: 0,
                        letterSpacing: '-0.05em'
                    }}>
                        Meeting Received
                    </h2>
                    <div style={{
                        fontSize: 'var(--text-xs)',
                        fontFamily: 'var(--font-sans)',
                        color: 'var(--color-text-muted)'
                    }}>
                        ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </div>
                </div>

                {/* Receipt Content */}
                <div style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--text-sm)',
                    marginBottom: 'var(--space-8)',
                    lineHeight: '1.6'
                }}>

                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        padding: 'var(--space-4)',
                        border: '1px solid var(--color-border)',
                        marginBottom: 'var(--space-4)'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>NAME:</span>
                            <span style={{ fontWeight: 600 }}>{data.name}</span>

                            <span style={{ color: 'var(--color-text-muted)' }}>SCHOOL:</span>
                            <span style={{ fontWeight: 600 }}>{data.school}</span>

                            <span style={{ color: 'var(--color-text-muted)' }}>ORG:</span>
                            <span style={{ fontWeight: 600 }}>{data.chapterName || data.organization}</span>

                            <span style={{ color: 'var(--color-text-muted)' }}>DATE:</span>
                            <span style={{ fontWeight: 600 }}>{new Date(data.date).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                        We will contact you shortly.
                    </p>
                </div>

                {/* Action */}
                <button
                    onClick={onClose}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                >
                    ACKNOWLEDGE
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
