'use client';

import { useEffect, useState } from 'react';
import { collection, getCountFromServer, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface StatCard {
    label: string;
    count: number;
    icon: string;
    color: string;
    href: string;
}

interface AccessRequest {
    id: string;
    requester_name: string;
    requester_email: string;
    status: string;
    created_at: { toDate: () => Date } | null;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<StatCard[]>([]);
    const [recentRequests, setRecentRequests] = useState<AccessRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            const [papers, blogs, education, experience, skills, pendingReqs] = await Promise.all([
                getCountFromServer(collection(db, 'research_papers')),
                getCountFromServer(collection(db, 'blog_posts')),
                getCountFromServer(collection(db, 'education')),
                getCountFromServer(collection(db, 'experience')),
                getCountFromServer(collection(db, 'skills')),
                getCountFromServer(query(collection(db, 'access_requests'), where('status', '==', 'pending'))),
            ]);

            setStats([
                { label: 'Research Papers', count: papers.data().count, icon: 'fa-flask', color: '#667eea', href: '/admin/content/research' },
                { label: 'Blog Posts', count: blogs.data().count, icon: 'fa-blog', color: '#f093fb', href: '/admin/content/blog' },
                { label: 'Education', count: education.data().count, icon: 'fa-graduation-cap', color: '#4fd1c5', href: '/admin/content/education' },
                { label: 'Experience', count: experience.data().count, icon: 'fa-briefcase', color: '#f6ad55', href: '/admin/content/experience' },
                { label: 'Skills', count: skills.data().count, icon: 'fa-chart-bar', color: '#fc8181', href: '/admin/content/skills' },
                { label: 'Pending Requests', count: pendingReqs.data().count, icon: 'fa-key', color: '#e53e3e', href: '/admin/access-requests' },
            ]);

            // Load recent access requests
            const reqQuery = query(collection(db, 'access_requests'), orderBy('created_at', 'desc'), limit(5));
            const reqSnapshot = await getDocs(reqQuery);
            setRecentRequests(reqSnapshot.docs.map((d) => ({ id: d.id, ...d.data() } as AccessRequest)));
        } catch (err) {
            console.error('Dashboard load error:', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <div className="spinner-border text-primary" role="status"></div>
                <p style={{ marginTop: '12px', color: '#666' }}>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>Dashboard</h1>
                <p style={{ color: '#666', margin: 0 }}>Overview of your portfolio content</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {stats.map((stat) => (
                    <Link key={stat.label} href={stat.href} style={{ textDecoration: 'none' }}>
                        <div className="admin-card" style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: `${stat.color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: stat.color,
                                        fontSize: '16px',
                                    }}
                                >
                                    <i className={`fa-solid ${stat.icon}`}></i>
                                </div>
                            </div>
                            <h2 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>{stat.count}</h2>
                            <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>{stat.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="admin-card" style={{ marginBottom: '24px' }}>
                <h3>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {[
                        { label: 'Add Research Paper', href: '/admin/content/research', icon: 'fa-plus' },
                        { label: 'Write Blog Post', href: '/admin/content/blog', icon: 'fa-pen' },
                        { label: 'Edit Profile', href: '/admin/content/profile', icon: 'fa-user-pen' },
                        { label: 'View Access Requests', href: '/admin/access-requests', icon: 'fa-key' },
                    ].map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 18px',
                                background: '#f0f0ff',
                                borderRadius: '8px',
                                color: '#667eea',
                                textDecoration: 'none',
                                fontSize: '13px',
                                fontWeight: 500,
                                transition: 'background 0.2s',
                            }}
                        >
                            <i className={`fa-solid ${action.icon}`}></i>
                            {action.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Access Requests */}
            <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0 }}>Recent Access Requests</h3>
                    <Link href="/admin/access-requests" style={{ fontSize: '13px', color: '#667eea', textDecoration: 'none' }}>
                        View All →
                    </Link>
                </div>
                {recentRequests.length === 0 ? (
                    <p style={{ color: '#999', fontSize: '14px' }}>No access requests yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eee' }}>
                                    <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Name</th>
                                    <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Email</th>
                                    <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentRequests.map((req) => (
                                    <tr key={req.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                        <td style={{ padding: '10px 8px', fontSize: '14px' }}>{req.requester_name}</td>
                                        <td style={{ padding: '10px 8px', fontSize: '14px', color: '#666' }}>{req.requester_email}</td>
                                        <td style={{ padding: '10px 8px' }}>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '3px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    background:
                                                        req.status === 'pending' ? '#fff3cd' : req.status === 'approved' ? '#d1fae5' : '#fee2e2',
                                                    color:
                                                        req.status === 'pending' ? '#856404' : req.status === 'approved' ? '#065f46' : '#991b1b',
                                                }}
                                            >
                                                {req.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px 8px', fontSize: '13px', color: '#888' }}>
                                            {req.created_at?.toDate ? req.created_at.toDate().toLocaleDateString() : '—'}
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
