'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ImageUploader from '@/components/admin/ImageUploader';

interface Experience {
    id: string;
    role: string;
    organization: string;
    year_range: string;
    description: string;
    order: number;
}

const emptyExp = { role: '', organization: '', year_range: '', description: '', order: 0 };

export default function ExperienceManagement() {
    const [items, setItems] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyExp);
    const [saving, setSaving] = useState(false);
    
    // Global Config State
    const [globalConfig, setGlobalConfig] = useState({ experienceImage: '' });
    const [savingGlobal, setSavingGlobal] = useState(false);

    useEffect(() => { loadItems(); }, []);

    async function loadItems() {
        setLoading(true);
        try {
            const profileSnap = await getDoc(doc(db, 'profile', 'main'));
            if (profileSnap.exists()) {
                setGlobalConfig({ experienceImage: profileSnap.data().experienceImage || '' });
            }
            
            const q = query(collection(db, 'experience'), orderBy('order', 'asc'));
            const snap = await getDocs(q);
            setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Experience)));
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }

    async function handleSaveGlobal(e: React.FormEvent) {
        e.preventDefault();
        setSavingGlobal(true);
        try {
            await updateDoc(doc(db, 'profile', 'main'), { experienceImage: globalConfig.experienceImage });
            alert('Global configuration saved successfully.');
        } catch (err) {
            console.error('Failed to save global config', err);
            alert('Failed to save global config.');
        } finally {
            setSavingGlobal(false);
        }
    }

    function openNew() { setForm({ ...emptyExp, order: items.length }); setEditingId(null); setShowForm(true); }
    function openEdit(item: Experience) {
        setForm({ role: item.role, organization: item.organization, year_range: item.year_range, description: item.description, order: item.order });
        setEditingId(item.id); setShowForm(true);
    }

    const [alsoShare, setAlsoShare] = useState(false);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault(); setSaving(true);
        try {
            let savedId = editingId;
            if (editingId) { await updateDoc(doc(db, 'experience', editingId), { ...form, updated_at: serverTimestamp() }); }
            else { 
                const docRef = await addDoc(collection(db, 'experience'), { ...form, created_at: serverTimestamp() }); 
                savedId = docRef.id;
            }

            if (alsoShare && savedId) {
                const shareUrl = `https://logishoren.com/experience/${savedId}`;
                const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                window.open(linkedinUrl, '_blank', 'width=600,height=600');
            }

            setShowForm(false); 
            setAlsoShare(false);
            await loadItems();
        } catch (err) { console.error(err); alert('Failed to save.'); }
        finally { setSaving(false); }
    }

    async function handleDelete(id: string) { if (!confirm('Delete this entry?')) return; await deleteDoc(doc(db, 'experience', id)); await loadItems(); }

    const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none' };
    const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 as const, color: '#555' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>Experience</h1>
                    <p style={{ color: '#666', margin: 0 }}>Manage work experience and professional roles</p>
                </div>
                <button onClick={openNew} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
                    <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i> Add Experience
                </button>
            </div>

            {!loading && (
                <div className="admin-card" style={{ marginBottom: '32px', border: '1px solid #eee' }}>
                    <h3 style={{ marginBottom: '16px', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <i className="fa-solid fa-gear" style={{ marginRight: '8px', color: '#667eea' }}></i>
                        Global Section Layout Config
                    </h3>
                    <form onSubmit={handleSaveGlobal}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                            <div>
                                <ImageUploader
                                    currentUrl={globalConfig.experienceImage}
                                    onUrlChange={(url) => setGlobalConfig({ ...globalConfig, experienceImage: url })}
                                    storagePath="images/layout"
                                    label="Right-Side Feature Image (Leave empty for default)"
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                            <button type="submit" disabled={savingGlobal} style={{ padding: '10px 24px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
                                {savingGlobal ? 'Saving Layout...' : 'Save Configuration'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showForm && (
                <div className="admin-card" style={{ marginBottom: '24px', border: '2px solid #667eea' }}>
                    <h3>{editingId ? 'Edit Experience' : 'Add Experience'}</h3>
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div><label style={labelStyle}>Role / Position *</label><input style={inputStyle} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required placeholder="e.g. Associate Professor" /></div>
                            <div><label style={labelStyle}>Organization *</label><input style={inputStyle} value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} required placeholder="e.g. Christ University" /></div>
                            <div><label style={labelStyle}>Year Range</label><input style={inputStyle} value={form.year_range} onChange={(e) => setForm({ ...form, year_range: e.target.value })} placeholder="e.g. 2020-Present" /></div>
                            <div><label style={labelStyle}>Display Order</label><input style={inputStyle} type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })} /></div>
                            <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of responsibilities" /></div>
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
                <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}><p style={{ color: '#999' }}>No experience entries. Add one to get started.</p></div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {items.map((item) => (
                        <div key={item.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>{item.role}</h4>
                                <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{item.organization}{item.year_range && ` · ${item.year_range}`}</p>
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
