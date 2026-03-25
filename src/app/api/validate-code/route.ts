import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export async function POST(req: Request) {
  try {
    const { code } = await req.json()

    if (!code) {
      return NextResponse.json(
        { valid: false, error: 'Access code is required' },
        { status: 400 }
      )
    }

    // Query Firestore for a matching approved access code
    const q = query(
      collection(db, 'access_requests'),
      where('access_code', '==', code.trim().toUpperCase()),
      where('status', '==', 'approved')
    )
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return NextResponse.json(
        { valid: false, error: 'Invalid access code' },
        { status: 401 }
      )
    }

    const requestData = snapshot.docs[0].data()

    // Check code expiry (codes are valid for 30 days after approval)
    if (requestData.expires_at) {
      const expiryDate = requestData.expires_at.toDate
        ? requestData.expires_at.toDate()
        : new Date(requestData.expires_at)

      if (expiryDate < new Date()) {
        return NextResponse.json(
          { valid: false, error: 'Access code has expired. Please request a new one.' },
          { status: 401 }
        )
      }
    }

    return NextResponse.json({ valid: true, access_level: 'private' })
  } catch (error) {
    console.error('Error validating access code:', error)
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
