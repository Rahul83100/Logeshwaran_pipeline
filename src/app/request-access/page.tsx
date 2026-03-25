import AccessRequestForm from '@/components/rbac/AccessRequestForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Request Private Access | Prof. Logishoren Portfolio',
  description:
    'Submit your details to request full access to Prof. Logishoren\'s private portfolio content, including unpublished research and personal projects.',
}

export default function RequestAccessPage() {
  return (
    <div className="rbac-page">
      <div className="rbac-container">
        <div className="rbac-page-header">
          <a href="/" className="rbac-back-link">
            ← Back to Portfolio
          </a>
          <h1 className="rbac-page-title">Request Private Access</h1>
          <p className="rbac-page-subtitle">
            Submit your details to request full access to Prof. Logishoren&apos;s 
            private profile, unpublished research, and exclusive content.
          </p>
        </div>

        <AccessRequestForm />

        <div className="rbac-page-footer">
          <p>
            Already have an access code?{' '}
            <a href="/access" className="rbac-link">
              Enter your code here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
