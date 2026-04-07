import crypto from 'crypto'

// Secret key for signing approval tokens. Uses SENDGRID_API_KEY as a shared secret
// since it's already available server-side and only the server knows it.
function getSecret(): string {
  return process.env.SENDGRID_API_KEY || process.env.ADMIN_PASSWORD || 'fallback-secret-key'
}

/**
 * Generate a signed token for an approval action.
 * Token = base64url(requestId:action:timestamp:hmac)
 */
export function generateApprovalToken(requestId: string, action: 'approve' | 'deny'): string {
  const timestamp = Date.now().toString()
  const payload = `${requestId}:${action}:${timestamp}`
  const hmac = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
  const token = Buffer.from(`${payload}:${hmac}`).toString('base64url')
  return token
}

/**
 * Verify and decode an approval token.
 * Returns the requestId and action if valid, null otherwise.
 * Tokens expire after 7 days.
 */
export function verifyApprovalToken(token: string): { requestId: string; action: 'approve' | 'deny' } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8')
    const parts = decoded.split(':')
    if (parts.length !== 4) return null

    const [requestId, action, timestamp, providedHmac] = parts
    if (action !== 'approve' && action !== 'deny') return null

    // Verify HMAC
    const payload = `${requestId}:${action}:${timestamp}`
    const expectedHmac = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
    if (providedHmac !== expectedHmac) return null

    // Check expiry (7 days)
    const tokenAge = Date.now() - parseInt(timestamp)
    if (tokenAge > 7 * 24 * 60 * 60 * 1000) return null

    return { requestId, action: action as 'approve' | 'deny' }
  } catch {
    return null
  }
}
