'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/admin/dashboard');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            if (errorMessage.includes('wrong-password') || errorMessage.includes('invalid-credential')) {
                setError('Invalid email or password');
            } else if (errorMessage.includes('user-not-found')) {
                setError('No account found with this email');
            } else if (errorMessage.includes('too-many-requests')) {
                setError('Too many attempts. Please try again later.');
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                padding: '20px',
            }}
        >
            <div
                style={{
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    padding: '48px 40px',
                    width: '100%',
                    maxWidth: '420px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div
                        style={{
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            fontSize: '24px',
                        }}
                    >
                        🎓
                    </div>
                    <h2 style={{ color: '#fff', margin: '0 0 6px', fontSize: '24px', fontWeight: 600 }}>
                        Admin Portal
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '14px' }}>
                        Prof. Logishoren&apos;s Portfolio CMS
                    </p>
                </div>

                {error && (
                    <div
                        style={{
                            background: 'rgba(239,68,68,0.15)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#fca5a5',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            marginBottom: '20px',
                            textAlign: 'center',
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '18px' }}>
                        <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@example.com"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '10px',
                                color: '#fff',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '10px',
                                color: '#fff',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '13px',
                            background: loading
                                ? 'rgba(102,126,234,0.5)'
                                : 'linear-gradient(135deg, #667eea, #764ba2)',
                            border: 'none',
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: '15px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm" style={{ marginRight: '8px' }}></span>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                        <i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }}></i>
                        Back to Portfolio
                    </Link>
                </div>

                <p
                    style={{
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: '12px',
                        marginTop: '20px',
                    }}
                >
                    Authorized personnel only
                </p>
            </div>
        </div>
    );
}
