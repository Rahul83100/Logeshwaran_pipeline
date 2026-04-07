import { NextRequest, NextResponse } from 'next/server'
import { verifyApprovalToken } from '@/lib/approvalToken'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ''
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''
const ADMIN_EMAIL_AUTH = process.env.ADMIN_EMAIL || ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

/**
 * Sign in with email/password via Firebase Auth REST API and return the idToken.
 * This token is used to authenticate Firestore REST API calls.
 */
async function getAuthToken(): Promise<string | null> {
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: ADMIN_EMAIL_AUTH,
          password: ADMIN_PASSWORD,
          returnSecureToken: true,
        }),
      }
    )
    if (!res.ok) {
      console.error('Auth failed:', await res.text())
      return null
    }
    const data = await res.json()
    return data.idToken || null
  } catch (err) {
    console.error('Auth error:', err)
    return null
  }
}

async function getFirestoreDoc(collection: string, docId: string, token: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  return res.json()
}

async function updateFirestoreDoc(collection: string, docId: string, fields: Record<string, any>, token: string) {
  const firestoreFields: Record<string, any> = {}
  const updateMask: string[] = []

  for (const [key, value] of Object.entries(fields)) {
    updateMask.push(key)
    if (value === 'SERVER_TIMESTAMP') {
      firestoreFields[key] = { timestampValue: new Date().toISOString() }
    } else if (value === null) {
      firestoreFields[key] = { nullValue: null }
    } else if (typeof value === 'string') {
      firestoreFields[key] = { stringValue: value }
    } else if (typeof value === 'boolean') {
      firestoreFields[key] = { booleanValue: value }
    }
  }

  const maskParams = updateMask.map(f => `updateMask.fieldPaths=${f}`).join('&')
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}?${maskParams}`
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fields: firestoreFields }),
  })
  return res.ok
}

function extractStringField(doc: any, fieldName: string): string {
  return doc?.fields?.[fieldName]?.stringValue || ''
}

/**
 * GET /api/approve-action?token=<signed-token>
 * 
 * One-click approve/deny from email. The signed HMAC token contains the requestId
 * and action. Uses Firebase Auth REST API to get an admin ID token, then uses
 * Firestore REST API to update the document. No admin login in browser required.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return htmlResponse('Invalid Link', 'This approval link is missing required parameters.', 'error')
  }

  // Verify the signed HMAC token
  const verified = verifyApprovalToken(token)
  if (!verified) {
    return htmlResponse('Link Expired or Invalid', 'This approval link has expired or is invalid. Please use the admin dashboard to manage access requests.', 'error')
  }

  const { requestId, action } = verified

  try {
    // Authenticate as admin via Firebase Auth REST API
    const authToken = await getAuthToken()
    if (!authToken) {
      return htmlResponse(
        'Authentication Error',
        'Could not authenticate with Firebase. Please check admin credentials in environment variables, or use the admin dashboard instead.',
        'error'
      )
    }

    // Get the access request document
    const doc = await getFirestoreDoc('access_requests', requestId, authToken)

    if (!doc || doc.error) {
      return htmlResponse('Not Found', 'This access request no longer exists.', 'error')
    }

    const docStatus = extractStringField(doc, 'status')
    const requesterName = extractStringField(doc, 'requester_name')
    const requesterEmail = extractStringField(doc, 'requester_email')
    const uid = extractStringField(doc, 'uid')

    // Check if already processed
    if (docStatus !== 'pending') {
      return htmlResponse(
        'Already Processed',
        `This request has already been <strong>${docStatus}</strong>. No further action is needed.`,
        'info'
      )
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const adminEmail = process.env.ADMIN_EMAIL

    if (action === 'approve') {
      // Update the access request status
      await updateFirestoreDoc('access_requests', requestId, {
        status: 'approved',
        approved_at: 'SERVER_TIMESTAMP',
      }, authToken)

      // Grant private access to the user's profile
      if (uid) {
        await updateFirestoreDoc('users', uid, {
          access_level: 'private',
        }, authToken)
      }

      // Send approval notification email to the user
      if (adminEmail && requesterEmail) {
        try {
          await sgMail.send({
            to: requesterEmail,
            from: adminEmail,
            subject: '🔓 Your Access Code — Prof. Logishoren Portfolio',
            html: `
              <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #12121a; color: #e4e4e8; border-radius: 12px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #6c5ce7, #4834d4); padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: white; font-size: 24px;">Access Approved! 🎉</h1>
                </div>
                <div style="padding: 30px;">
                  <p>Hi ${requesterName},</p>
                  <p style="color: #9393a5;">Your request for private access to Prof. Logishoren's portfolio has been approved.</p>

                  <div style="text-align: center; margin: 35px 0 25px 0;">
                    <a href="${siteUrl}/login" style="display: inline-block; background: #6c5ce7; color: white; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600;">Log In to View Profile →</a>
                  </div>

                  <p style="color: #9393a5; font-size: 13px; text-align: center;">Your Firebase account now retains permanent global access credentials. This privilege is bound exclusively to your login session.</p>
                </div>
              </div>
            `,
          })
        } catch (emailErr) {
          console.error('Failed to send approval email to user:', emailErr)
        }
      }

      return htmlResponse(
        'Request Approved ✅',
        `<strong>${requesterName}</strong> (${requesterEmail}) has been granted private access.<br><br>An approval notification email has been sent to the user.`,
        'success'
      )

    } else {
      // Deny the request
      await updateFirestoreDoc('access_requests', requestId, {
        status: 'denied',
      }, authToken)

      // Send denial notification email to the user
      if (adminEmail && requesterEmail) {
        try {
          await sgMail.send({
            to: requesterEmail,
            from: adminEmail,
            subject: 'Access Request Update — Prof. Logishoren Portfolio',
            html: `
              <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #12121a; color: #e4e4e8; border-radius: 12px; overflow: hidden;">
                <div style="background: #2a2a3a; padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: white; font-size: 24px;">Access Request Update</h1>
                </div>
                <div style="padding: 30px;">
                  <p>Hi ${requesterName},</p>
                  <p style="color: #9393a5;">Unfortunately, your request for private access to Prof. Logishoren's portfolio was not approved at this time.</p>
                  <p style="color: #9393a5;">If you believe this was an error, you may submit a new request with additional details about your connection.</p>
                  <div style="text-align: center; margin-top: 25px;">
                    <a href="${siteUrl}/request-access" style="display: inline-block; background: #6c5ce7; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Submit New Request</a>
                  </div>
                </div>
              </div>
            `,
          })
        } catch (emailErr) {
          console.error('Failed to send denial email to user:', emailErr)
        }
      }

      return htmlResponse(
        'Request Denied ❌',
        `The access request from <strong>${requesterName}</strong> (${requesterEmail}) has been denied.<br><br>A notification email has been sent to the user.`,
        'denied'
      )
    }

  } catch (error) {
    console.error('Error processing approval action:', error)
    return htmlResponse(
      'Server Error',
      `Something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'error'
    )
  }
}

