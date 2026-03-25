'use client'
import { useState } from 'react'

export default function AccessRequestForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    reason: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

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
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setStatus('success')
        setFormData({ name: '', email: '', institution: '', reason: '' })
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rbac-success-card">
        <div className="rbac-success-icon">✓</div>
        <h3>Request Submitted Successfully!</h3>
        <p>
          Your access request has been sent to Prof. Logishoren for review. 
          You will receive an access code via email once approved.
        </p>
        <button
          className="tmp-btn rbac-btn"
          onClick={() => setStatus('idle')}
        >
          Submit Another Request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rbac-form">
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
          onChange={handleChange}
          placeholder="Enter your full name"
          className="rbac-input"
          disabled={status === 'submitting'}
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
          onChange={handleChange}
          placeholder="your.email@example.com"
          className="rbac-input"
          disabled={status === 'submitting'}
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
