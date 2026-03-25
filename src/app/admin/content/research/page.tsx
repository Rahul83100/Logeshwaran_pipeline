'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Paper {
    id: string;
    title: string;
    abstract: string;
    authors: string;
    journal: string;
    year: number;
    doi: string;
    pdf_url: string;
    is_private: boolean;
}

const emptyPaper = { title: '', abstract: '', authors: '', journal: '', year: new Date().getFullYear(), doi: '', pdf_url: '', is_private: false };

export default function ResearchManagement() {
    const [papers, setPapers] = useState<Paper[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyPaper);
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadPapers(); }, []);

    async function loadPapers() {
        setLoading(true);
        const q = query(collection(db, 'research_papers'), orderBy('year', 'desc'));
        const snap = await getDocs(q);
        setPapers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Paper)));
        setLoading(false);
    }

    function openNew() {
        setForm(emptyPaper);
        setEditingId(null);
        setShowForm(true);
    }

    function openEdit(paper: Paper) {
        setForm({ title: paper.title, abstract: paper.abstract, authors: paper.authors, journal: paper.journal, year: paper.year, doi: paper.doi, pdf_url: paper.pdf_url, is_private: paper.is_private });
        setEditingId(paper.id);
        setShowForm(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await updateDoc(doc(db, 'research_papers', editingId), { ...form, updated_at: serverTimestamp() });
            } else {
                await addDoc(collection(db, 'research_papers'), { ...form, created_at: serverTimestamp() });
            }
            setShowForm(false);
            await loadPapers();
        } catch (err) {
            console.error('Save error:', err);
            alert('Failed to save. Check console for details.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this research paper?')) return;
        await deleteDoc(doc(db, 'research_papers', id));
        await loadPapers();
    }

    const inputStyle = {
        width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px',
        fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none',
    };

    const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 as const, color: '#555' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>Research Papers</h1>
                    <p style={{ color: '#666', margin: 0 }}>Manage published research papers and journal articles</p>
                </div>
                <button onClick={openNew} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
                    <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i> Add Paper
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="admin-card" style={{ marginBottom: '24px', border: '2px solid #667eea' }}>
                    <h3>{editingId ? 'Edit Research Paper' : 'Add New Research Paper'}</h3>
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Title *</label>
                                <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Research paper title" />
                            </div>
                            <div>
                                <label style={labelStyle}>Authors *</label>
                                <input style={inputStyle} value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })} required placeholder="e.g. Logishoren, A. Kumar, B. Singh" />
                            </div>
                            <div>
                                <label style={labelStyle}>Journal / Conference</label>
                                <input style={inputStyle} value={form.journal} onChange={(e) => setForm({ ...form, journal: e.target.value })} placeholder="e.g. IEEE Transactions" />
                            </div>
                            <div>
                                <label style={labelStyle}>Year *</label>
                                <input style={inputStyle} type="number" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })} required />
                            </div>
                            <div>
                                <label style={labelStyle}>DOI</label>
                                <input style={inputStyle} value={form.doi} onChange={(e) => setForm({ ...form, doi: e.target.value })} placeholder="e.g. 10.1109/..." />
                            </div>
                            <div>
                                <label style={labelStyle}>PDF URL</label>
                                <input style={inputStyle} value={form.pdf_url} onChange={(e) => setForm({ ...form, pdf_url: e.target.value })} placeholder="Link to the paper PDF" />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="checkbox" id="is_private" checked={form.is_private} onChange={(e) => setForm({ ...form, is_private: e.target.checked })} />
                                <label htmlFor="is_private" style={{ fontSize: '14px', color: '#555' }}>🔒 Private (requires access code to view)</label>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Abstract</label>
                                <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} placeholder="Brief description of the paper" />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
                                {saving ? 'Saving...' : editingId ? 'Update Paper' : 'Add Paper'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Papers List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border text-primary"></div></div>
            ) : papers.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}>
                    <i className="fa-solid fa-flask" style={{ fontSize: '40px', color: '#ddd', marginBottom: '12px' }}></i>
                    <p style={{ color: '#999' }}>No research papers yet. Click &quot;Add Paper&quot; to get started.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {papers.map((paper) => (
                        <div key={paper.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                    <h4 style={{ margin: 0, fontSize: '16px', color: '#1a1a2e' }}>{paper.title}</h4>
                                    {paper.is_private && <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 500 }}>🔒 Private</span>}
                                </div>
                                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#888' }}>{paper.authors}</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#aaa' }}>
                                    {paper.journal && `${paper.journal} · `}{paper.year}
                                    {paper.doi && ` · DOI: ${paper.doi}`}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                <button onClick={() => openEdit(paper)} style={{ padding: '6px 14px', background: '#f0f0ff', border: 'none', borderRadius: '6px', color: '#667eea', cursor: 'pointer', fontSize: '13px' }}>
                                    <i className="fa-solid fa-pen" style={{ marginRight: '4px' }}></i> Edit
                                </button>
                                <button onClick={() => handleDelete(paper.id)} style={{ padding: '6px 14px', background: '#fff0f0', border: 'none', borderRadius: '6px', color: '#e53e3e', cursor: 'pointer', fontSize: '13px' }}>
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
