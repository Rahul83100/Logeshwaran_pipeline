// This route is kept for backward compatibility but the main Firestore write
// now happens client-side in AccessRequestForm.tsx where the user is already
// authenticated. Use /api/request-access/notify for email notifications.

import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint has been deprecated. Access requests are now submitted directly from the client.' },
    { status: 410 }
  )
}
