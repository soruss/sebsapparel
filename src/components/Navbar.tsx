import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <nav style={{
            padding: 'var(--space-4) 0',
            borderBottom: '1px solid var(--color-border)',
            position: 'sticky',
            top: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // White with opacity
            backdropFilter: 'blur(10px)',
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Left: Links */}
                <div className="desktop-only" style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', gap: 'var(--space-6)' }}>
                    <Link to="/catalog" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Catalog</Link>
                </div>

                {/* Center: Logo */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Link to="/">
                        <div style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: 'var(--color-primary)', // Black
                            maskImage: `url("${logo}")`,
                            WebkitMaskImage: `url("${logo}")`,
                            maskSize: 'contain',
                            WebkitMaskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskPosition: 'center'
                        }} />
                    </Link>
                </div>

                {/* Right: CTA */}
                <div className="desktop-only" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        className="btn btn-primary"
                        style={{ fontSize: 'var(--text-sm)' }}
                        onClick={() => navigate('/book-meeting')}
                    >
                        Book a Meeting
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
