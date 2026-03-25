'use client'
import { useEffect, useState } from 'react'
import { isPrivateAccessGranted, clearAccess } from '@/lib/rbac'

/**
 * AccessStatusBanner
 * 
 * Shows a banner at the top of the page when the user has private access.
 * Includes a "Revoke Access" button to clear stored credentials.
 * 
 * Usage (add to layout or page):
 *   import AccessStatusBanner from '@/components/rbac/AccessStatusBanner'
 *   
 *   <AccessStatusBanner />
 */
export default function AccessStatusBanner() {
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    setHasAccess(isPrivateAccessGranted())
  }, [])

  if (!hasAccess) return null

  const handleRevoke = () => {
    clearAccess()
    setHasAccess(false)
    window.location.reload()
  }

  return (
    <div className="rbac-access-banner">
      <div className="rbac-banner-content">
        <span className="rbac-banner-icon">🔓</span>
        <span className="rbac-banner-text">You have private access</span>
      </div>
      <button
        onClick={handleRevoke}
        className="rbac-banner-revoke"
        title="Revoke your private access"
      >
        Revoke Access
      </button>
    </div>
  )
}
