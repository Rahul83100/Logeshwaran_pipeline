'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Award {
    id: string;
    title: string;
    description: string;
    organisation: string;
    date: string;
    year: string;
}

const emptyAward = { title: '', description: '', organisation: '', date: '', year: '' };

export default function AwardsManagement() {
    const [awards, setAwards] = useState<Award[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyAward);
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadAwards(); }, []);

    async function loadAwards() {
        setLoading(true);
        const snap = await getDocs(collection(db, 'awards'));
        setAwards(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Award)));
        setLoading(false);
    }

    function openNew() { setForm(emptyAward); setEditingId(null); setShowForm(true); }

    function openEdit(aw: Award) {
        setForm({ 
            title: aw.title || '', 
            description: aw.description || '', 
            organisation: aw.organisation || '', 
            date: aw.date || '', 
            year: aw.year || '' 
        });
        setEditingId(aw.id);
        setShowForm(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await updateDoc(doc(db, 'awards', editingId), { ...form, updated_at: serverTimestamp() });
            } else {
                await addDoc(collection(db, 'awards'), { ...form, created_at: serverTimestamp() });
            }
            setShowForm(false);
            await loadAwards();
        } catch (err) { console.error(err); alert('Failed to save.'); }
        finally { setSaving(false); }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this award?')) return;
        await deleteDoc(doc(db, 'awards', id));
        await loadAwards();
    }

    const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none' };
    const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 as const, color: '#555' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>Awards & Achievements</h1>
                    <p style={{ color: '#666', margin: 0 }}>Manage professional recognitions, awards, and honors</p>
                </div>
                <button onClick={openNew} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #ecc94b, #d69e2e)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
                    <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i> Add Award
                </button>
            </div>

            {showForm && (
                <div className="admin-card" style={{ marginBottom: '24px', border: '2px solid #ecc94b' }}>
                    <h3>{editingId ? 'Edit Award' : 'New Award'}</h3>
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Award / Recognition Title *</label>
                                <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Name of award or role" />
                            </div>
                            <div>
                                <label style={labelStyle}>Organisation / Institution *</label>
                                <input style={inputStyle} value={form.organisation} onChange={(e) => setForm({ ...form, organisation: e.target.value })} required placeholder="Who gave this award" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Date *</label>
                                    <input style={inputStyle} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required placeholder="e.g. 23 April 2025" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Year *</label>
                                    <input style={inputStyle} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required placeholder="e.g. 2025" />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Description</label>
                                <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Details about this award" />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#ecc94b', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 500, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                                {saving ? 'Saving...' : editingId ? 'Update Award' : 'Add Award'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border" style={{ color: '#ecc94b' }}></div></div>
            ) : awards.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}>
                    <i className="fa-solid fa-award" style={{ fontSize: '40px', color: '#ddd', marginBottom: '12px' }}></i>
                    <p style={{ color: '#999' }}>No awards yet. Click &quot;Add Award&quot; to get started.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                    {awards.map((aw) => (
                        <div key={aw.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1a1a2e' }}>{aw.title}</h4>
                                <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#555' }}>Organisation: <b>{aw.organisation}</b></p>
                                {aw.description && <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#666' }}>{aw.description}</p>}
                                <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Date: {aw.date} ({aw.year})</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                                <button onClick={() => openEdit(aw)} style={{ padding: '8px 12px', background: '#fffff0', border: 'none', borderRadius: '6px', color: '#d69e2e', cursor: 'pointer' }}>
                                    <i className="fa-solid fa-pen"></i>
                                </button>
                                <button onClick={() => handleDelete(aw.id)} style={{ padding: '8px 12px', background: '#fff0f0', border: 'none', borderRadius: '6px', color: '#e53e3e', cursor: 'pointer' }}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
