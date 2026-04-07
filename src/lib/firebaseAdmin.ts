import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

let adminApp: App
let adminDb: Firestore

// Initialize Firebase Admin SDK for server-side API routes.
// Uses Application Default Credentials or the project ID from env vars.
// This bypasses Firestore security rules, which is correct for server-side operations.
if (!getApps().length) {
  // In production you'd use a service account key file.
  // For development, initializing with just projectId works for Firestore operations
  // when combined with Application Default Credentials (gcloud CLI login).
  // As a fallback, we initialize with the project ID from env vars.
  adminApp = initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  })
} else {
  adminApp = getApps()[0]
}

adminDb = getFirestore(adminApp)

export { adminApp, adminDb }
