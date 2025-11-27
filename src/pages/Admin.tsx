import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface CatalogItem {
    id: number;
    title: string;
    category: string;
    image_url: string;
}

interface Meeting {
    id: number;
    created_at: string;
    name: string;
    email: string;
    organization: string;
    date: string;
    message: string;
    file_name?: string;
}

const Admin: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(''); // Added email state for Supabase Auth
    const [activeTab, setActiveTab] = useState<'catalog' | 'meetings'>('catalog');

    // Catalog State
    const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
    const [newItem, setNewItem] = useState({ title: '', category: '', image_url: '' });

    // Meetings State
    const [meetings, setMeetings] = useState<Meeting[]>([]);

    useEffect(() => {
        checkSession();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCatalog();
            fetchMeetings();
        }
    }, [isAuthenticated]);

    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            setIsAuthenticated(true);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // For simplicity in this migration, we will use signInWithPassword.
        // Ideally, the user should have signed up first. 
        // Since we are just migrating, let's assume they will sign up or we can use a simple password check 
        // IF we haven't set up Auth users yet. 
        // BUT, the goal is to use Supabase Auth.
        // Let's try to sign in. If it fails, we might need to sign up (or just tell the user to sign up in dashboard).

        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert('Login failed: ' + error.message);
        } else {
            setIsAuthenticated(true);
        }
    };

    const fetchCatalog = async () => {
        const { data, error } = await supabase
            .from('catalog_items')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error && data) setCatalogItems(data);
    };

    const fetchMeetings = async () => {
        const { data, error } = await supabase
            .from('meetings')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error && data) setMeetings(data);
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase
            .from('catalog_items')
            .insert([newItem]);

        if (error) {
            alert('Error adding item: ' + error.message);
        } else {
            setNewItem({ title: '', category: '', image_url: '' });
            fetchCatalog();
        }
    };

    const handleDeleteItem = async (id: number) => {
        if (!window.confirm('Are you sure?')) return;
        const { error } = await supabase
            .from('catalog_items')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error deleting item: ' + error.message);
        } else {
            fetchCatalog();
        }
    };

    if (!isAuthenticated) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-bg)'
            }}>
                <form onSubmit={handleLogin} style={{
                    padding: 'var(--space-8)',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-4)',
                    width: '300px'
                }}>
                    <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>Admin Login</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: 'var(--space-2)' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: 'var(--space-2)' }}
                    />
                    <button type="submit" className="btn btn-primary">Login</button>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                        (Use your Supabase credentials)
                    </p>
                </form>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingBottom: '100px' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
                    <h1>Admin Dashboard</h1>
                    <button onClick={async () => { await supabase.auth.signOut(); setIsAuthenticated(false); }} className="btn">Logout</button>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                    <button
                        className={`btn ${activeTab === 'catalog' ? 'btn-primary' : ''}`}
                        onClick={() => setActiveTab('catalog')}
                    >
                        Manage Catalog
                    </button>
                    <button
                        className={`btn ${activeTab === 'meetings' ? 'btn-primary' : ''}`}
                        onClick={() => setActiveTab('meetings')}
                    >
                        View Meetings
                    </button>
                </div>

                {activeTab === 'catalog' ? (
                    <div>
                        <div style={{
                            backgroundColor: 'var(--color-surface)',
                            padding: 'var(--space-6)',
                            marginBottom: 'var(--space-8)',
                            border: '1px solid var(--color-border)'
                        }}>
                            <h3>Add New Item</h3>
                            <form onSubmit={handleAddItem} style={{ display: 'grid', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                                <input
                                    placeholder="Title"
                                    value={newItem.title}
                                    onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                    required
                                    style={{ padding: 'var(--space-2)' }}
                                />
                                <input
                                    placeholder="Category"
                                    value={newItem.category}
                                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                    required
                                    style={{ padding: 'var(--space-2)' }}
                                />
                                <input
                                    placeholder="Image URL"
                                    value={newItem.image_url}
                                    onChange={e => setNewItem({ ...newItem, image_url: e.target.value })}
                                    required
                                    style={{ padding: 'var(--space-2)' }}
                                />
                                <button type="submit" className="btn btn-primary">Add Item</button>
                            </form>
                        </div>

                        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                            {catalogItems.map(item => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 'var(--space-4)',
                                    backgroundColor: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)'
                                }}>
                                    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                                        <img src={item.image_url} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{item.title}</div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{item.category}</div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteItem(item.id)} style={{ color: 'red' }}>Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                        {meetings.length === 0 && <p>No meetings booked yet.</p>}
                        {meetings.map(meeting => (
                            <div key={meeting.id} style={{
                                padding: 'var(--space-6)',
                                backgroundColor: 'var(--color-surface)',
                                border: '1px solid var(--color-border)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                                    <h3 style={{ margin: 0 }}>{meeting.name}</h3>
                                    <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                                        {new Date(meeting.date).toDateString()}
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                                    <div><strong>Email:</strong> {meeting.email}</div>
                                    <div><strong>Organization:</strong> {meeting.organization}</div>
                                    <div><strong>File:</strong> {meeting.file_name || 'None'}</div>
                                    <div><strong>Submitted:</strong> {new Date(meeting.created_at).toLocaleDateString()}</div>
                                </div>
                                <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', backgroundColor: 'var(--color-bg)' }}>
                                    <strong>Message:</strong>
                                    <p style={{ marginTop: 'var(--space-2)', color: 'var(--color-text-muted)' }}>{meeting.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
