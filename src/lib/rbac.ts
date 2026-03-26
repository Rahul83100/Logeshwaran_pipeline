// ============================================================
// RBAC Utility Functions
// ============================================================
// These functions manage the client-side access state.
// Access level is stored in localStorage after a valid code is entered.
// Anagha can import these to conditionally show/hide private content.
// ============================================================

/**
 * Get the current access level from localStorage.
 * Returns 'public' by default (SSR-safe).
 */
export function getAccessLevel(): 'public' | 'private' {
  if (typeof window === 'undefined') return 'public'
  
  const level = localStorage.getItem('rbac_access_level')
  if (level !== 'private') return 'public'

  // Enforce 30-day device limit
  const expiry = localStorage.getItem('rbac_access_expiry')
  if (expiry && Date.now() > parseInt(expiry, 10)) {
    clearAccess()
    return 'public'
  }
  
  return 'private'
}

/**
 * Get the stored access code from localStorage.
 * Returns null if no code is stored or if running on the server.
 */
export function getAccessCode(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('rbac_access_code')
}

/**
 * Clear the stored access code and access level.
 * Call this to revoke access on the client side.
 */
export function clearAccess(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('rbac_access_code')
  localStorage.removeItem('rbac_access_level')
  localStorage.removeItem('rbac_access_expiry')
}

/**
 * Check if private access has been granted.
 * Convenience wrapper around getAccessLevel().
 */
export function isPrivateAccessGranted(): boolean {
  return getAccessLevel() === 'private'
}
