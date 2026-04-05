'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ImageUploader from '@/components/admin/ImageUploader';

interface LatestService {
    id: string;
    order: number;
    title: string;
    description: string;
}

const emptyService = { title: '', description: '', order: 0 };

export default function LatestServicesManagement() {
    const [services, setServices] = useState<LatestService[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Global Config State
    const [globalConfig, setGlobalConfig] = useState({
        latestServiceTitle: '',
        latestServiceDescription: '',
        latestServiceImage: '',
    });
    const [savingGlobal, setSavingGlobal] = useState(false);

    // CRUD State
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyService);
    const [saving, setSaving] = useState(false);

    useEffect(() => { 
        loadData(); 
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            // Load Global Config
            const profileSnap = await getDoc(doc(db, 'profile', 'main'));
            if (profileSnap.exists()) {
                const pData = profileSnap.data();
                setGlobalConfig({
                    latestServiceTitle: pData.latestServiceTitle || '',
                    latestServiceDescription: pData.latestServiceDescription || '',
                    latestServiceImage: pData.latestServiceImage || '',
                });
            }

            // Load Services
            const snap = await getDocs(collection(db, 'latest_services'));
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as LatestService));
            list.sort((a, b) => (a.order || 0) - (b.order || 0));
            setServices(list);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }

    async function handleSaveGlobal(e: React.FormEvent) {
        e.preventDefault();
        setSavingGlobal(true);
        try {
            await updateDoc(doc(db, 'profile', 'main'), {
                latestServiceTitle: globalConfig.latestServiceTitle,
                latestServiceDescription: globalConfig.latestServiceDescription,
                latestServiceImage: globalConfig.latestServiceImage,
            });
            alert('Global configuration saved successfully.');
        } catch (err) {
            console.error('Failed to save global config', err);
            alert('Failed to save global config.');
        } finally {
            setSavingGlobal(false);
        }
    }

    function openNew() { setForm(emptyService); setEditingId(null); setShowForm(true); }

    function openEdit(service: LatestService) {
        setForm({ title: service.title, description: service.description, order: service.order || 0 });
        setEditingId(service.id);
        setShowForm(true);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await updateDoc(doc(db, 'latest_services', editingId), { 
                    ...form, 
                    order: Number(form.order) 
                });
            } else {
                await addDoc(collection(db, 'latest_services'), { 
                    ...form, 
                    order: Number(form.order),
                    created_at: serverTimestamp() 
                });
            }
            setShowForm(false);
            await loadData();
        } catch (err) { 
            console.error(err); 
            alert('Failed to save service.'); 
        } finally { 
            setSaving(false); 
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this service?')) return;
        await deleteDoc(doc(db, 'latest_services', id));
        await loadData();
    }

    const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none' };
    const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 as const, color: '#555' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>Latest Services</h1>
                    <p style={{ color: '#666', margin: 0 }}>Manage the Latest Services section and its global configuration</p>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border text-primary"></div></div>
            ) : (
                <>
                    {/* Global Configuration Card */}
                    <div className="admin-card" style={{ marginBottom: '32px', border: '1px solid #eee' }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <i className="fa-solid fa-gear" style={{ marginRight: '8px', color: '#667eea' }}></i>
                            Global Section Layout Config
                        </h3>
                        <form onSubmit={handleSaveGlobal}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={labelStyle}>Section Heading Text</label>
                                        <textarea 
                                            style={{ ...inputStyle, height: '80px', resize: 'vertical' }} 
                                            value={globalConfig.latestServiceTitle} 
                                            onChange={(e) => setGlobalConfig({ ...globalConfig, latestServiceTitle: e.target.value })} 
                                            placeholder="Leave empty for default: Inspiring The World One Project" 
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Section Description Paragraph</label>
                                        <textarea 
                                            style={{ ...inputStyle, height: '100px', resize: 'vertical' }} 
                                            value={globalConfig.latestServiceDescription} 
                                            onChange={(e) => setGlobalConfig({ ...globalConfig, latestServiceDescription: e.target.value })} 
                                            placeholder="Leave empty for default text" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <ImageUploader
                                        currentUrl={globalConfig.latestServiceImage}
                                        onUrlChange={(url) => setGlobalConfig({ ...globalConfig, latestServiceImage: url })}
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

                    {/* Services Items Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0 }}>Service Items ({services.length})</h3>
                        <button onClick={openNew} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #764ba2, #667eea)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>
                            <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i> Add Service Item
                        </button>
                    </div>

                    {/* Add/Edit Form */}
                    {showForm && (
                        <div className="admin-card" style={{ marginBottom: '24px', border: '2px solid #667eea' }}>
                            <h3>{editingId ? 'Edit Service Item' : 'New Service Item'}</h3>
                            <form onSubmit={handleSave}>
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '4fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={labelStyle}>Title *</label>
                                            <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Service title e.g. 5G Architecture Design" />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Order / Number</label>
                                            <input type="number" style={inputStyle} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Description</label>
                                        <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of the service" required />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                    <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
                                        {saving ? 'Saving...' : editingId ? 'Update Item' : 'Add Item'}
                                    </button>
                                    <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Services List */}
                    {services.length === 0 ? (
                        <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}>
                            <i className="fa-solid fa-list" style={{ fontSize: '40px', color: '#ddd', marginBottom: '12px' }}></i>
                            <p style={{ color: '#999' }}>No service items yet. Click &quot;Add Service Item&quot; to populate the list.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {services.map((service, index) => (
                                <div key={service.id} className="admin-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1a1a2e' }}>
                                            <span style={{ color: '#667eea', marginRight: '8px' }}>{String(index + 1).padStart(2, '0')}.</span>
                                            {service.title}
                                        </h4>
                                        <p style={{ margin: '0', fontSize: '13px', color: '#666' }}>{service.description}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => openEdit(service)} style={{ padding: '6px 14px', background: '#f0f0ff', border: 'none', borderRadius: '6px', color: '#667eea', cursor: 'pointer', fontSize: '13px' }}>
                                            <i className="fa-solid fa-pen"></i> Edit
                                        </button>
                                        <button onClick={() => handleDelete(service.id)} style={{ padding: '6px 14px', background: '#fff0f0', border: 'none', borderRadius: '6px', color: '#e53e3e', cursor: 'pointer', fontSize: '13px' }}>
                                            <i className="fa-solid fa-trash"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
