'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
            if (!user && pathname !== '/admin/login') {
                router.push('/admin/login');
            }
        });
        return () => unsubscribe();
    }, [router, pathname]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/admin/login');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Login page doesn't need the admin shell
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (!user) return null;

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
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
            <aside className="admin-sidebar">
                <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ color: '#fff', margin: 0, fontSize: '18px' }}>🎓 Admin Panel</h4>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '4px 0 0' }}>
                        Prof. Logishoren&apos;s Portfolio
                    </p>
                </div>

                <nav>
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

                <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
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
