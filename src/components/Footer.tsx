import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={{
            padding: 'var(--space-12) 0',
            borderTop: '1px solid var(--color-surface)',
            textAlign: 'center',
            color: 'var(--color-text-muted)'
        }}>
            <div className="container">
                <div style={{ marginBottom: 'var(--space-4)' }}>
                    <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--color-text-main)' }}>
                        Seb's Apparel Manufacturing
                    </span>
                </div>
                <p style={{ fontSize: 'var(--text-sm)' }}>
                    &copy; {new Date().getFullYear()} Seb's Apparel Manufacturing. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
