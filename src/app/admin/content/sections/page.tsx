'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const MAX_NAVBAR_SECTIONS = 8;

interface NavSection {
    id: string;
    label: string;
    sectionId: string;
    showInNavbar: boolean;
    isNew: boolean;
    order: number;
    isCustom: boolean;
    firestoreCollection: string;
    fields: { name: string; label: string; type: string }[];
}

const DEFAULT_SECTIONS: Omit<NavSection, 'id'>[] = [
    { label: 'Profile', sectionId: 'profile', showInNavbar: true, isNew: false, order: 0, isCustom: false, firestoreCollection: '', fields: [] },
    { label: 'Journals', sectionId: 'articles', showInNavbar: true, isNew: false, order: 1, isCustom: false, firestoreCollection: 'research_papers', fields: [] },
    { label: 'Books', sectionId: 'books', showInNavbar: true, isNew: false, order: 2, isCustom: false, firestoreCollection: 'books', fields: [] },
    { label: 'Conferences', sectionId: 'conferences', showInNavbar: true, isNew: false, order: 3, isCustom: false, firestoreCollection: 'conferences', fields: [] },
    { label: 'Patents', sectionId: 'patents', showInNavbar: true, isNew: false, order: 4, isCustom: false, firestoreCollection: 'patents', fields: [] },
    { label: 'Projects', sectionId: 'projects', showInNavbar: true, isNew: false, order: 5, isCustom: false, firestoreCollection: 'projects', fields: [] },
    { label: 'Workshops', sectionId: 'workshops', showInNavbar: true, isNew: false, order: 6, isCustom: false, firestoreCollection: 'workshops', fields: [] },
    { label: 'Awards', sectionId: 'awards', showInNavbar: true, isNew: false, order: 7, isCustom: false, firestoreCollection: 'awards', fields: [] },
];

