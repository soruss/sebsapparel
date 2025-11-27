import React, { useEffect, useState } from 'react';
import Reveal from '../components/Reveal';
import { supabase } from '../supabaseClient';

interface CatalogItem {
    id: number;
    title: string;
    category: string;
    image_url: string;
}

const Catalog: React.FC = () => {
    const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);

    useEffect(() => {
        fetchCatalog();
    }, []);

    const fetchCatalog = async () => {
        const { data, error } = await supabase
            .from('catalog_items')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching catalog:', error);
        } else {
            setCatalogItems(data || []);
        }
    };

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
            <section className="section">
                <div className="container">
                    <Reveal width="100%">
                        <h1 style={{
                            fontSize: 'var(--text-6xl)',
                            marginBottom: 'var(--space-8)',
                            textTransform: 'lowercase',
                            borderBottom: '1px solid var(--color-border)',
                            paddingBottom: 'var(--space-4)'
                        }}>
                            catalog
                        </h1>
                        <p style={{
                            fontSize: 'var(--text-lg)',
                            color: 'var(--color-text-muted)',
                            marginBottom: 'var(--space-12)',
                            maxWidth: '600px'
                        }}>
                            A selection of our recent work for fraternities and sororities across the nation.
                        </p>
                    </Reveal>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: 'var(--space-8)',
                    }}>
                        {catalogItems.map((item, index) => (
                            <Reveal key={item.id} delay={index * 0.1} width="100%">
                                <div style={{
                                    backgroundColor: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    overflow: 'hidden',
                                    transition: 'transform 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <div style={{
                                        width: '100%',
                                        height: '300px',
                                        backgroundColor: '#f0f0f0',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.5s ease'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                    </div>
                                    <div style={{ padding: 'var(--space-6)' }}>
                                        <div style={{
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--color-text-muted)',
                                            marginBottom: 'var(--space-2)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em'
                                        }}>
                                            {item.category}
                                        </div>
                                        <h3 style={{
                                            fontSize: 'var(--text-xl)',
                                            fontWeight: 700,
                                            color: 'var(--color-text-main)'
                                        }}>
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Catalog;
