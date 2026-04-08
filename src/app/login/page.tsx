'use client'
import { useState } from 'react'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { Suspense } from 'react';

function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  // Generic redirect query parameter 
  const redirectParams = searchParams?.get('redirect')
  const signupHref = redirectParams ? `/signup?redirect=${redirectParams}` : '/signup';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push(redirectParams || '/')
    } catch (err: any) {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rbac-page" style={{ paddingTop: '100px' }}>
      <div className="rbac-container" style={{ maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px', position: 'relative', zIndex: 100 }}>
          <a href="/" style={{ color: '#9393a5', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', position: 'relative', zIndex: 100, pointerEvents: 'auto' }}>
            <i className="fa-solid fa-arrow-left" style={{ fontSize: '12px' }}></i>
            Back to Portfolio
          </a>
        </div>
        <h2 className="rbac-page-title" style={{ textAlign: 'center' }}>Log In</h2>
        <p style={{ textAlign: 'center', color: '#9393a5', marginBottom: '30px' }}>Log in to view your private access or request new access.</p>
        
        <form onSubmit={handleLogin} className="rbac-form">
          <div className="rbac-form-group">
            <label className="rbac-label">Email Address</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="rbac-input" style={{ textAlign: 'left', letterSpacing: 'normal' }} />
          </div>
          <div className="rbac-form-group">
            <label className="rbac-label">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="rbac-input" style={{ textAlign: 'left', letterSpacing: 'normal' }} />
          </div>
          {error && <div className="rbac-error-message" style={{ margin: '15px 0' }}>{error}</div>}
          <button disabled={loading} type="submit" className="tmp-btn rbac-btn rbac-btn-submit" style={{ width: '100%' }}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          
          <div className="rbac-form-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
            <p>Don't have an account? <Link href={signupHref} className="rbac-link">Sign Up</Link></p>
            <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #2a2a3a' }}>
              <Link href="/admin/login" style={{ fontSize: '13px', color: '#9393a5', textDecoration: 'none' }}>
                <i className="fa-solid fa-lock" style={{ marginRight: '6px' }}></i>
                Are you an Admin? Click here
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '100px', color: '#fff' }}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
