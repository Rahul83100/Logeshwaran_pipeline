'use client';

import { useState, useEffect } from 'react';
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/admin/ImageUploader';
import { use } from 'react';

interface FieldDef {
    name: string;
    label: string;
    type: string;
}

interface SectionDef {
    label: string;
    sectionId: string;
    firestoreCollection: string;
    fields: FieldDef[];
}

export default function CustomSectionEditor({ params }: { params: Promise<{ sectionId: string }> }) {
    const { sectionId } = use(params);
    const router = useRouter();
    const [sectionDef, setSectionDef] = useState<SectionDef | null>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                // Find section definition
                const defSnap = await getDocs(query(collection(db, 'navbar_sections'), where('sectionId', '==', sectionId)));
                if (defSnap.empty) {
                    router.push('/admin/content');
                    return;
                }
                const def = defSnap.docs[0].data() as SectionDef;
                setSectionDef(def);

                // Load items
                if (def.firestoreCollection) {
                    const itemsSnap = await getDocs(collection(db, def.firestoreCollection));
                    setItems(itemsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
                }
            } catch (err) {
                console.error('Failed to load dynamic section:', err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [sectionId, router]);

    const handleOpenForm = (item?: any) => {
        if (item) {
            setEditingId(item.id);
            setFormData({ ...item });
        } else {
            setEditingId(null);
            setFormData({});
        }
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({});
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sectionDef?.firestoreCollection) return;
        setSaving(true);
        try {
            if (editingId) {
                await updateDoc(doc(db, sectionDef.firestoreCollection, editingId), {
                    ...formData,
                    updated_at: serverTimestamp()
                });
                setItems(prev => prev.map(item => item.id === editingId ? { ...formData, id: editingId } : item));
            } else {
                const docRef = await addDoc(collection(db, sectionDef.firestoreCollection), {
                    ...formData,
                    created_at: serverTimestamp()
                });
                setItems(prev => [{ ...formData, id: docRef.id }, ...prev]);
            }
            handleCloseForm();
        } catch (err) {
            console.error('Failed to save item:', err);
            alert('Failed to save item');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!sectionDef?.firestoreCollection) return;
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            await deleteDoc(doc(db, sectionDef.firestoreCollection, id));
            setItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete item');
        }
    };

    const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#fff' };
    const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600, color: '#333' };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '60px' }}><i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px', color: '#667eea' }}></i></div>;
    }

    if (!sectionDef) return null;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <Link href="/admin/content" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                        <i className="fa-solid fa-arrow-left" style={{ marginRight: '6px' }}></i> Back to Content
                    </Link>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, color: '#1a1a2e' }}>{sectionDef.label} Content</h1>
                    <p style={{ color: '#888', margin: '4px 0 0', fontSize: '14px' }}>Add or edit items for this custom section.</p>
                </div>
                {!showForm && (
                    <button onClick={() => handleOpenForm()} style={{ padding: '10px 20px', background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                        <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i> Add New Item
                    </button>
                )}
            </div>

            {showForm && (
                <div className="admin-card" style={{ marginBottom: '32px', borderLeft: '4px solid #667eea' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '20px', margin: 0, color: '#1a1a2e' }}>{editingId ? 'Edit Item' : 'Add New Item'}</h2>
                        <button type="button" onClick={handleCloseForm} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}><i className="fa-solid fa-times"></i></button>
                    </div>
                    
                    <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        {sectionDef.fields.map(field => {
                            const isFullWidth = field.type === 'textarea' || field.type === 'image';
                            return (
                                <div key={field.name} style={{ gridColumn: isFullWidth ? '1 / -1' : 'auto' }}>
                                    <label style={labelStyle}>{field.label}</label>
                                    
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            value={formData[field.name] || ''}
                                            onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                                            style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                                        />
                                    ) : field.type === 'image' ? (
                                        <ImageUploader
                                            currentUrl={formData[field.name] || ''}
                                            onUrlChange={url => setFormData({ ...formData, [field.name]: url })}
                                            storagePath={`images/${sectionDef.firestoreCollection}`}
                                            label={`Upload ${field.label}`}
                                        />
                                    ) : (
                                        <input
                                            type={field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'}
                                            value={formData[field.name] || ''}
                                            onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                                            style={inputStyle}
                                        />
                                    )}
                                </div>
                            );
                        })}
                        
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '12px' }}>
                            <button type="submit" disabled={saving} style={{ padding: '12px 24px', background: '#e60000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                {saving ? 'Saving...' : 'Save Item'}
                            </button>
                            <button type="button" onClick={handleCloseForm} disabled={saving} style={{ padding: '12px 24px', background: '#f5f5f5', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                {items.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                        <p>No items found in {sectionDef.label}.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <tr>
                                    {sectionDef.fields.filter(f => f.type !== 'image' && f.type !== 'textarea').slice(0, 3).map(f => (
                                        <th key={f.name} style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#4a5568' }}>{f.label}</th>
                                    ))}
                                    <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#4a5568' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        {sectionDef.fields.filter(f => f.type !== 'image' && f.type !== 'textarea').slice(0, 3).map(f => (
                                            <td key={f.name} style={{ padding: '16px 20px', color: '#1a1a2e', fontSize: '14px' }}>
                                                {item[f.name] || <span style={{ color: '#aaa', fontStyle: 'italic' }}>empty</span>}
                                            </td>
                                        ))}
                                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                            <button onClick={() => handleOpenForm(item)} style={{ background: '#f0f4f8', color: '#4a5568', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', fontSize: '13px' }}>
                                                <i className="fa-solid fa-pen"></i> Edit
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} style={{ background: '#fff5f5', color: '#e53e3e', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                                                <i className="fa-solid fa-trash"></i> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
