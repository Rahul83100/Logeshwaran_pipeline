import AccessRequestForm from '@/components/rbac/AccessRequestForm'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Request Private Access | Prof. Logishoren Portfolio',
  description:
    'Submit your details to request full access to Prof. Logishoren\'s private portfolio content, including unpublished research and personal projects.',
}

export default function RequestAccessPage() {
  return (
    <div className="rbac-page" style={{ paddingTop: '100px' }}>
      <div className="rbac-container">
        
        <div className="rbac-page-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px', position: 'relative', zIndex: 100 }}>
            <a href="/" style={{ color: '#9393a5', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', position: 'relative', zIndex: 100, pointerEvents: 'auto' }}>
              <i className="fa-solid fa-arrow-left" style={{ fontSize: '12px' }}></i>
              Back to Portfolio
            </a>
          </div>

          <h1 className="rbac-page-title">Request Private Access</h1>
          <p className="rbac-page-subtitle">
            Submit your details to request full access to Prof. Logishoren&apos;s 
            private profile, unpublished research, and exclusive content.
          </p>
        </div>

        <AccessRequestForm />

      </div>
    </div>
  )
}
