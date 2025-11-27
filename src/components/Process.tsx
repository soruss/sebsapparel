import React from 'react';
import Reveal from './Reveal';

const steps = [
    { number: '01', title: 'Design', desc: 'Use your design or collaborate with us on a custom design.' },
    { number: '02', title: 'Produce', desc: 'Manufactured in-house using premium materials.' },
    { number: '03', title: 'Deliver', desc: 'We handle all logistics and ship directly to your location.' },
];

const Process: React.FC = () => {
    return (
        <section id="process" className="section" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="container">

                <div className="grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 'var(--space-8)'
                }}>
                    {steps.map((step, index) => (
                        <Reveal key={index} delay={index * 0.2} width="100%">
                            <div style={{ position: 'relative', paddingLeft: 'var(--space-4)' }}>
                                <div style={{
                                    fontSize: 'var(--text-6xl)',
                                    fontWeight: 700,
                                    color: 'var(--color-border)',
                                    position: 'absolute',
                                    top: '-20px',
                                    left: 0,
                                    zIndex: 0,
                                    opacity: 0.5
                                }}>
                                    {step.number}
                                </div>
                                <div style={{ position: 'relative', zIndex: 1, paddingTop: 'var(--space-8)' }}>
                                    <h3 style={{
                                        fontSize: 'var(--text-2xl)',
                                        marginBottom: 'var(--space-4)',
                                        color: 'var(--color-text-main)'
                                    }}>
                                        {step.title}
                                    </h3>
                                    <p style={{ color: 'var(--color-text-muted)' }}>{step.desc}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;
