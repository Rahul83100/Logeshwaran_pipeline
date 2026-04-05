'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Conference {
    id: string;
    conference: string;
    role: string;
    presentationTitle: string;
    date: string;
    organiser: string;
    level: string;
    year: string;
}

const emptyConference = { conference: '', role: '', presentationTitle: '', date: '', organiser: '', level: '', year: '' };

export default function ConferencesManagement() {
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyConference);
    const [saving, setSaving] = useState(false);
    const [alsoShare, setAlsoShare] = useState(false);

    useEffect(() => { loadConferences(); }, []);

    async function loadConferences() {
        setLoading(true);
        const snap = await getDocs(collection(db, 'conferences'));
        setConferences(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Conference)));
        setLoading(false);
    }

    function openNew() { setForm(emptyConference); setEditingId(null); setShowForm(true); }

    function openEdit(conf: Conference) {
        setForm({ 
            conference: conf.conference || '', 
            role: conf.role || '', 
            presentationTitle: conf.presentationTitle || '', 
            date: conf.date || '', 
            organiser: conf.organiser || '', 
            level: conf.level || '', 
            year: conf.year || '' 
        });
        setEditingId(conf.id);
        setShowForm(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await updateDoc(doc(db, 'conferences', editingId), { ...form, updated_at: serverTimestamp() });
            } else {
                await addDoc(collection(db, 'conferences'), { ...form, created_at: serverTimestamp() });
            }
            if (alsoShare) {
                const shareUrl = `https://logishoren.com/#academic`;
                const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                window.open(linkedinUrl, '_blank', 'width=600,height=600');
            }
            setShowForm(false);
            setAlsoShare(false);
            await loadConferences();
        } catch (err) { console.error(err); alert('Failed to save.'); }
        finally { setSaving(false); }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this conference record?')) return;
        await deleteDoc(doc(db, 'conferences', id));
        await loadConferences();
    }

    const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none' };
    const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 as const, color: '#555' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>Conferences & Seminars</h1>
                    <p style={{ color: '#666', margin: 0 }}>Manage participations and presentations in conferences</p>
                </div>
                <button onClick={openNew} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #ed8936, #dd6b20)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
                    <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i> Add Conference
                </button>
            </div>

            {showForm && (
                <div className="admin-card" style={{ marginBottom: '24px', border: '2px solid #ed8936' }}>
                    <h3>{editingId ? 'Edit Conference' : 'New Conference'}</h3>
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Conference Name *</label>
                                <input style={inputStyle} value={form.conference} onChange={(e) => setForm({ ...form, conference: e.target.value })} required placeholder="Name of conference/seminar" />
                            </div>
                            <div>
                                <label style={labelStyle}>Presentation Title</label>
                                <input style={inputStyle} value={form.presentationTitle} onChange={(e) => setForm({ ...form, presentationTitle: e.target.value })} placeholder="Title of the paper or presentation" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Role *</label>
                                    <input style={inputStyle} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required placeholder="e.g. Presenter, Keynote Speaker" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Organiser *</label>
                                    <input style={inputStyle} value={form.organiser} onChange={(e) => setForm({ ...form, organiser: e.target.value })} required placeholder="Organising institution" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Level</label>
                                    <input style={inputStyle} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="e.g. International, National" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Date / Duration</label>
                                    <input style={inputStyle} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. 2025-09-17 or Sept 17-19" />
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

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#ed8936', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
                                {saving ? 'Saving...' : editingId ? 'Update Conference' : 'Add Conference'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border" style={{ color: '#ed8936' }}></div></div>
            ) : conferences.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}>
                    <i className="fa-solid fa-microphone-lines" style={{ fontSize: '40px', color: '#ddd', marginBottom: '12px' }}></i>
                    <p style={{ color: '#999' }}>No conferences yet. Click &quot;Add Conference&quot; to get started.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                    {conferences.map((conf) => (
                        <div key={conf.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1a1a2e' }}>{conf.conference}</h4>
                                {conf.presentationTitle && <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#555', fontStyle: 'italic' }}>"{conf.presentationTitle}"</p>}
                                <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#666' }}>Role: <b>{conf.role}</b> | Organiser: {conf.organiser} | {conf.level}</p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Date: {conf.date} ({conf.year})</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                                <button onClick={() => openEdit(conf)} style={{ padding: '8px 12px', background: '#fffaf0', border: 'none', borderRadius: '6px', color: '#ed8936', cursor: 'pointer' }}>
                                    <i className="fa-solid fa-pen"></i>
                                </button>
                                <button onClick={() => handleDelete(conf.id)} style={{ padding: '8px 12px', background: '#fff0f0', border: 'none', borderRadius: '6px', color: '#e53e3e', cursor: 'pointer' }}>
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
