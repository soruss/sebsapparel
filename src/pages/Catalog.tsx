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
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isFilled, setIsFilled] = useState(false);

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

    const closeModel = () => {
        setSelectedImage(null);
        setIsFilled(false);
    };

    return (
        <div style={{ paddingTop: '0px', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
            <section className="section" style={{ paddingTop: 'var(--space-12)' }}>
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
                                    onClick={() => setSelectedImage(item.image_url)}
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

            {/* Image Modal */}
            {selectedImage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        cursor: 'pointer'
                    }}
                    onClick={closeModel}
                >
                    <div style={{
                        position: 'absolute',
                        top: 'var(--space-6)',
                        right: 'var(--space-6)',
                        zIndex: 2001,
                        display: 'flex',
                        gap: 'var(--space-4)'
                    }}>
                        <button
                            style={{
                                backgroundColor: isFilled ? 'white' : 'transparent',
                                color: isFilled ? 'black' : 'white',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsFilled(!isFilled);
                            }}
                            title={isFilled ? "Fit to Screen" : "Fill Screen"}
                        >
                            {isFilled ? '⤡' : '⤢'}
                        </button>
                        <button
                            style={{
                                color: 'white',
                                fontSize: 'var(--text-2xl)',
                                fontWeight: 700,
                                padding: 'var(--space-2)',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={closeModel}
                        >
                            ✕
                        </button>
                    </div>

                    <img
                        src={selectedImage}
                        alt="Full view"
                        style={{
                            maxWidth: isFilled ? '100%' : '90%',
                            maxHeight: isFilled ? '100%' : '90vh',
                            width: isFilled ? '100%' : 'auto',
                            height: isFilled ? '100%' : 'auto',
                            objectFit: isFilled ? 'cover' : 'contain',
                            border: isFilled ? 'none' : '1px solid white',
                            transition: 'all 0.3s ease'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default Catalog;
