import CodeEntryForm from '@/components/rbac/CodeEntryForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Enter Access Code | Prof. Logishoren Portfolio',
  description:
    'Enter your approved access code to unlock private content on Prof. Logishoren\'s portfolio.',
}

export default function AccessPage() {
  return (
    <div className="rbac-page">
      <div className="rbac-container">
        <div className="rbac-page-header">
          <a href="/" className="rbac-back-link">
            ← Back to Portfolio
          </a>
          <h1 className="rbac-page-title">Enter Your Access Code</h1>
          <p className="rbac-page-subtitle">
            Enter the 16-character access code you received via email 
            to unlock private content across the portfolio.
          </p>
        </div>

        <CodeEntryForm />
      </div>
    </div>
  )
}
