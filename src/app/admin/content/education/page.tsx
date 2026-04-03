'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Education {
    id: string;
    degree: string;
    institution: string;
    year_range: string;
    description: string;
    order: number;
}

const emptyEdu = { degree: '', institution: '', year_range: '', description: '', order: 0 };

export default function EducationManagement() {
    const [items, setItems] = useState<Education[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyEdu);
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadItems(); }, []);

    async function loadItems() {
        setLoading(true);
        const q = query(collection(db, 'education'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Education)));
        setLoading(false);
    }

    function openNew() { setForm({ ...emptyEdu, order: items.length }); setEditingId(null); setShowForm(true); }
    function openEdit(item: Education) {
        setForm({ degree: item.degree, institution: item.institution, year_range: item.year_range, description: item.description, order: item.order });
        setEditingId(item.id); setShowForm(true);
    }

    const [alsoShare, setAlsoShare] = useState(false);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault(); setSaving(true);
        try {
            let savedId = editingId;
            if (editingId) { await updateDoc(doc(db, 'education', editingId), { ...form, updated_at: serverTimestamp() }); }
            else { 
                const docRef = await addDoc(collection(db, 'education'), { ...form, created_at: serverTimestamp() }); 
                savedId = docRef.id;
            }

            if (alsoShare && savedId) {
                const shareUrl = `https://logishoren.com/education/${savedId}`;
                const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                window.open(linkedinUrl, '_blank', 'width=600,height=600');
            }

            setShowForm(false); 
            setAlsoShare(false);
            await loadItems();
        } catch (err) { console.error(err); alert('Failed to save.'); }
        finally { setSaving(false); }
    }

    async function handleDelete(id: string) { if (!confirm('Delete this entry?')) return; await deleteDoc(doc(db, 'education', id)); await loadItems(); }

    const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none' };
    const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 as const, color: '#555' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>Education</h1>
                    <p style={{ color: '#666', margin: 0 }}>Manage educational qualifications</p>
                </div>
                <button onClick={openNew} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
                    <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i> Add Education
                </button>
            </div>

            {showForm && (
                <div className="admin-card" style={{ marginBottom: '24px', border: '2px solid #667eea' }}>
                    <h3>{editingId ? 'Edit Education' : 'Add Education'}</h3>
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div><label style={labelStyle}>Degree / Title *</label><input style={inputStyle} value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} required placeholder="e.g. PhD in Computer Science" /></div>
                            <div><label style={labelStyle}>Institution *</label><input style={inputStyle} value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} required placeholder="e.g. Christ University" /></div>
                            <div><label style={labelStyle}>Year Range</label><input style={inputStyle} value={form.year_range} onChange={(e) => setForm({ ...form, year_range: e.target.value })} placeholder="e.g. 2015-2020" /></div>
                            <div><label style={labelStyle}>Display Order</label><input style={inputStyle} type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })} /></div>
                            <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" /></div>
                        </div>

                        <div style={{ margin: '20px 0', padding: '15px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #e9ecef' }}>
                            <input 
                                type="checkbox" 
                                id="alsoShare" 
                                checked={alsoShare} 
                                onChange={(e) => setAlsoShare(e.target.checked)}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="alsoShare" style={{ fontSize: '14px', fontWeight: 500, color: '#0A66C2', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <i className="fa-brands fa-linkedin" style={{ marginRight: '8px', fontSize: '18px' }}></i>
                                Also share on LinkedIn
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>{saving ? 'Saving...' : editingId ? 'Update' : 'Add'}</button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (<div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border text-primary"></div></div>) : items.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}><p style={{ color: '#999' }}>No education entries. Add one to get started.</p></div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {items.map((item) => (
                        <div key={item.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>{item.degree}</h4>
                                <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{item.institution}{item.year_range && ` · ${item.year_range}`}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => openEdit(item)} style={{ padding: '6px 14px', background: '#f0f0ff', border: 'none', borderRadius: '6px', color: '#667eea', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                                <button onClick={() => handleDelete(item.id)} style={{ padding: '6px 14px', background: '#fff0f0', border: 'none', borderRadius: '6px', color: '#e53e3e', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
