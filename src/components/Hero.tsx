import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScrambleText from './ScrambleText';
import Reveal from './Reveal';
import logo from '../assets/logo.png';

const Hero: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="section" style={{
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 'calc(100vh - 80px)', // Full height minus navbar
            display: 'flex', // Enable flexbox
            flexDirection: 'column',
            justifyContent: 'center', // Vertically center
            alignItems: 'flex-start', // Force left alignment
            paddingTop: 0 // Remove top padding
        }}>
            <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>

                {/* Background Logo - Anchored to the right of the container */}
                <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    height: '80%',
                    width: '50%', // Take up right half
                    zIndex: 0,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    pointerEvents: 'none',
                    opacity: 0.05
                }}>
                    <img src={logo} alt="" style={{ height: '100%', width: '100%', objectFit: 'contain', filter: 'grayscale(100%)' }} />
                </div>

                {/* Content Wrapper - Restricted width to avoid logo overlap */}
                <div
                    className="hero-content-wrapper"
                    style={{
                        position: 'relative',
                        zIndex: 10,
                        maxWidth: '650px', // Restrict text width
                        width: '100%'
                    }}>
                    <Reveal width="100%">
                        <h1 style={{
                            fontSize: 'var(--text-5xl)',
                            lineHeight: 1.1,
                            marginBottom: 'var(--space-8)',
                            textTransform: 'lowercase',
                            color: 'var(--color-text-main)',
                            textAlign: 'left'
                        }}>
                            <div style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                                seb's apparel manufacturing
                            </div>
                            <div style={{ fontWeight: 400, fontSize: '0.65em' }}>
                                <ScrambleText text="custom apparel for fraternities & sororities" duration={500} />
                            </div>
                        </h1>
                    </Reveal>

                    <Reveal delay={0.4} width="100%">
                        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-start' }}>
                            <button
                                className="btn btn-primary"
                                style={{ padding: 'var(--space-4) var(--space-8)' }}
                                onClick={() => navigate('/book-meeting')}
                            >
                                book a meeting
                            </button>
                            <button
                                className="btn btn-outline"
                                style={{ padding: 'var(--space-4) var(--space-8)' }}
                                onClick={() => navigate('/catalog')}
                            >
                                view catalog
                            </button>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default Hero;
