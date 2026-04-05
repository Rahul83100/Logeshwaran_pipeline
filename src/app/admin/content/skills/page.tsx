'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Skill {
    id: string;
    name: string;
    category: string;
    percentage: number;
    order: number;
    icon?: string;
    projectCount?: number;
}

const emptySkill = { name: '', category: 'development', percentage: 80, order: 0, icon: 'fa-light fa-gear', projectCount: 0 };
const categories = ['development', 'design', 'research', 'other'];

export default function SkillsManagement() {
    const [items, setItems] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptySkill);
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadItems(); }, []);

    async function loadItems() {
        setLoading(true);
        const q = query(collection(db, 'skills'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Skill)));
        setLoading(false);
    }

    function openNew() { setForm({ ...emptySkill, order: items.length }); setEditingId(null); setShowForm(true); }
    function openEdit(item: Skill) {
        setForm({ 
            name: item.name, 
            category: item.category, 
            percentage: item.percentage ?? (item as any).proficiency ?? 0, 
            order: item.order,
            icon: item.icon || 'fa-light fa-gear',
            projectCount: item.projectCount || 0
        });
        setEditingId(item.id); setShowForm(true);
    }

    const [alsoShare, setAlsoShare] = useState(false);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault(); setSaving(true);
        try {
            let savedId = editingId;
            if (editingId) { await updateDoc(doc(db, 'skills', editingId), { ...form, updated_at: serverTimestamp() }); }
            else { 
                const docRef = await addDoc(collection(db, 'skills'), { ...form, created_at: serverTimestamp() }); 
                savedId = docRef.id;
            }

            if (alsoShare && savedId) {
                const shareUrl = `https://logishoren.com/skills/${savedId}`;
                const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                window.open(linkedinUrl, '_blank', 'width=600,height=600');
            }

            setShowForm(false); 
            setAlsoShare(false);
            await loadItems();
        } catch (err) { console.error(err); alert('Failed to save.'); }
        finally { setSaving(false); }
    }

    async function handleDelete(id: string) { if (!confirm('Delete this skill?')) return; await deleteDoc(doc(db, 'skills', id)); await loadItems(); }

    const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none' };
    const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 as const, color: '#555' };

    // Group skills by category
    const grouped = items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, Skill[]>);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>Skills</h1>
                    <p style={{ color: '#666', margin: 0 }}>Manage expertise areas and proficiency levels</p>
                </div>
                <button onClick={openNew} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
                    <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i> Add Skill
                </button>
            </div>

            {showForm && (
                <div className="admin-card" style={{ marginBottom: '24px', border: '2px solid #667eea' }}>
                    <h3>{editingId ? 'Edit Skill' : 'Add Skill'}</h3>
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div><label style={labelStyle}>Skill Name *</label><input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Machine Learning" /></div>
                            <div>
                                <label style={labelStyle}>Category</label>
                                <select style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Proficiency ({form.percentage}%)</label>
                                <input type="range" min="0" max="100" value={form.percentage} onChange={(e) => setForm({ ...form, percentage: parseInt(e.target.value) })} style={{ width: '100%' }} />
                            </div>
                            <div><label style={labelStyle}>Display Order</label><input style={inputStyle} type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })} /></div>
                            <div><label style={labelStyle}>Icon Class (FontAwesome)</label><input style={inputStyle} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="e.g. fa-light fa-microchip" /></div>
                            <div><label style={labelStyle}>Project Count</label><input style={inputStyle} type="number" value={form.projectCount} onChange={(e) => setForm({ ...form, projectCount: parseInt(e.target.value) })} /></div>
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
                <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}><p style={{ color: '#999' }}>No skills added. Click &quot;Add Skill&quot; to start.</p></div>
            ) : (
                Object.entries(grouped).map(([category, skills]) => (
                    <div key={category} style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '16px', color: '#666', marginBottom: '12px' }}>{category}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {skills.map((item) => (
                                <div key={item.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '15px', fontWeight: 500 }}>{item.name}</span>
                                            <div style={{ flex: 1, maxWidth: '200px', height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${item.percentage}%`, height: '100%', background: 'linear-gradient(90deg, #667eea, #764ba2)', borderRadius: '3px' }}></div>
                                            </div>
                                            <span style={{ fontSize: '13px', color: '#888' }}>{item.percentage}%</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => openEdit(item)} style={{ padding: '6px 14px', background: '#f0f0ff', border: 'none', borderRadius: '6px', color: '#667eea', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                                        <button onClick={() => handleDelete(item.id)} style={{ padding: '6px 14px', background: '#fff0f0', border: 'none', borderRadius: '6px', color: '#e53e3e', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
