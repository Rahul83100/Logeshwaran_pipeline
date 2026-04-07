import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { generateApprovalToken } from '@/lib/approvalToken'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { name, email, institution, reason, requestId } = await req.json()

    if (!name || !email || !requestId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const adminEmail = process.env.ADMIN_EMAIL

    if (!adminEmail) {
      return NextResponse.json({ error: 'Admin email not configured' }, { status: 500 })
    }

    // Generate signed tokens for one-click approve/deny
    const approveToken = generateApprovalToken(requestId, 'approve')
    const denyToken = generateApprovalToken(requestId, 'deny')
    
    const approveUrl = `${siteUrl}/api/approve-action?token=${approveToken}`
    const denyUrl = `${siteUrl}/api/approve-action?token=${denyToken}`

    await sgMail.send({
      to: adminEmail,
      from: adminEmail,
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

            <p style="color: #6c5ce7; font-size: 13px; text-align: center; margin-bottom: 20px;">
              ⚡ Click below to instantly approve or deny — no login required
            </p>

            <div style="text-align: center;">
              <a href="${approveUrl}" style="display: inline-block; background: #00d68f; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-right: 10px;">✅ Approve</a>
              <a href="${denyUrl}" style="display: inline-block; background: #ff5e5e; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">❌ Deny</a>
            </div>

            <p style="color: #555; font-size: 11px; text-align: center; margin-top: 25px;">
              This link expires in 7 days. You can also manage requests from the admin dashboard.
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to send notification email:', error)
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
