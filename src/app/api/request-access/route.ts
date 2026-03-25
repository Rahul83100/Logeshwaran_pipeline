import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { name, email, institution, reason } = await req.json()

    // Validate required fields
    if (!name || !email || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and reason are required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Save access request to Firestore
    const docRef = await addDoc(collection(db, 'access_requests'), {
      requester_name: name,
      requester_email: email,
      institution: institution || '',
      reason,
      status: 'pending',
      access_code: null,
      created_at: serverTimestamp(),
      approved_at: null,
      expires_at: null,
    })

    // Send notification email to admin (Logishoren/Rahul)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const adminEmail = process.env.ADMIN_EMAIL

    if (adminEmail) {
      const approveUrl = `${siteUrl}/api/approve-access?id=${docRef.id}&action=approve`
      const denyUrl = `${siteUrl}/api/approve-access?id=${docRef.id}&action=deny`

      try {
        await sgMail.send({
          to: adminEmail,
          from: adminEmail, // Must be a verified SendGrid sender
          subject: `🔐 New Access Request from ${name}`,
          html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #12121a; color: #e4e4e8; border-radius: 12px; overflow: hidden;">
              <div style="background: linear-gradient(135deg, #6c5ce7, #4834d4); padding: 30px; text-align: center;">
                <h1 style="margin: 0; color: white; font-size: 24px;">New Access Request</h1>
              </div>
              <div style="padding: 30px;">
                <p style="color: #9393a5; margin-bottom: 20px;">Someone has requested private access to your portfolio:</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                  <tr>
                    <td style="padding: 10px 0; color: #9393a5; border-bottom: 1px solid #2a2a3a;">Name</td>
                    <td style="padding: 10px 0; color: #e4e4e8; border-bottom: 1px solid #2a2a3a; font-weight: 600;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #9393a5; border-bottom: 1px solid #2a2a3a;">Email</td>
                    <td style="padding: 10px 0; color: #e4e4e8; border-bottom: 1px solid #2a2a3a;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #9393a5; border-bottom: 1px solid #2a2a3a;">Institution</td>
                    <td style="padding: 10px 0; color: #e4e4e8; border-bottom: 1px solid #2a2a3a;">${institution || 'Not specified'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #9393a5; vertical-align: top;">Reason</td>
                    <td style="padding: 10px 0; color: #e4e4e8;">${reason}</td>
                  </tr>
                </table>

                <div style="text-align: center;">
                  <a href="${approveUrl}" style="display: inline-block; background: #00d68f; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-right: 10px;">✅ Approve</a>
                  <a href="${denyUrl}" style="display: inline-block; background: #ff5e5e; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">❌ Deny</a>
                </div>
              </div>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Failed to send admin notification email:', emailError)
        // Don't fail the request if email fails — the request is still saved in Firestore
      }
    }

    return NextResponse.json({ success: true, requestId: docRef.id })
  } catch (error) {
    console.error('Error processing access request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
