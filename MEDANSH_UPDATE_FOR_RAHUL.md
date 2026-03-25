# 📝 Intern Sync: RBAC System Progress Report
**From:** Meedhanshu (Agent)
**To:** Rahul (Agent / Admin CMS Integration)
**Date:** March 25, 2026
**Branch:** `feature/rbac-system`

---

## 🎯 What Was Built

The **Role-Based Access Control (RBAC)** system has been completely implemented and pushed to the `feature/rbac-system` branch of the shared repository. 

This system handles the full lifecycle of a user requesting private access, Logishoren approving/denying it via email, and the user entering a 16-character code to unlock the frontend.

### Frontend Components (Next.js App Router)
All components are styled to match the Reeni premium dark theme template.
- `/request-access` — The public form where users submit their details (Full Name, Email, Institution, Reason).
- `/access` — The code entry page where approved users enter their 16-character hex code.
- `<PrivateContentBadge />` — A lock badge that Anagha can plug into private portfolio items.
- `<AccessStatusBanner />` — A banner that sits in the global `layout.tsx`, visible only when a user has private access (includes a "Revoke" button).

### Backend / API Routes (Firebase + SendGrid)
Instead of waiting for a Cloud Function, the Email flow is fully wired up natively in the Next.js API routes using SendGrid.

1. `POST /api/request-access`
   - Validates user input and saves a document to the `access_requests` Firestore collection (status: `"pending"`).
   - **Sends an email via SendGrid** to `ADMIN_EMAIL` (Rahul/Logishoren) with the requester's details and direct `APPROVE` / `DENY` links.

2. `GET /api/approve-access?id=<DOC_ID>&action=<approve|deny>`
   - Triggered when the admin clicks the link in their email.
   - If `approve`: Generates a random 16-char hex code, updates status to `"approved"`, sets a 30-day expiry (`expires_at`), and **sends the code via email to the requester**.
   - If `deny`: Updates status to `"denied"` and sends a polite rejection email.

3. `POST /api/validate-code`
   - Triggered by the `/access` frontend form.
   - Queries Firestore for an `"approved"` document matching the `access_code`.
   - Checks the 30-day expiry. Returns valid/invalid payload.

### Client-Side State Management
- `src/lib/rbac.ts` provides utility functions:
   - `getAccessLevel()` — Returns `'public' | 'private'`.
   - `getAccessCode()` — Returns the stored 16-character code.
   - `isPrivateAccessGranted()` — Boolean helper.
   - `clearAccess()` — Clears local storage to revoke access.

---

## 🗄️ Firestore Schema Implementation

If the Admin CMS needs to read/write access requests, here is the exact schema implemented in the `access_requests` collection:

```typescript
type AccessRequest = {
  requester_name: string;
  requester_email: string;
  institution: string; // empty string if not provided
  reason: string;
  status: "pending" | "approved" | "denied";
  access_code: string | null; // 16-char hex (e.g., "A1B2C3D4E5F6G7H8")
  created_at: Timestamp;
  approved_at: Timestamp | null;
  expires_at: Timestamp | null; // 30 days after approval
}
```

---

## 🔑 Environment Variables Used

The following env vars are tightly coupled to the RBAC system and must be available in the deployed environment:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=logeshwaran-7e490.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=logeshwaran-7e490
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=logeshwaran-7e490.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=331978304903
NEXT_PUBLIC_FIREBASE_APP_ID=1:331978304903:web:xxx

# Email Configuration (SendGrid)
ADMIN_EMAIL=rahul636071@gmail.com
SENDGRID_API_KEY=SG.xxx

# Deployment
NEXT_PUBLIC_SITE_URL=http://localhost:3000 # Update this for production
```

---

## 🚀 Notes for Rahul's Admin CMS Integration

1. **Dashboard Capabilities:** Since the API routes already handle the email logic (both Admin Approval triggers and User Notification emails), your Admin CMS doesn't *strictly* need to send emails when approving/denying from a GUI dashboard. 
   - *However*, if you build a GUI to approve/deny within the CMS, you should either abstract the email sending logic into a shared service file, or simply hit the `GET /api/approve-access` endpoint from your client side to trigger the exact same flow the email buttons trigger.

2. **Merged Layout:** The `layout.tsx` file was modified to include the `<AccessStatusBanner />`. Be careful when merging branches to preserve this.

3. **No Remaining TODOs:** The RBAC task is 100% complete down to the email delivery integration, and tests pass successfully. 

Let the integration begin! 🛠️
