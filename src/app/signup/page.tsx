'use client'
import { useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: email,
        name: name,
        role: 'user',
        access_level: 'public',
        created_at: serverTimestamp(),
      })
      router.push('/request-access')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rbac-page" style={{ paddingTop: '100px' }}>
      <div className="rbac-container" style={{ maxWidth: '450px' }}>
        <h2 className="rbac-page-title" style={{ textAlign: 'center' }}>Create an Account</h2>
        <p style={{ textAlign: 'center', color: '#9393a5', marginBottom: '30px' }}>Join the portfolio to request private research access.</p>
        
        <form onSubmit={handleSignup} className="rbac-form">
          <div className="rbac-form-group">
            <label className="rbac-label">Full Name</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="rbac-input rbac-code-input" style={{ textAlign: 'left', letterSpacing: 'normal' }} />
          </div>
          <div className="rbac-form-group">
            <label className="rbac-label">Email Address</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="rbac-input rbac-code-input" style={{ textAlign: 'left', letterSpacing: 'normal' }} />
          </div>
          <div className="rbac-form-group">
            <label className="rbac-label">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="rbac-input rbac-code-input" style={{ textAlign: 'left', letterSpacing: 'normal' }} />
          </div>
          {error && <div className="rbac-error-message" style={{ margin: '15px 0' }}>{error}</div>}
          <button disabled={loading} type="submit" className="tmp-btn rbac-btn rbac-btn-submit" style={{ width: '100%' }}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
          
          <div className="rbac-form-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
            <p>Already have an account? <Link href="/login" className="rbac-link">Log In</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}
