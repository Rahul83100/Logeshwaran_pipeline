'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import ImageUploader from '@/components/admin/ImageUploader';

interface ProfileData {
    name: string;
    title: string;
    university: string;
    department: string;
    bio: string;
    profileImage: string;
    bannerImage: string;
    phone: string;
    email: string;
    address: string;
    linkedin: string;
    google_scholar: string;
    researchgate: string;
    orcid: string;
}

const emptyProfile: ProfileData = {
    name: '', title: '', university: '', department: '', bio: '', profileImage: '', bannerImage: '',
    phone: '', email: '', address: '', linkedin: '', google_scholar: '', researchgate: '', orcid: '',
};

export default function ProfileManagement() {
    const [form, setForm] = useState<ProfileData>(emptyProfile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => { loadProfile(); }, []);

    async function loadProfile() {
        setLoading(true);
        const docSnap = await getDoc(doc(db, 'profile', 'main'));
        if (docSnap.exists()) {
            const data = docSnap.data();
            setForm({
                name: data.name || '', title: data.title || '', university: data.university || '',
                department: data.department || '', bio: data.bio || '', profileImage: data.profileImage || data.photo || '',
                bannerImage: data.bannerImage || '',
                phone: data.phone || '', email: data.email || '', address: data.address || '',
                linkedin: data.linkedin || '', google_scholar: data.google_scholar || '',
                researchgate: data.researchgate || '', orcid: data.orcid || '',
            });
        }
        setLoading(false);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault(); setSaving(true); setSaved(false);
        try {
            await setDoc(doc(db, 'profile', 'main'), { ...form, updated_at: serverTimestamp() }, { merge: true });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) { console.error(err); alert('Failed to save profile.'); }
        finally { setSaving(false); }
    }

    const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none' };
    const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 as const, color: '#555' };

    if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}><div className="spinner-border text-primary"></div></div>;

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>Profile</h1>
                <p style={{ color: '#666', margin: 0 }}>Edit personal information, bio, and contact details</p>
            </div>

            {saved && (
                <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', color: '#065f46', fontSize: '14px' }}>
                    ✅ Profile saved successfully!
                </div>
            )}

            <form onSubmit={handleSave}>
                {/* Personal Info */}
                <div className="admin-card">
                    <h3>Personal Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div><label style={labelStyle}>Full Name *</label><input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Prof. Logishoren" /></div>
                        <div><label style={labelStyle}>Title / Designation</label><input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Associate Professor" /></div>
                        <div><label style={labelStyle}>University</label><input style={inputStyle} value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} placeholder="e.g. Christ University" /></div>
                        <div><label style={labelStyle}>Department</label><input style={inputStyle} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. Computer Science" /></div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <ImageUploader
                                currentUrl={form.profileImage}
                                onUrlChange={(url) => setForm({ ...form, profileImage: url })}
                                storagePath="images/profile"
                                label="Profile Photo"
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Bio</label><textarea style={{ ...inputStyle, height: '120px', resize: 'vertical' }} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="A brief professional bio..." /></div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="admin-card">
                    <h3>Contact Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div><label style={labelStyle}>Email</label><input style={inputStyle} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="professor@university.edu" /></div>
                        <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 ..." /></div>
                        <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Address</label><input style={inputStyle} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Department, University, City" /></div>
                    </div>
                </div>

                {/* Social / Academic Links */}
                <div className="admin-card">
                    <h3>Academic & Social Links</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div><label style={labelStyle}>LinkedIn</label><input style={inputStyle} value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." /></div>
                        <div><label style={labelStyle}>Google Scholar</label><input style={inputStyle} value={form.google_scholar} onChange={(e) => setForm({ ...form, google_scholar: e.target.value })} placeholder="https://scholar.google.com/..." /></div>
                        <div><label style={labelStyle}>ResearchGate</label><input style={inputStyle} value={form.researchgate} onChange={(e) => setForm({ ...form, researchgate: e.target.value })} placeholder="https://researchgate.net/..." /></div>
                        <div><label style={labelStyle}>ORCID</label><input style={inputStyle} value={form.orcid} onChange={(e) => setForm({ ...form, orcid: e.target.value })} placeholder="https://orcid.org/..." /></div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button type="submit" disabled={saving} style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '15px', cursor: 'pointer', fontWeight: 600 }}>
                        {saving ? 'Saving...' : '💾 Save Profile'}
                    </button>
                    <button type="button" onClick={loadProfile} style={{ padding: '12px 24px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '14px' }}>
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}
