'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ImageUploader from '@/components/admin/ImageUploader';

interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    link: string;
}

const emptyProject = { title: '', category: '', description: '', image: '', link: '' };

export default function ProjectsManagement() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyProject);
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadProjects(); }, []);

    async function loadProjects() {
        setLoading(true);
        const snap = await getDocs(collection(db, 'projects'));
        setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project)));
        setLoading(false);
    }

    function openNew() { setForm(emptyProject); setEditingId(null); setShowForm(true); }

    function openEdit(project: Project) {
        setForm({ title: project.title, category: project.category, description: project.description, image: project.image, link: project.link });
        setEditingId(project.id);
        setShowForm(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await updateDoc(doc(db, 'projects', editingId), { ...form, updated_at: serverTimestamp() });
            } else {
                await addDoc(collection(db, 'projects'), { ...form, created_at: serverTimestamp() });
            }
            setShowForm(false);
            await loadProjects();
        } catch (err) { console.error(err); alert('Failed to save.'); }
        finally { setSaving(false); }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this project?')) return;
        await deleteDoc(doc(db, 'projects', id));
        await loadProjects();
    }

    const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none' };
    const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 as const, color: '#555' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>Portfolio Projects</h1>
                    <p style={{ color: '#666', margin: 0 }}>Manage portfolio projects with images, descriptions, and links</p>
                </div>
                <button onClick={openNew} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
                    <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i> Add Project
                </button>
            </div>

            {showForm && (
                <div className="admin-card" style={{ marginBottom: '24px', border: '2px solid #667eea' }}>
                    <h3>{editingId ? 'Edit Project' : 'New Project'}</h3>
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Title *</label>
                                <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Project title" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Category</label>
                                    <input style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. AI & Healthcare" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Link</label>
                                    <input style={inputStyle} value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
                                </div>
                            </div>
                            <div>
                                <ImageUploader
                                    currentUrl={form.image}
                                    onUrlChange={(url) => setForm({ ...form, image: url })}
                                    storagePath="images/projects"
                                    label="Project Image"
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Description</label>
                                <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of the project" />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
                                {saving ? 'Saving...' : editingId ? 'Update Project' : 'Add Project'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border text-primary"></div></div>
            ) : projects.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}>
                    <i className="fa-solid fa-images" style={{ fontSize: '40px', color: '#ddd', marginBottom: '12px' }}></i>
                    <p style={{ color: '#999' }}>No projects yet. Click &quot;Add Project&quot; to get started.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {projects.map((project) => (
                        <div key={project.id} className="admin-card" style={{ overflow: 'hidden' }}>
                            {project.image && (
                                <div style={{ marginBottom: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                                    <img src={project.image} alt={project.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                                </div>
                            )}
                            <h4 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1a1a2e' }}>{project.title}</h4>
                            <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#888' }}>{project.category}</p>
                            <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#666', lineHeight: 1.4 }}>{project.description?.substring(0, 100)}{project.description?.length > 100 ? '...' : ''}</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => openEdit(project)} style={{ padding: '6px 14px', background: '#f0f0ff', border: 'none', borderRadius: '6px', color: '#667eea', cursor: 'pointer', fontSize: '13px' }}>
                                    <i className="fa-solid fa-pen" style={{ marginRight: '4px' }}></i> Edit
                                </button>
                                <button onClick={() => handleDelete(project.id)} style={{ padding: '6px 14px', background: '#fff0f0', border: 'none', borderRadius: '6px', color: '#e53e3e', cursor: 'pointer', fontSize: '13px' }}>
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
