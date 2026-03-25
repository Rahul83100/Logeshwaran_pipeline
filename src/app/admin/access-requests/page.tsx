'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AccessRequest {
    id: string;
    requester_name: string;
    requester_email: string;
    institution: string;
    reason: string;
    status: string;
    access_code: string | null;
    created_at: { toDate: () => Date } | null;
    approved_at: { toDate: () => Date } | null;
    expires_at: { toDate: () => Date } | null;
}

export default function AccessRequestsManagement() {
    const [requests, setRequests] = useState<AccessRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'denied'>('all');
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => { loadRequests(); }, []);

    async function loadRequests() {
        setLoading(true);
        const q = query(collection(db, 'access_requests'), orderBy('created_at', 'desc'));
        const snap = await getDocs(q);
        setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AccessRequest)));
        setLoading(false);
    }

    function generateAccessCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 16; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    async function handleApprove(id: string) {
        setProcessingId(id);
        const accessCode = generateAccessCode();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        await updateDoc(doc(db, 'access_requests', id), {
            status: 'approved',
            access_code: accessCode,
            approved_at: serverTimestamp(),
            expires_at: expiresAt,
        });

        // Show the code to the admin so they can share it
        alert(`Access approved!\n\nAccess Code: ${accessCode}\n\nShare this code with the requester. It expires in 30 days.\n\n(In production, this would be sent via email automatically)`);

        await loadRequests();
        setProcessingId(null);
    }

    async function handleDeny(id: string) {
        if (!confirm('Deny this access request?')) return;
        setProcessingId(id);
        await updateDoc(doc(db, 'access_requests', id), { status: 'denied' });
        await loadRequests();
        setProcessingId(null);
    }

    async function handleRevoke(id: string) {
        if (!confirm('Revoke this access? The code will no longer work.')) return;
        setProcessingId(id);
        await updateDoc(doc(db, 'access_requests', id), { status: 'revoked', access_code: null });
        await loadRequests();
        setProcessingId(null);
    }

    const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

    const statusColors: Record<string, { bg: string; fg: string }> = {
        pending: { bg: '#fff3cd', fg: '#856404' },
        approved: { bg: '#d1fae5', fg: '#065f46' },
        denied: { bg: '#fee2e2', fg: '#991b1b' },
        revoked: { bg: '#f3f4f6', fg: '#6b7280' },
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>Access Requests</h1>
                    <p style={{ color: '#666', margin: 0 }}>Review and manage private access requests ({requests.filter((r) => r.status === 'pending').length} pending)</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {(['all', 'pending', 'approved', 'denied'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '6px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                            fontSize: '13px', fontWeight: 500,
                            background: filter === f ? '#667eea' : '#f0f0f0',
                            color: filter === f ? '#fff' : '#666',
                        }}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        {f !== 'all' && ` (${requests.filter((r) => r.status === f).length})`}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border text-primary"></div></div>
            ) : filtered.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}>
                    <i className="fa-solid fa-key" style={{ fontSize: '40px', color: '#ddd', marginBottom: '12px' }}></i>
                    <p style={{ color: '#999' }}>No {filter !== 'all' ? filter : ''} access requests.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filtered.map((req) => (
                        <div key={req.id} className="admin-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                        <h4 style={{ margin: 0, fontSize: '16px' }}>{req.requester_name}</h4>
                                        <span style={{
                                            background: statusColors[req.status]?.bg || '#f3f4f6',
                                            color: statusColors[req.status]?.fg || '#666',
                                            padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 500,
                                        }}>
                                            {req.status}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#555' }}>
                                        <i className="fa-solid fa-envelope" style={{ marginRight: '6px', color: '#999' }}></i>
                                        {req.requester_email}
                                    </p>
                                    {req.institution && (
                                        <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#555' }}>
                                            <i className="fa-solid fa-building" style={{ marginRight: '6px', color: '#999' }}></i>
                                            {req.institution}
                                        </p>
                                    )}
                                    <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#888' }}>
                                        <strong>Reason:</strong> {req.reason}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>
                                        Requested: {req.created_at?.toDate ? req.created_at.toDate().toLocaleString() : '—'}
                                        {req.approved_at?.toDate && ` · Approved: ${req.approved_at.toDate().toLocaleString()}`}
                                        {req.expires_at?.toDate && ` · Expires: ${req.expires_at.toDate().toLocaleDateString()}`}
                                    </p>
                                    {req.access_code && req.status === 'approved' && (
                                        <div style={{ marginTop: '8px', padding: '8px 12px', background: '#f0f0ff', borderRadius: '6px', fontFamily: 'monospace', fontSize: '14px', color: '#667eea' }}>
                                            Access Code: <strong>{req.access_code}</strong>
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                    {req.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(req.id)}
                                                disabled={processingId === req.id}
                                                style={{ padding: '8px 16px', background: '#d1fae5', border: 'none', borderRadius: '6px', color: '#065f46', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                                            >
                                                ✅ Approve
                                            </button>
                                            <button
                                                onClick={() => handleDeny(req.id)}
                                                disabled={processingId === req.id}
                                                style={{ padding: '8px 16px', background: '#fee2e2', border: 'none', borderRadius: '6px', color: '#991b1b', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                                            >
                                                ❌ Deny
                                            </button>
                                        </>
                                    )}
                                    {req.status === 'approved' && (
                                        <button
                                            onClick={() => handleRevoke(req.id)}
                                            disabled={processingId === req.id}
                                            style={{ padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: '6px', color: '#6b7280', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                                        >
                                            🔒 Revoke
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
