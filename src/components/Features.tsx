import React from 'react';
import Reveal from './Reveal';

const features = [
    { title: 'Direct Manufacturer', desc: 'Factory-direct pricing with no middleman markups.' },
    { title: 'All Merchandise', desc: 'Tees, Longsleeves, Hoodies, Crewnecks, Hats, Pants, Shorts, Jerseys, etc.' },
    { title: 'Custom Embroidery', desc: 'Premium stitching for letters, crests, and personalized gear.' },
    { title: 'Bulk Orders', desc: 'Scalable production for entire chapters or national events.' },
    { title: 'Student Founded', desc: 'Founded at Indiana University. Built by students, for students.' },
];

const Features: React.FC = () => {
    return (
        <section id="services" className="section" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div className="container">
                <div className="grid">
                    {features.map((feature, index) => (
                        <Reveal key={index} delay={index * 0.1} width="100%">
                            <div
                                className="feature-card"
                                style={{
                                    padding: 'var(--space-8)',
                                    backgroundColor: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'default'
                                }}>
                                <h3 style={{
                                    fontSize: 'var(--text-2xl)', // Increased size
                                    fontWeight: 700, // Bolder
                                    marginBottom: 'var(--space-4)',
                                    color: 'var(--color-text-main)'
                                }}>
                                    {feature.title}
                                </h3>
                                <p style={{
                                    color: 'var(--color-text-muted)',
                                    lineHeight: 1.6
                                }}>
                                    {feature.desc}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
