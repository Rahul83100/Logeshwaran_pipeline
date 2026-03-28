'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Book {
    id: string;
    title: string;
    bookTitle: string;
    isbn: string;
    year: string;
    month: string;
}

const emptyBook = { title: '', bookTitle: '', isbn: '', year: '', month: '' };

export default function BooksManagement() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyBook);
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadBooks(); }, []);

    async function loadBooks() {
        setLoading(true);
        const snap = await getDocs(collection(db, 'books'));
        setBooks(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Book)));
        setLoading(false);
    }

    function openNew() { setForm(emptyBook); setEditingId(null); setShowForm(true); }

    function openEdit(book: Book) {
        setForm({ title: book.title || '', bookTitle: book.bookTitle || '', isbn: book.isbn || '', year: book.year || '', month: book.month || '' });
        setEditingId(book.id);
        setShowForm(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await updateDoc(doc(db, 'books', editingId), { ...form, updated_at: serverTimestamp() });
            } else {
                await addDoc(collection(db, 'books'), { ...form, created_at: serverTimestamp() });
            }
            setShowForm(false);
            await loadBooks();
        } catch (err) { console.error(err); alert('Failed to save.'); }
        finally { setSaving(false); }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this book?')) return;
        await deleteDoc(doc(db, 'books', id));
        await loadBooks();
    }

    const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none' };
    const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 as const, color: '#555' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>Books & Chapters</h1>
                    <p style={{ color: '#666', margin: 0 }}>Manage authored books, book chapters, and editorial contributions</p>
                </div>
                <button onClick={openNew} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #48bb78, #38a169)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
                    <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i> Add Book
                </button>
            </div>

            {showForm && (
                <div className="admin-card" style={{ marginBottom: '24px', border: '2px solid #48bb78' }}>
                    <h3>{editingId ? 'Edit Book' : 'New Book'}</h3>
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Chapter/Article Title *</label>
                                <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Chapter Title" />
                            </div>
                            <div>
                                <label style={labelStyle}>Book Title *</label>
                                <input style={inputStyle} value={form.bookTitle} onChange={(e) => setForm({ ...form, bookTitle: e.target.value })} required placeholder="Main Book Title" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>ISBN</label>
                                    <input style={inputStyle} value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} placeholder="e.g. 978-981..." />
                                </div>
                                <div>
                                    <label style={labelStyle}>Month</label>
                                    <input style={inputStyle} value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} placeholder="e.g. Jul" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Year</label>
                                    <input style={inputStyle} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required placeholder="e.g. 2025" />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#48bb78', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
                                {saving ? 'Saving...' : editingId ? 'Update Book' : 'Add Book'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border" style={{ color: '#48bb78' }}></div></div>
            ) : books.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}>
                    <i className="fa-solid fa-book-open" style={{ fontSize: '40px', color: '#ddd', marginBottom: '12px' }}></i>
                    <p style={{ color: '#999' }}>No books yet. Click &quot;Add Book&quot; to get started.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {books.map((book) => (
                        <div key={book.id} className="admin-card" style={{ overflow: 'hidden' }}>
                            <h4 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1a1a2e' }}>{book.title}</h4>
                            <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#555', fontWeight: 500 }}>{book.bookTitle}</p>
                            <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#888' }}>ISBN: {book.isbn || 'N/A'}</p>
                            <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#888' }}>Published: {book.month ? `${book.month} ` : ''}{book.year}</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => openEdit(book)} style={{ padding: '6px 14px', background: '#f0fdf4', border: 'none', borderRadius: '6px', color: '#48bb78', cursor: 'pointer', fontSize: '13px' }}>
                                    <i className="fa-solid fa-pen" style={{ marginRight: '4px' }}></i> Edit
                                </button>
                                <button onClick={() => handleDelete(book.id)} style={{ padding: '6px 14px', background: '#fff0f0', border: 'none', borderRadius: '6px', color: '#e53e3e', cursor: 'pointer', fontSize: '13px' }}>
                                    <i className="fa-solid fa-trash" style={{ marginRight: '4px' }}></i> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
