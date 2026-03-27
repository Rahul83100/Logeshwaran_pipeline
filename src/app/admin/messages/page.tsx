'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: 'new' | 'read';
    created_at: { toDate: () => Date } | null;
}

export default function MessagesAdmin() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadMessages(); }, []);

    async function loadMessages() {
        setLoading(true);
        try {
            const q = query(collection(db, 'contact_submissions'), orderBy('created_at', 'desc'));
            const snap = await getDocs(q);
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage)));
        } catch (err) {
            console.error('Failed to load messages:', err);
        } finally {
            setLoading(false);
        }
    }

    async function markAsRead(id: string) {
        try {
            await updateDoc(doc(db, 'contact_submissions', id), { status: 'read' });
            // Optimistic update
            setMessages(msgs => msgs.map(m => m.id === id ? { ...m, status: 'read' } : m));
        } catch (err) {
            console.error('Failed to mark as read', err);
            alert('Failed to update status. Check Firebase Rules.'); 
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to permanently delete this message?')) return;
        try {
            await deleteDoc(doc(db, 'contact_submissions', id));
            setMessages(msgs => msgs.filter(m => m.id !== id));
        } catch (err) {
            console.error('Failed to delete message', err);
            alert('Failed to delete message. Check Firebase Rules.');
        }
    }

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>
                    <i className="fa-solid fa-inbox" style={{ marginRight: '10px', color: '#667eea' }}></i>
                    Inbox
                </h1>
                <p style={{ color: '#666', margin: 0 }}>View and manage messages sent from your portfolio contact form.</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border text-primary"></div></div>
            ) : messages.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}>
                    <i className="fa-regular fa-envelope-open" style={{ fontSize: '40px', color: '#ddd', marginBottom: '12px' }}></i>
                    <p style={{ color: '#999' }}>Your inbox is completely empty.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {messages.map((msg) => (
                        <div key={msg.id} className="admin-card" style={{ 
                            borderLeft: msg.status === 'new' ? '4px solid #667eea' : '4px solid transparent',
                            background: msg.status === 'new' ? '#fafaff' : '#ffffff',
                            transition: 'all 0.2s',
                            position: 'relative'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 4px', fontSize: '18px', color: '#1a1a2e', fontWeight: msg.status === 'new' ? 700 : 500 }}>
                                        {msg.subject || 'No Subject'}
                                    </h4>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '14px', color: '#444', fontWeight: 600 }}>{msg.name}</span>
                                        <a href={`mailto:${msg.email}`} style={{ fontSize: '13px', color: '#667eea', textDecoration: 'none' }}>
                                            <i className="fa-regular fa-envelope" style={{ marginRight: '4px' }}></i>
                                            {msg.email}
                                        </a>
                                        {msg.phone && (
                                            <a href={`tel:${msg.phone}`} style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>
                                                <i className="fa-solid fa-phone" style={{ marginRight: '4px' }}></i>
                                                {msg.phone}
                                            </a>
                                        )}
                                        <span style={{ fontSize: '12px', color: '#aaa', marginLeft: 'auto' }}>
                                            {msg.created_at?.toDate ? msg.created_at.toDate().toLocaleString() : 'Unknown Date'}
                                        </span>
                                    </div>
                                </div>
                                {msg.status === 'new' && (
                                    <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                                        New
                                    </span>
                                )}
                            </div>
                            
                            <div style={{ 
                                padding: '16px', 
                                background: 'rgba(0,0,0,0.02)', 
                                borderRadius: '8px', 
                                fontSize: '14px', 
                                color: '#333',
                                lineHeight: '1.6',
                                whiteSpace: 'pre-wrap',
                                marginBottom: '16px',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}>
                                {msg.message}
                            </div>

                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                {msg.status === 'new' && (
                                    <button onClick={() => markAsRead(msg.id)} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid #667eea', borderRadius: '6px', color: '#667eea', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                                        <i className="fa-solid fa-check" style={{ marginRight: '6px' }}></i> Mark as Read
                                    </button>
                                )}
                                <button onClick={() => handleDelete(msg.id)} style={{ padding: '6px 14px', background: '#fff0f0', border: 'none', borderRadius: '6px', color: '#e53e3e', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                                    <i className="fa-solid fa-trash" style={{ marginRight: '6px' }}></i> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
