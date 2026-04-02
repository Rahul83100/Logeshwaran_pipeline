'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ImageUploader from '@/components/admin/ImageUploader';


interface TestimonialItem {
    id: string;
    text: string;
    authorName: string;
    authorRole: string;
    imageUrl: string;
    order: number;
}
const emptyItem = { text: '', authorName: '', authorRole: '', imageUrl: '', order: 0 };


export default function AdminPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<any>(emptyItem);
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadItems(); }, []);

    async function loadItems() {
        setLoading(true);
        try {
            const q = query(collection(db, 'testimonials'), orderBy('order', 'asc'));
            const snap = await getDocs(q);
            setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error('Failed to load', err);
        }
        setLoading(false);
    }

    function openNew() { setForm(emptyItem); setEditingId(null); setShowForm(true); }

    function openEdit(item: any) {
        const itemCopy = { ...item };
        delete itemCopy.id;
        delete itemCopy.created_at;
        delete itemCopy.updated_at;
        setForm(itemCopy);
        setEditingId(item.id);
        setShowForm(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await updateDoc(doc(db, 'testimonials', editingId), { ...form, updated_at: serverTimestamp() });
            } else {
                await addDoc(collection(db, 'testimonials'), { ...form, created_at: serverTimestamp() });
            }
            setShowForm(false);
            await loadItems();
        } catch (err) { console.error(err); alert('Failed to save.'); }
        finally { setSaving(false); }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this item?')) return;
        await deleteDoc(doc(db, 'testimonials', id));
        await loadItems();
    }

    const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none' };
    const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 as const, color: '#555' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>Testimonials</h1>
                    <p style={{ color: '#666', margin: 0 }}>Manage client and partner testimonials</p>
                </div>
                <button onClick={openNew} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
                    <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i> Add New
                </button>
            </div>

            {showForm && (
                <div className="admin-card" style={{ marginBottom: '24px', border: '2px solid #667eea' }}>
                    <h3>{editingId ? 'Edit Item' : 'New Item'}</h3>
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            
      <div>
          <label style={labelStyle}>Testimonial Text *</label>
          <textarea style={{ ...inputStyle, height: '100px' }} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} required />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
              <label style={labelStyle}>Author Name *</label>
              <input style={inputStyle} value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} required />
          </div>
          <div>
              <label style={labelStyle}>Author Role</label>
              <input style={inputStyle} value={form.authorRole} onChange={(e) => setForm({ ...form, authorRole: e.target.value })} />
          </div>
      </div>
      <div>
          <ImageUploader currentUrl={form.imageUrl} onUrlChange={(url) => setForm({ ...form, imageUrl: url })} storagePath="images/testimonials" label="Author Image" />
      </div>
      <div>
          <label style={labelStyle}>Order</label>
          <input style={inputStyle} type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
      </div>

                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
                                {saving ? 'Saving...' : editingId ? 'Update' : 'Add'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border text-primary"></div></div>
            ) : items.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}>
                    <i className="fa-solid fa-quote-left" style={{ fontSize: '40px', color: '#ddd', marginBottom: '12px' }}></i>
                    <p style={{ color: '#999' }}>No items yet. Click "Add New" to get started.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {items.map((item) => (
                        <div key={item.id} className="admin-card" style={{ overflow: 'hidden' }}>
                            
      {item.imageUrl && (
        <div style={{ marginBottom: '12px' }}>
            <img src={item.imageUrl} alt={item.authorName} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
        </div>
      )}
      <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#666', fontStyle: 'italic', lineHeight: 1.4 }}>"{item.text}"</p>
      <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#1a1a2e' }}>{item.authorName}</h4>
      <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#888' }}>{item.authorRole}</p>
      <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#888' }}>Order: {item.order}</p>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => openEdit(item)} style={{ padding: '6px 14px', background: '#f0f0ff', border: 'none', borderRadius: '6px', color: '#667eea', cursor: 'pointer', fontSize: '13px' }}>
                                    <i className="fa-solid fa-pen" style={{ marginRight: '4px' }}></i> Edit
                                </button>
                                <button onClick={() => handleDelete(item.id)} style={{ padding: '6px 14px', background: '#fff0f0', border: 'none', borderRadius: '6px', color: '#e53e3e', cursor: 'pointer', fontSize: '13px' }}>
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