function htmlResponse(title: string, message: string, type: 'success' | 'denied' | 'error' | 'info') {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const colors = {
    success: { bg: 'linear-gradient(135deg, #00d68f, #00b894)', icon: '✅', accent: '#00d68f' },
    denied: { bg: 'linear-gradient(135deg, #ff5e5e, #e53e3e)', icon: '❌', accent: '#ff5e5e' },
    error: { bg: 'linear-gradient(135deg, #ff9f43, #ee5a24)', icon: '⚠️', accent: '#ff9f43' },
    info: { bg: 'linear-gradient(135deg, #6c5ce7, #4834d4)', icon: 'ℹ️', accent: '#6c5ce7' },
  }

  const { bg, icon, accent } = colors[type]

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Prof. Logishoren Portfolio</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0d0d14;
      color: #e4e4e8;
      padding: 20px;
    }
    .card {
      background: #12121a;
      border-radius: 16px;
      overflow: hidden;
      max-width: 480px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      animation: fadeIn 0.5s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .card-header {
      background: ${bg};
      padding: 40px 30px;
      text-align: center;
    }
    .card-icon { font-size: 48px; margin-bottom: 12px; }
    .card-title { font-size: 24px; font-weight: 700; color: white; }
    .card-body {
      padding: 30px;
      line-height: 1.7;
      color: #9393a5;
      font-size: 15px;
    }
    .card-body strong { color: #e4e4e8; }
    .card-footer {
      padding: 0 30px 30px;
      text-align: center;
    }
    .btn {
      display: inline-block;
      background: ${accent};
      color: white;
      padding: 12px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: opacity 0.2s;
    }
    .btn:hover { opacity: 0.85; }
  </style>
</head>
<body>
  <div class="card">
    <div class="card-header">
      <div class="card-icon">${icon}</div>
      <div class="card-title">${title}</div>
    </div>
    <div class="card-body">${message}</div>
    <div class="card-footer">
      <a href="${siteUrl}/admin/access-requests" class="btn">Go to Dashboard</a>
    </div>
  </div>
</body>
</html>`

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
