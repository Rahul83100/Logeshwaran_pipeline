'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Workshop {
    id: string;
    title: string;
    organiser: string;
    level: string;
    role: string;
    date: string;
    year: string;
}

const emptyWorkshop = { title: '', organiser: '', level: '', role: '', date: '', year: '' };

export default function WorkshopsManagement() {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyWorkshop);
    const [saving, setSaving] = useState(false);
    const [alsoShare, setAlsoShare] = useState(false);

    useEffect(() => { loadWorkshops(); }, []);

    async function loadWorkshops() {
        setLoading(true);
        const snap = await getDocs(collection(db, 'workshops'));
        setWorkshops(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Workshop)));
        setLoading(false);
    }

    function openNew() { setForm(emptyWorkshop); setEditingId(null); setShowForm(true); }

    function openEdit(ws: Workshop) {
        setForm({ 
            title: ws.title || '', 
            organiser: ws.organiser || '', 
            level: ws.level || '', 
            role: ws.role || '', 
            date: ws.date || '', 
            year: ws.year || '' 
        });
        setEditingId(ws.id);
        setShowForm(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await updateDoc(doc(db, 'workshops', editingId), { ...form, updated_at: serverTimestamp() });
            } else {
                await addDoc(collection(db, 'workshops'), { ...form, created_at: serverTimestamp() });
            }
            if (alsoShare) {
                const shareUrl = `https://logishoren.com/#academic`;
                const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                window.open(linkedinUrl, '_blank', 'width=600,height=600');
            }
            setShowForm(false);
            setAlsoShare(false);
            await loadWorkshops();
        } catch (err) { console.error(err); alert('Failed to save.'); }
        finally { setSaving(false); }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this workshop record?')) return;
        await deleteDoc(doc(db, 'workshops', id));
        await loadWorkshops();
    }

    const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none' };
    const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 as const, color: '#555' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>Workshops & Trainings</h1>
                    <p style={{ color: '#666', margin: 0 }}>Manage attended or organized workshops and training programs</p>
                </div>
                <button onClick={openNew} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #38b2ac, #319795)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
                    <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i> Add Workshop
                </button>
            </div>

            {showForm && (
                <div className="admin-card" style={{ marginBottom: '24px', border: '2px solid #38b2ac' }}>
                    <h3>{editingId ? 'Edit Workshop' : 'New Workshop'}</h3>
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Workshop Title *</label>
                                <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Name of the workshop/training" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Organiser *</label>
                                    <input style={inputStyle} value={form.organiser} onChange={(e) => setForm({ ...form, organiser: e.target.value })} required placeholder="Institution or organization" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Role *</label>
                                    <input style={inputStyle} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required placeholder="e.g. Participant, Resource Person" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Level</label>
                                    <input style={inputStyle} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="e.g. National, Institutional" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Date / Duration *</label>
                                    <input style={inputStyle} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required placeholder="e.g. 2025-05-19" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Year *</label>
                                    <input style={inputStyle} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required placeholder="e.g. 2025" />
                                </div>
                            </div>
                        </div>

                        <div style={{ margin: '20px 0', padding: '15px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #e9ecef' }}>
                            <input 
                                type="checkbox" 
                                id="alsoSharews" 
                                checked={alsoShare} 
                                onChange={(e) => setAlsoShare(e.target.checked)}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="alsoSharews" style={{ fontSize: '14px', fontWeight: 500, color: '#0A66C2', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <i className="fa-brands fa-linkedin" style={{ marginRight: '8px', fontSize: '18px' }}></i>
                                Also share on LinkedIn
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#38b2ac', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
                                {saving ? 'Saving...' : editingId ? 'Update Workshop' : 'Add Workshop'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border" style={{ color: '#38b2ac' }}></div></div>
            ) : workshops.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}>
                    <i className="fa-solid fa-chalkboard-user" style={{ fontSize: '40px', color: '#ddd', marginBottom: '12px' }}></i>
                    <p style={{ color: '#999' }}>No workshops yet. Click &quot;Add Workshop&quot; to get started.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                    {workshops.map((ws) => (
                        <div key={ws.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1a1a2e' }}>{ws.title}</h4>
                                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#666' }}>Role: <b>{ws.role}</b> | Organiser: {ws.organiser}</p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Level: {ws.level} | Date: {ws.date} ({ws.year})</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                                <button onClick={() => openEdit(ws)} style={{ padding: '8px 12px', background: '#e6fffa', border: 'none', borderRadius: '6px', color: '#38b2ac', cursor: 'pointer' }}>
                                    <i className="fa-solid fa-pen"></i>
                                </button>
                                <button onClick={() => handleDelete(ws.id)} style={{ padding: '8px 12px', background: '#fff0f0', border: 'none', borderRadius: '6px', color: '#e53e3e', cursor: 'pointer' }}>
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
