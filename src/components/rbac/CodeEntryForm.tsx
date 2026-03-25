'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CodeEntryForm() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'validating' | 'success'>('idle')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStatus('validating')

    const trimmedCode = code.trim().toUpperCase()

    if (!trimmedCode) {
      setError('Please enter an access code.')
      setStatus('idle')
      return
    }

    try {
      const res = await fetch('/api/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmedCode }),
      })

      const data = await res.json()

      if (data.valid) {
        // Store access level in localStorage
        localStorage.setItem('rbac_access_code', trimmedCode)
        localStorage.setItem('rbac_access_level', 'private')
        setStatus('success')

        // Brief delay to show success state, then redirect
        setTimeout(() => {
          router.push('/')
        }, 1500)
      } else {
        setError(data.error || 'Invalid access code.')
        setStatus('idle')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div className="rbac-success-card">
        <div className="rbac-success-icon">🔓</div>
        <h3>Access Granted!</h3>
        <p>You can now view all private content. Redirecting to the homepage...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rbac-form">
      <div className="rbac-form-group">
        <label htmlFor="access-code" className="rbac-label">
          Access Code
        </label>
        <input
          id="access-code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter your 16-character access code"
          className="rbac-input rbac-code-input"
          maxLength={16}
          autoComplete="off"
          spellCheck={false}
          disabled={status === 'validating'}
        />
        <p className="rbac-hint">
          The code was sent to your email after your request was approved.
        </p>
      </div>

      {error && (
        <div className="rbac-error-message">
          <span>⚠</span> {error}
        </div>
      )}

      <button
        type="submit"
        className="tmp-btn rbac-btn rbac-btn-submit"
        disabled={status === 'validating' || code.trim().length === 0}
      >
        {status === 'validating' ? (
          <>
            <span className="rbac-spinner"></span>
            Validating...
          </>
        ) : (
          'Unlock Access'
        )}
      </button>

      <div className="rbac-form-footer">
        <p>
          Don&apos;t have a code?{' '}
          <a href="/request-access" className="rbac-link">
            Request Access
          </a>
        </p>
      </div>
    </form>
  )
}
