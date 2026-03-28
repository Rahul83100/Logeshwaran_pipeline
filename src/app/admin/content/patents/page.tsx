'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Patent {
    id: string;
    title: string;
    inventors: string;
    grantedDate: string;
    patentNumber: string;
    fieldOfInvention: string;
    year: string;
}

const emptyPatent = { title: '', inventors: '', grantedDate: '', patentNumber: '', fieldOfInvention: '', year: '' };

export default function PatentsManagement() {
    const [patents, setPatents] = useState<Patent[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyPatent);
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadPatents(); }, []);

    async function loadPatents() {
        setLoading(true);
        const snap = await getDocs(collection(db, 'patents'));
        setPatents(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Patent)));
        setLoading(false);
    }

    function openNew() { setForm(emptyPatent); setEditingId(null); setShowForm(true); }

    function openEdit(patent: Patent) {
        setForm({ 
            title: patent.title || '', 
            inventors: patent.inventors || '', 
            grantedDate: patent.grantedDate || '', 
            patentNumber: patent.patentNumber || '', 
            fieldOfInvention: patent.fieldOfInvention || '', 
            year: patent.year || '' 
        });
        setEditingId(patent.id);
        setShowForm(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await updateDoc(doc(db, 'patents', editingId), { ...form, updated_at: serverTimestamp() });
            } else {
                await addDoc(collection(db, 'patents'), { ...form, created_at: serverTimestamp() });
            }
            setShowForm(false);
            await loadPatents();
        } catch (err) { console.error(err); alert('Failed to save.'); }
        finally { setSaving(false); }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this patent?')) return;
        await deleteDoc(doc(db, 'patents', id));
        await loadPatents();
    }

    const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none' };
    const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 as const, color: '#555' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>Patents</h1>
                    <p style={{ color: '#666', margin: 0 }}>Manage granted patents and published intellectual properties</p>
                </div>
                <button onClick={openNew} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #ed64a6, #d53f8c)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
                    <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i> Add Patent
                </button>
            </div>

            {showForm && (
                <div className="admin-card" style={{ marginBottom: '24px', border: '2px solid #ed64a6' }}>
                    <h3>{editingId ? 'Edit Patent' : 'New Patent'}</h3>
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Patent Title *</label>
                                <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Title of the invention" />
                            </div>
                            <div>
                                <label style={labelStyle}>Inventors *</label>
                                <input style={inputStyle} value={form.inventors} onChange={(e) => setForm({ ...form, inventors: e.target.value })} required placeholder="Comma separated list of inventors" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Patent Number *</label>
                                    <input style={inputStyle} value={form.patentNumber} onChange={(e) => setForm({ ...form, patentNumber: e.target.value })} required placeholder="e.g. 429896-001" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Field of Invention</label>
                                    <input style={inputStyle} value={form.fieldOfInvention} onChange={(e) => setForm({ ...form, fieldOfInvention: e.target.value })} placeholder="e.g. Computer Science" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Granted / Filed Date *</label>
                                    <input style={inputStyle} value={form.grantedDate} onChange={(e) => setForm({ ...form, grantedDate: e.target.value })} required placeholder="e.g. 22-Nov-2024" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Year *</label>
                                    <input style={inputStyle} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required placeholder="e.g. 2024" />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#ed64a6', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
                                {saving ? 'Saving...' : editingId ? 'Update Patent' : 'Add Patent'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border" style={{ color: '#ed64a6' }}></div></div>
            ) : patents.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}>
                    <i className="fa-solid fa-lightbulb" style={{ fontSize: '40px', color: '#ddd', marginBottom: '12px' }}></i>
                    <p style={{ color: '#999' }}>No patents yet. Click &quot;Add Patent&quot; to get started.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                    {patents.map((patent) => (
                        <div key={patent.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1a1a2e' }}>{patent.title}</h4>
                                <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#555' }}>Inventors: {patent.inventors}</p>
                                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#666' }}>Number: <b>{patent.patentNumber}</b> | Field: {patent.fieldOfInvention}</p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Date: {patent.grantedDate} ({patent.year})</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                                <button onClick={() => openEdit(patent)} style={{ padding: '8px 12px', background: '#fff5f7', border: 'none', borderRadius: '6px', color: '#ed64a6', cursor: 'pointer' }}>
                                    <i className="fa-solid fa-pen"></i>
                                </button>
                                <button onClick={() => handleDelete(patent.id)} style={{ padding: '8px 12px', background: '#fff0f0', border: 'none', borderRadius: '6px', color: '#e53e3e', cursor: 'pointer' }}>
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
