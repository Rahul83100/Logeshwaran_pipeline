import Link from 'next/link'

/**
 * PrivateContentBadge
 * 
 * Displays a lock icon with a "Request Access" link.
 * Anagha should use this component on any content items that are private.
 * 
 * Usage:
 *   import PrivateContentBadge from '@/components/rbac/PrivateContentBadge'
 *   
 *   {isPrivate && !isPrivateAccessGranted() && <PrivateContentBadge />}
 */
export default function PrivateContentBadge() {
  return (
    <div className="rbac-private-badge">
      <div className="rbac-badge-content">
        <i className="fa-solid fa-lock rbac-badge-icon"></i>
        <span className="rbac-badge-text">Private Content</span>
      </div>
      <Link href="/request-access" className="rbac-badge-link">
        Request Access to View
      </Link>
    </div>
  )
}
