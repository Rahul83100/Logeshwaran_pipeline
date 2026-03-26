'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import Link from 'next/link'

export default function AccessRequestForm() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    reason: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Pre-fill fields once user data arrives
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: userData?.name || user.displayName || prev.name,
        email: user.email || prev.email
      }))
    }
  }, [user, userData])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, uid: user?.uid }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
    }
  }

  // Loading state
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><p style={{ color: '#9393a5' }}>Loading...</p></div>
  }

  // NOT LOGGED IN — Show sign up / log in prompt
  if (!user) {
    return (
      <div className="rbac-success-card" style={{ textAlign: 'center' }}>
        <div className="rbac-success-icon">🔐</div>
        <h3>Account Required</h3>
        <p style={{ marginBottom: '25px' }}>
          To request access to private research papers, you need to create an account first.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup" className="tmp-btn rbac-btn rbac-btn-submit" style={{ textDecoration: 'none' }}>
            Sign Up
          </Link>
          <Link href="/login?redirect=/request-access" className="tmp-btn rbac-btn" style={{ textDecoration: 'none' }}>
            Log In
          </Link>
        </div>
      </div>
    )
  }

  // Already has access
  if (userData?.access_level === 'private') {
    return (
      <div className="rbac-success-card">
        <div className="rbac-success-icon">🔓</div>
        <h3>You already have Full Access</h3>
        <p>Your account is permanently unlocked. You can view all private research papers and content.</p>
        <button className="tmp-btn rbac-btn" onClick={() => router.push('/')}>Return to Portfolio</button>
      </div>
    )
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="rbac-success-card">
        <div className="rbac-success-icon">✓</div>
        <h3>Request Submitted Successfully!</h3>
        <p>
          Your access request has been sent to Prof. Logishoren for review.
          You will receive an email once your account is approved. After that, simply log in to view all private content.
        </p>
        <button className="tmp-btn rbac-btn" onClick={() => router.push('/')}>
          Return to Portfolio
        </button>
      </div>
    )
  }

  // LOGGED IN — Show form with Name/Email locked, only Institution & Reason editable
  return (
    <form onSubmit={handleSubmit} className="rbac-form">
      <div style={{ background: 'rgba(108, 92, 231, 0.1)', border: '1px solid rgba(108, 92, 231, 0.3)', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: '#9393a5' }}>
          Logged in as <strong style={{ color: '#6c5ce7' }}>{user.email}</strong>
        </p>
      </div>

      <div className="rbac-form-group">
        <label htmlFor="name" className="rbac-label">
          Full Name <span className="rbac-required">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          readOnly
          className="rbac-input"
          style={{ opacity: 0.6, cursor: 'not-allowed' }}
        />
      </div>

      <div className="rbac-form-group">
        <label htmlFor="email" className="rbac-label">
          Email Address <span className="rbac-required">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          readOnly
          className="rbac-input"
          style={{ opacity: 0.6, cursor: 'not-allowed' }}
        />
      </div>

      <div className="rbac-form-group">
        <label htmlFor="institution" className="rbac-label">
          Institution / Organization
        </label>
        <input
          id="institution"
          name="institution"
          type="text"
          value={formData.institution}
          onChange={handleChange}
          placeholder="e.g., MIT, Google Research (optional)"
          className="rbac-input"
          disabled={status === 'submitting'}
        />
      </div>

      <div className="rbac-form-group">
        <label htmlFor="reason" className="rbac-label">
          How do you know Prof. Logishoren? <span className="rbac-required">*</span>
        </label>
        <textarea
          id="reason"
          name="reason"
          required
          rows={4}
          value={formData.reason}
          onChange={handleChange}
          placeholder="Please describe your relationship or reason for requesting access..."
          className="rbac-textarea"
          disabled={status === 'submitting'}
        />
      </div>

      {status === 'error' && (
        <div className="rbac-error-message">
          <span>⚠</span> {errorMessage}
        </div>
      )}

      <button
        type="submit"
        className="tmp-btn rbac-btn rbac-btn-submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? (
          <>
            <span className="rbac-spinner"></span>
            Submitting...
          </>
        ) : (
          'Submit Request'
        )}
      </button>
    </form>
  )
}
