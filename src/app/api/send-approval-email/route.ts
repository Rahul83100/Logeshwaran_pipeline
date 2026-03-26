import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { action, email, name } = await req.json()
    const adminEmail = process.env.ADMIN_EMAIL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    if (!adminEmail) {
      return NextResponse.json({ success: false, error: 'Admin email not configured' }, { status: 500 })
    }

    if (action === 'approve') {
      await sgMail.send({
        to: email,
        from: adminEmail,
        subject: '🔓 Your Access Code — Prof. Logishoren Portfolio',
        html: `
          <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #12121a; color: #e4e4e8; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #6c5ce7, #4834d4); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 24px;">Access Approved! 🎉</h1>
            </div>
            <div style="padding: 30px;">
              <p>Hi ${name},</p>
              <p style="color: #9393a5;">Your request for private access to Prof. Logishoren's portfolio has been approved.</p>

              <div style="text-align: center; margin: 35px 0 25px 0;">
                <a href="${siteUrl}/login" style="display: inline-block; background: #6c5ce7; color: white; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600;">Log In to View Profile →</a>
              </div>

              <p style="color: #9393a5; font-size: 13px; text-align: center;">Your Firebase account now retains permanent global access credentials. This privilege is bound exclusively to your login session.</p>
            </div>
          </div>
        `,
      })
    } else if (action === 'deny') {
      await sgMail.send({
        to: email,
        from: adminEmail,
        subject: 'Access Request Update — Prof. Logishoren Portfolio',
        html: `
          <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #12121a; color: #e4e4e8; border-radius: 12px; overflow: hidden;">
            <div style="background: #2a2a3a; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 24px;">Access Request Update</h1>
            </div>
            <div style="padding: 30px;">
              <p>Hi ${name},</p>
              <p style="color: #9393a5;">Unfortunately, your request for private access to Prof. Logishoren's portfolio was not approved at this time.</p>
              <p style="color: #9393a5;">If you believe this was an error, you may submit a new request with additional details about your connection.</p>
              <div style="text-align: center; margin-top: 25px;">
                <a href="${siteUrl}/request-access" style="display: inline-block; background: #6c5ce7; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Submit New Request</a>
              </div>
            </div>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to dispatch notification email:', error)
    return NextResponse.json(
      { error: 'Internal server error while sending email' },
      { status: 500 }
    )
  }
}
