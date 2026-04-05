'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, userData, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const adminEnvEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase() || 'rahul636071@gmail.com';
    const isAdmin = user?.email?.toLowerCase() === adminEnvEmail || userData?.role === 'admin';

    useEffect(() => {
        if (!loading) {
            if (!user && pathname !== '/admin/login') {
                router.push('/admin/login');
            } else if (user && pathname !== '/admin/login' && !isAdmin) {
                // If logged in but NOT an admin, redirect to portfolio
                router.push('/');
            }
        }
    }, [user, userData, loading, pathname, router, isAdmin]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/admin/login');
    };

    // If we're on the login page, don't show the admin shell
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user) return null;

    // Show specialized unauthorized UI while redirecting non-admins
    if (!isAdmin) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔐</div>
                <h3 style={{ marginBottom: '10px' }}>Access Restricted</h3>
                <p style={{ color: '#666', maxWidth: '400px' }}>
                    You are logged in as <strong>{user.email}</strong>, but your account is not yet registered as an administrator in our database.
                </p>
                <div style={{ background: '#fff4f4', border: '1px solid #ffcccc', padding: '15px', borderRadius: '8px', marginTop: '20px', fontSize: '13px', color: '#661111' }}>
                    <strong>Next Steps:</strong><br/>
                    1. Check your Firestore "users" collection.<br/>
                    2. Ensure a document exists with ID: <code>{user.uid}</code><br/>
                    3. Set <code>role: "admin"</code> in that document.
                </div>
                <div className="spinner-border text-primary mt-4" role="status" style={{ width: '1.5rem', height: '1.5rem' }}></div>
                <p style={{ marginTop: '10px', fontSize: '12px', color: '#aaa' }}>Redirecting to home page...</p>
            </div>
        );
    }

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
        { href: '/admin/messages', label: 'Inbox', icon: 'fa-inbox' },
        { href: '/admin/content', label: 'Content', icon: 'fa-file-pen' },
        { href: '/admin/content/research', label: 'Research Papers', icon: 'fa-flask' },
        { href: '/admin/content/blog', label: 'Blog Posts', icon: 'fa-blog' },
        { href: '/admin/content/education', label: 'Education', icon: 'fa-graduation-cap' },
        { href: '/admin/content/experience', label: 'Experience', icon: 'fa-briefcase' },
        { href: '/admin/content/skills', label: 'Skills', icon: 'fa-chart-bar' },
        { href: '/admin/content/profile', label: 'Profile', icon: 'fa-user' },
        { href: '/admin/access-requests', label: 'Access Requests', icon: 'fa-key' },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ color: '#fff', margin: 0, fontSize: '18px' }}>🎓 Admin Panel</h4>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '4px 0 0' }}>
                        Prof. Logishoren&apos;s Portfolio
                    </p>
                </div>

                <nav style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                color: pathname === item.href ? '#fff' : 'rgba(255,255,255,0.6)',
                                textDecoration: 'none',
                                fontSize: '14px',
                                marginBottom: '4px',
                                background: pathname === item.href ? 'rgba(255,255,255,0.12)' : 'transparent',
                                transition: 'all 0.2s',
                            }}
                        >
                            <i className={`fa-solid ${item.icon}`} style={{ width: '18px', textAlign: 'center' }}></i>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '0 0 8px' }}>
                            {user.email}
                        </p>
                        <button
                            onClick={handleLogout}
                            style={{
                                width: '100%',
                                padding: '8px',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                color: '#fff',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '13px',
                            }}
                        >
                            <i className="fa-solid fa-right-from-bracket" style={{ marginRight: '6px' }}></i>
                            Logout
                        </button>
                    </div>
                    <Link
                        href="/"
                        style={{
                            display: 'block',
                            textAlign: 'center',
                            color: 'rgba(255,255,255,0.4)',
                            fontSize: '12px',
                            marginTop: '10px',
                            textDecoration: 'none',
                        }}
                    >
                        ← Back to Portfolio
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-content">
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
