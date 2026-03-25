import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import crypto from 'crypto'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const requestId = searchParams.get('id')
    const action = searchParams.get('action')

    // Validate parameters
    if (!requestId) {
      return NextResponse.json(
        { error: 'Missing request ID' },
        { status: 400 }
      )
    }

    if (!action || !['approve', 'deny'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "deny".' },
        { status: 400 }
      )
    }

    // Get the existing request document
    const requestRef = doc(db, 'access_requests', requestId)
    const requestDoc = await getDoc(requestRef)

    if (!requestDoc.exists()) {
      return NextResponse.json(
        { error: 'Access request not found' },
        { status: 404 }
      )
    }

    const requestData = requestDoc.data()

    // Prevent re-processing already handled requests
    if (requestData.status !== 'pending') {
      return NextResponse.json(
        { error: `Request has already been ${requestData.status}` },
        { status: 409 }
      )
    }

    const adminEmail = process.env.ADMIN_EMAIL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    if (action === 'approve') {
      // Generate a random 16-character hex access code
      const accessCode = crypto.randomBytes(8).toString('hex').toUpperCase()

      // Set expiry to 30 days from now
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      await updateDoc(requestRef, {
        status: 'approved',
        access_code: accessCode,
        approved_at: serverTimestamp(),
        expires_at: expiresAt,
      })

      // Send access code email to requester
      if (adminEmail) {
        try {
          await sgMail.send({
            to: requestData.requester_email,
            from: adminEmail, // Must be a verified SendGrid sender
            subject: '🔓 Your Access Code — Prof. Logishoren Portfolio',
            html: `
              <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #12121a; color: #e4e4e8; border-radius: 12px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #6c5ce7, #4834d4); padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: white; font-size: 24px;">Access Approved! 🎉</h1>
                </div>
                <div style="padding: 30px;">
                  <p>Hi ${requestData.requester_name},</p>
                  <p style="color: #9393a5;">Your request for private access to Prof. Logishoren's portfolio has been approved.</p>
                  
                  <div style="background: #0a0a0f; border: 1px solid #2a2a3a; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
                    <p style="color: #9393a5; margin-bottom: 10px; font-size: 14px;">Your Access Code</p>
                    <p style="font-family: 'Courier New', monospace; font-size: 28px; letter-spacing: 4px; color: #6c5ce7; font-weight: 700; margin: 0;">${accessCode}</p>
                  </div>

                  <div style="text-align: center; margin-bottom: 25px;">
                    <a href="${siteUrl}/access" style="display: inline-block; background: #6c5ce7; color: white; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600;">Enter Code on Website →</a>
                  </div>

                  <p style="color: #9393a5; font-size: 13px; text-align: center;">This code expires in 30 days. Keep it safe and don't share it with others.</p>
                </div>
              </div>
            `,
          })
        } catch (emailError) {
          console.error('Failed to send access code email:', emailError)
        }
      }

      return NextResponse.json({
        success: true,
        message: `Access approved for ${requestData.requester_email}. Code sent via email.`,
      })
    } else {
      // Deny the request
      await updateDoc(requestRef, {
        status: 'denied',
      })

      // Send denial email to requester
      if (adminEmail) {
        try {
          await sgMail.send({
            to: requestData.requester_email,
            from: adminEmail,
            subject: 'Access Request Update — Prof. Logishoren Portfolio',
            html: `
              <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #12121a; color: #e4e4e8; border-radius: 12px; overflow: hidden;">
                <div style="background: #2a2a3a; padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: white; font-size: 24px;">Access Request Update</h1>
                </div>
                <div style="padding: 30px;">
                  <p>Hi ${requestData.requester_name},</p>
                  <p style="color: #9393a5;">Unfortunately, your request for private access to Prof. Logishoren's portfolio was not approved at this time.</p>
                  <p style="color: #9393a5;">If you believe this was an error, you may submit a new request with additional details about your connection.</p>
                  <div style="text-align: center; margin-top: 25px;">
                    <a href="${siteUrl}/request-access" style="display: inline-block; background: #6c5ce7; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Submit New Request</a>
                  </div>
                </div>
              </div>
            `,
          })
        } catch (emailError) {
          console.error('Failed to send denial email:', emailError)
        }
      }

      return NextResponse.json({
        success: true,
        message: `Access denied for ${requestData.requester_email}`,
      })
    }
  } catch (error) {
    console.error('Error processing access approval:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