export default function SectionsManagement() {
    const [sections, setSections] = useState<NavSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newSection, setNewSection] = useState({ label: '', sectionId: '', showInNavbar: false, isNew: true });
    const [newFields, setNewFields] = useState<{ name: string; label: string; type: string }[]>([
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
    ]);
    const [saving, setSaving] = useState(false);

    const loadSections = async () => {
        setLoading(true);
        try {
            const colRef = collection(db, 'navbar_sections');
            const snap = await getDocs(query(colRef, orderBy('order', 'asc')));

            if (snap.empty) {
                // Seed default sections
                for (const sec of DEFAULT_SECTIONS) {
                    await addDoc(colRef, sec);
                }
                const snap2 = await getDocs(query(colRef, orderBy('order', 'asc')));
                setSections(snap2.docs.map(d => ({ id: d.id, ...d.data() } as NavSection)));
            } else {
                setSections(snap.docs.map(d => ({ id: d.id, ...d.data() } as NavSection)));
            }
        } catch (err) {
            console.error('Failed to load sections:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadSections(); }, []);

    const navbarSections = sections.filter(s => s.showInNavbar);
    const menuOnlySections = sections.filter(s => !s.showInNavbar);
    const navbarFull = navbarSections.length >= MAX_NAVBAR_SECTIONS;

    const toggleField = async (id: string, field: 'showInNavbar' | 'isNew', currentValue: boolean) => {
        // Enforce limit: prevent adding more than MAX to navbar
        if (field === 'showInNavbar' && !currentValue && navbarFull) {
            alert(`Navbar can only have ${MAX_NAVBAR_SECTIONS} sections. Move one to the menu first.`);
            return;
        }
        try {
            await updateDoc(doc(db, 'navbar_sections', id), { [field]: !currentValue });
            setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: !currentValue } : s));
        } catch (err) {
            console.error('Failed to update:', err);
        }
    };

    const updateOrder = async (id: string, newOrder: number) => {
        try {
            await updateDoc(doc(db, 'navbar_sections', id), { order: newOrder });
            setSections(prev => prev.map(s => s.id === id ? { ...s, order: newOrder } : s).sort((a, b) => a.order - b.order));
        } catch (err) {
            console.error('Failed to update order:', err);
        }
    };

    const handleResetSections = async () => {
        if (!confirm('This will remove ALL duplicates and re-seed the 8 default sections. Custom sections will be preserved. Continue?')) return;
        setLoading(true);
        try {
            const colRef = collection(db, 'navbar_sections');
            const snap = await getDocs(colRef);
            
            // Separate custom from built-in, and deduplicate built-in by sectionId
            const customSections: any[] = [];
            const builtInSeen = new Set<string>();
            const toDelete: string[] = [];

            for (const d of snap.docs) {
                const data = d.data();
                if (data.isCustom) {
                    customSections.push({ id: d.id, ...data });
                } else {
                    if (builtInSeen.has(data.sectionId)) {
                        toDelete.push(d.id); // duplicate
                    } else {
                        builtInSeen.add(data.sectionId);
                        toDelete.push(d.id); // will re-seed cleanly
                    }
                }
            }

            // Delete all built-in (including duplicates)
            for (const id of toDelete) {
                await deleteDoc(doc(db, 'navbar_sections', id));
            }

            // Re-seed defaults
            for (const sec of DEFAULT_SECTIONS) {
                await addDoc(colRef, sec);
            }

            await loadSections();
            alert('Sections reset successfully! Duplicates removed.');
        } catch (err) {
            console.error('Reset failed:', err);
            alert('Error resetting sections.');
            setLoading(false);
        }
    };

    const handleAddSection = async () => {
        if (!newSection.label.trim() || !newSection.sectionId.trim()) {
            alert('Please fill in the section name and ID.');
            return;
        }
        // Check if adding to navbar would exceed limit
        const willBeInNavbar = newSection.showInNavbar;
        if (willBeInNavbar && navbarFull) {
            alert(`Navbar already has ${MAX_NAVBAR_SECTIONS} sections. The new section will be added to the menu only. Move a section out of the navbar first to make room.`);
            setNewSection({ ...newSection, showInNavbar: false });
            return;
        }
        setSaving(true);
        try {
            const collectionName = newSection.sectionId.toLowerCase().replace(/\s+/g, '_') + '_items';
            const maxOrder = sections.length > 0 ? Math.max(...sections.map(s => s.order)) : -1;
            const docData = {
                label: newSection.label.trim(),
                sectionId: newSection.sectionId.toLowerCase().replace(/\s+/g, '-'),
                showInNavbar: newSection.showInNavbar,
                isNew: newSection.isNew,
                order: maxOrder + 1,
                isCustom: true,
                firestoreCollection: collectionName,
                fields: newFields.filter(f => f.name.trim() && f.label.trim()),
            };
            await addDoc(collection(db, 'navbar_sections'), docData);
            setShowAddForm(false);
            setNewSection({ label: '', sectionId: '', showInNavbar: false, isNew: true });
            setNewFields([{ name: 'title', label: 'Title', type: 'text' }, { name: 'description', label: 'Description', type: 'textarea' }]);
            await loadSections();
        } catch (err) {
            console.error('Failed to add section:', err);
            alert('Error adding section.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSection = async (id: string, label: string) => {
        if (!confirm(`Are you sure you want to delete the "${label}" section? This won't delete the content data.`)) return;
        try {
            await deleteDoc(doc(db, 'navbar_sections', id));
            setSections(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

    const addField = () => {
        setNewFields(prev => [...prev, { name: '', label: '', type: 'text' }]);
    };

    const removeField = (idx: number) => {
        setNewFields(prev => prev.filter((_, i) => i !== idx));
    };

    const updateField = (idx: number, key: string, value: string) => {
        setNewFields(prev => prev.map((f, i) => i === idx ? { ...f, [key]: value } : f));
    };

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px', color: '#667eea' }}></i>
                <p style={{ marginTop: '12px', color: '#888' }}>Loading sections...</p>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <Link href="/admin/content" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                        <i className="fa-solid fa-arrow-left" style={{ marginRight: '6px' }}></i> Back to Content
                    </Link>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, color: '#1a1a2e' }}>Navbar Sections</h1>
                    <p style={{ color: '#888', margin: '4px 0 0', fontSize: '14px' }}>
                        Control which sections appear in the navbar (max {MAX_NAVBAR_SECTIONS}) vs. only in the menu icon
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleResetSections}
                        style={{ padding: '10px 20px', background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
                    >
                        <i className="fa-solid fa-rotate" style={{ marginRight: '6px' }}></i>
                        Fix Duplicates & Reset
                    </button>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        style={{ padding: '10px 20px', background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
                    >
                        <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i>
                        {showAddForm ? 'Cancel' : 'Add Custom Section'}
                    </button>
                </div>
            </div>

            {/* Add Section Form */}
            {showAddForm && (
                <div className="admin-card" style={{ marginBottom: '24px', border: '2px solid #667eea' }}>
                    <h3 style={{ margin: '0 0 20px', color: '#1a1a2e', fontSize: '18px' }}>
                        <i className="fa-solid fa-plus-circle" style={{ marginRight: '8px', color: '#667eea' }}></i>
                        New Custom Section
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', color: '#333', fontSize: '14px' }}>Section Name</label>
                            <input
                                type="text"
                                value={newSection.label}
                                onChange={(e) => setNewSection({ ...newSection, label: e.target.value, sectionId: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                placeholder="e.g. Credits"
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', color: '#333', fontSize: '14px' }}>Section ID (auto-generated)</label>
                            <input
                                type="text"
                                value={newSection.sectionId}
                                onChange={(e) => setNewSection({ ...newSection, sectionId: e.target.value })}
                                placeholder="e.g. credits"
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', background: '#f7f7f7' }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                            <input
                                type="checkbox"
                                checked={newSection.showInNavbar}
                                onChange={(e) => setNewSection({ ...newSection, showInNavbar: e.target.checked })}
                                disabled={navbarFull && !newSection.showInNavbar}
                            />
                            Show in Navbar {navbarFull ? `(full — ${MAX_NAVBAR_SECTIONS}/${MAX_NAVBAR_SECTIONS})` : `(${navbarSections.length}/${MAX_NAVBAR_SECTIONS})`}
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                            <input type="checkbox" checked={newSection.isNew} onChange={(e) => setNewSection({ ...newSection, isNew: e.target.checked })} />
                            Show &quot;NEW&quot; Badge
                        </label>
                    </div>

                    <h4 style={{ margin: '0 0 12px', color: '#1a1a2e', fontSize: '16px' }}>Content Fields</h4>
                    <p style={{ color: '#888', fontSize: '13px', margin: '0 0 12px' }}>Define the input fields for content items in this section.</p>
                    {newFields.map((field, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={field.label}
                                onChange={(e) => updateField(idx, 'label', e.target.value)}
                                placeholder="Field Label (e.g. Title)"
                                style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }}
                            />
                            <input
                                type="text"
                                value={field.name}
                                onChange={(e) => updateField(idx, 'name', e.target.value)}
                                placeholder="Field Key (e.g. title)"
                                style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }}
                            />
                            <select
                                value={field.type}
                                onChange={(e) => updateField(idx, 'type', e.target.value)}
                                style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }}
                            >
                                <option value="text">Text</option>
                                <option value="textarea">Textarea</option>
                                <option value="number">Number</option>
                                <option value="url">URL</option>
                                <option value="image">Image Upload</option>
                            </select>
                            <button onClick={() => removeField(idx)} style={{ background: 'transparent', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '16px' }}>
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    ))}
                    <button onClick={addField} style={{ background: 'transparent', border: '1px dashed #667eea', color: '#667eea', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', marginBottom: '20px' }}>
                        <i className="fa-solid fa-plus" style={{ marginRight: '4px' }}></i> Add Field
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            onClick={handleAddSection}
                            disabled={saving}
                            style={{ padding: '10px 24px', background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
                        >
                            {saving ? 'Saving...' : 'Create Section'}
                        </button>
                    </div>
                </div>
            )}

            {/* Navbar Sections */}
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>
                <i className="fa-solid fa-bars" style={{ marginRight: '8px', color: '#667eea' }}></i>
                In Navbar ({navbarSections.length}/{MAX_NAVBAR_SECTIONS})
                {navbarFull && <span style={{ marginLeft: '10px', background: '#fff3e0', color: '#e65100', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 600 }}>FULL</span>}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                {navbarSections.map((section) => (
                    <div key={section.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontWeight: 600, color: '#1a1a2e', fontSize: '15px' }}>
                                {section.label}
                                {section.isNew && (
                                    <span style={{ marginLeft: '8px', background: '#e60000', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>NEW</span>
                                )}
                            </span>
                            {section.isCustom && (
                                <span style={{ background: '#667eea15', color: '#667eea', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600 }}>Custom</span>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="number"
                                value={section.order}
                                onChange={(e) => updateOrder(section.id, parseInt(e.target.value) || 0)}
                                style={{ width: '50px', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center', fontSize: '13px' }}
                                title="Display order"
                            />
                            <button
                                onClick={() => toggleField(section.id, 'isNew', section.isNew)}
                                style={{ padding: '4px 10px', background: section.isNew ? '#e6000015' : '#f7f7f7', color: section.isNew ? '#e60000' : '#888', border: '1px solid ' + (section.isNew ? '#e60000' : '#ddd'), borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                                title="Toggle NEW badge"
                            >
                                NEW
                            </button>
                            <button
                                onClick={() => toggleField(section.id, 'showInNavbar', section.showInNavbar)}
                                style={{ padding: '4px 10px', background: '#fff3e0', color: '#e65100', border: '1px solid #ffcc02', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                                title="Move to menu only"
                            >
                                <i className="fa-solid fa-arrow-down" style={{ marginRight: '4px' }}></i> To Menu
                            </button>
                            {section.isCustom && (
                                <button
                                    onClick={() => handleDeleteSection(section.id, section.label)}
                                    style={{ padding: '4px 10px', background: '#fee', color: '#e53e3e', border: '1px solid #e53e3e', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {navbarSections.length === 0 && (
                    <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No sections in navbar. Click &quot;To Navbar&quot; on items below.</p>
                )}
            </div>

            {/* Menu Only Sections */}
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>
                <i className="fa-solid fa-ellipsis-vertical" style={{ marginRight: '8px', color: '#888' }}></i>
                Menu Only ({menuOnlySections.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {menuOnlySections.map((section) => (
                    <div key={section.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', opacity: 0.8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontWeight: 600, color: '#1a1a2e', fontSize: '15px' }}>
                                {section.label}
                                {section.isNew && (
                                    <span style={{ marginLeft: '8px', background: '#e60000', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>NEW</span>
                                )}
                            </span>
                            {section.isCustom && (
                                <span style={{ background: '#667eea15', color: '#667eea', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600 }}>Custom</span>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="number"
                                value={section.order}
                                onChange={(e) => updateOrder(section.id, parseInt(e.target.value) || 0)}
                                style={{ width: '50px', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center', fontSize: '13px' }}
                                title="Display order"
                            />
                            <button
                                onClick={() => toggleField(section.id, 'showInNavbar', section.showInNavbar)}
                                style={{
                                    padding: '4px 10px',
                                    background: navbarFull ? '#f0f0f0' : '#e8f5e9',
                                    color: navbarFull ? '#aaa' : '#2e7d32',
                                    border: '1px solid ' + (navbarFull ? '#ddd' : '#66bb6a'),
                                    borderRadius: '6px',
                                    cursor: navbarFull ? 'not-allowed' : 'pointer',
                                    fontSize: '12px',
                                    fontWeight: 600
                                }}
                                title={navbarFull ? `Navbar full (${MAX_NAVBAR_SECTIONS}/${MAX_NAVBAR_SECTIONS}). Move one out first.` : 'Move to navbar'}
                            >
                                <i className="fa-solid fa-arrow-up" style={{ marginRight: '4px' }}></i> To Navbar
                            </button>
                            {section.isCustom && (
                                <button
                                    onClick={() => handleDeleteSection(section.id, section.label)}
                                    style={{ padding: '4px 10px', background: '#fee', color: '#e53e3e', border: '1px solid #e53e3e', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {menuOnlySections.length === 0 && (
                    <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>All sections are in the navbar.</p>
                )}
            </div>
        </div>
    );
}
