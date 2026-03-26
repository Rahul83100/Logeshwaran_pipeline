'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, getDoc, updateDoc, setDoc, doc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AccessRequest {
    id: string;
    requester_name: string;
    requester_email: string;
    institution: string;
    reason: string;
    status: string;
    uid?: string;
    access_code?: string | null;
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
        try {
            setProcessingId(id);
            const requestRef = doc(db, 'access_requests', id);
            const requestDoc = await getDoc(requestRef);
            if (!requestDoc.exists()) throw new Error('Request not found');
            const data = requestDoc.data();
            
            await updateDoc(requestRef, {
                status: 'approved',
                approved_at: serverTimestamp(),
            });

            if (data.uid) {
                await setDoc(doc(db, 'users', data.uid), { access_level: 'private' }, { merge: true });
            }

            const res = await fetch('/api/send-approval-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'approve',
                    email: data.requester_email,
                    name: data.requester_name
                })
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.error || 'Failed to dispatch email');

            await loadRequests();
            alert('Access approved! The user has been granted global private access.');
        } catch (err: any) {
            alert('Error approving request: ' + err.message);
        } finally {
            setProcessingId(null);
        }
    }

    async function handleDeny(id: string) {
        if (!confirm('Deny this access request?')) return;
        try {
            setProcessingId(id);
            const requestRef = doc(db, 'access_requests', id);
            const requestDoc = await getDoc(requestRef);
            if (!requestDoc.exists()) throw new Error('Request not found');
            const data = requestDoc.data();

            await updateDoc(requestRef, { status: 'denied' });

            const res = await fetch('/api/send-approval-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'deny',
                    email: data.requester_email,
                    name: data.requester_name
                })
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.error || 'Failed to dispatch email');

            await loadRequests();
            alert('Request denied. The denial email dispatch was triggered.');
        } catch (err: any) {
            alert('Error denying request: ' + err.message);
        } finally {
            setProcessingId(null);
        }
    }

    async function handleRevoke(id: string) {
        if (!confirm('Revoke this access? The user will immediately lose access.')) return;
        setProcessingId(id);
        const reqDoc = await getDoc(doc(db, 'access_requests', id));
        if (reqDoc.exists() && reqDoc.data().uid) {
            await updateDoc(doc(db, 'users', reqDoc.data().uid), { access_level: 'public' });
        }
        await updateDoc(doc(db, 'access_requests', id), { status: 'revoked' });
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
                                    {req.status === 'approved' && req.uid && (
                                        <div style={{ marginTop: '8px', padding: '8px 12px', background: '#f0f0ff', borderRadius: '6px', fontFamily: 'monospace', fontSize: '14px', color: '#667eea' }}>
                                            Profile Unlocked (UID: {req.uid.substring(0, 8)}...)
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
