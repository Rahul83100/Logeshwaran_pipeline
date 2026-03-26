# Instructions for Meedhansh & Antigravity AI — Auth System & Access Control

Hi Meedhansh! Please paste this entire document into your Antigravity assistant.

### 🤖 DIRECTIVE FOR ANTIGRAVITY AI:
1. **PULL LATEST CODE:** Immediately run `git checkout develop` and `git pull origin develop`.
2. **CREATE BRANCH:** Create a new branch: `git checkout -b feature/meedhansh-auth-fix`.
3. **DO THE WORK:** Implement the Tasks 1-5 listed in this document.
4. **COMMIT LOCALLY:** Once work is done, run `git add .` and `git commit -m "feat: enhance auth system and access request flow"`.
5. **🛑 STOP & WAIT:** DO NOT PUSH. Tell Meedhansh: "Tasks complete and committed locally. Please ask Rahul to review before I push."
6. **PUSH ONLY AFTER APPROVAL:** Only run `git push origin feature/meedhansh-auth-fix` after Rahul has approved.

---

## ⚠️ CRITICAL RULES — READ FIRST

1. **DO NOT push code to GitHub** until you have confirmed with **Rahul**. You may **commit** locally, but **do not `git push`** without explicit permission.
2. Do not change the website layout, color scheme, design, or any unrelated pages.
3. Only modify the files listed below (or create new ones as needed for the features described).
4. Test everything thoroughly on `localhost:3000` before committing.

---

## 🔑 Project Setup

```bash
# Clone (if you haven't already)
git clone https://github.com/Rahul83100/Logeshwaran_pipeline.git
cd Logeshwaran_pipeline

# ⚠️ ALWAYS pull the latest code before starting any work!
git checkout develop
git pull origin develop

# 🌿 CREATE YOUR OWN BRANCH
git checkout -b feature/meedhansh-auth-fix

# Install dependencies (run this every time you pull)
npm install

# Start local dev server
npm run dev
```

> **IMPORTANT:** Every single time you sit down to work, run the commands above to stay on `develop` and get the latest code. Do NOT start making changes on outdated code. Always use your `feature/meedhansh-auth-fix` branch for work.

The site will be live at **http://localhost:3000**

**Tech Stack:** Next.js 16 + Firebase Auth + Firestore + SendGrid Email API

---

## 📋 Your Tasks (Checklist)

### Task 1: Fix Sign Up Page (`/signup`)

**File:** `src/app/signup/page.tsx`

**Current State:** The page creates a Firebase user and stores their profile in Firestore, then redirects to `/request-access`. It works, but needs polish.

**What You Need To Do:**
- [ ] After successful signup, show a **toast notification** (a small popup message) saying **"Account created successfully! 🎉"** before redirecting.
- [ ] Make sure the user's details are **correctly stored in Firestore** under the `users` collection with the following fields:
  - `uid` — the Firebase user ID
  - `email` — the user's email
  - `name` — the user's full name
  - `role` — always set to `"user"` (not admin)
  - `access_level` — always set to `"public"` initially
  - `created_at` — server timestamp
- [ ] Handle edge cases with clear error messages:
  - If the email is already in use → show "This email is already registered. Try logging in."
  - If the password is too weak → show "Password must be at least 6 characters."

> **Note:** The current code already does most of this. Your job is to add the toast notification and improve error handling.

---

### Task 2: Fix Login Page (`/login`)

**File:** `src/app/login/page.tsx`

**Current State:** The page signs in via Firebase Auth and redirects. Needs polish.

**What You Need To Do:**
- [ ] After successful login, show a **toast notification** saying **"Welcome back, [User's Name]! 👋"** before redirecting.
  - You can get the user's name from Firestore after login by reading the `users/{uid}` document.
- [ ] Make sure login works correctly and redirects to:
  - The `redirect` query param if present (e.g., `/login?redirect=/request-access`)
  - Otherwise, redirect to `/` (homepage)
- [ ] Handle errors clearly:
  - Wrong password → "Invalid email or password."
  - Account not found → "No account found with this email."
  - Too many attempts → "Too many attempts. Please try again later."

---

### Task 3: Implement Toast Notification System

**Create New File:** `src/components/ui/Toast.tsx`

**What You Need To Do:**
- [ ] Create a reusable **Toast component** that can be used across the app.
- [ ] The toast should:
  - Appear at the **top-right** or **bottom-right** of the screen
  - Auto-dismiss after **3-4 seconds**
  - Support **success** (green) and **error** (red) variants
  - Have a smooth slide-in/fade-out animation
- [ ] Use this Toast in both the Login and Signup pages (Tasks 1 & 2).

---

### Task 4: Ensure Request Access Flow Works End-to-End

**Files:**
- `src/app/request-access/page.tsx` — the page wrapper
- `src/components/rbac/AccessRequestForm.tsx` — the actual form component
- `src/app/api/request-access/route.ts` — the API endpoint

**Current State:** The form already exists and works partially. Logged-in users see a form with their name/email pre-filled and can fill in "How do you know Prof. Logeshwaran?" and submit.

**What You Need To Do:**
- [ ] Verify the full flow works:
  1. User signs up → gets redirected to `/request-access`
  2. User sees the form with name/email locked (pre-filled from their account)
  3. User fills in "How do you know Prof. Logishoren?" (this field already exists as `reason`)
  4. User clicks "Submit Request" → request is saved to `access_requests` collection in Firestore
  5. **Admin receives an email** with Approve / Deny links
- [ ] If anything in this flow is broken, **fix it**.
- [ ] Add a toast notification on successful submission: **"Access request sent! You'll be notified by email once approved. ✉️"**

---

### Task 5: Verify Admin Approval Flow

**Files:**
- `src/app/admin/approve/page.tsx` — handles approve/deny via URL params
- `src/app/api/send-approval-email/route.ts` — sends the result email to the user
- `src/app/admin/access-requests/page.tsx` — admin dashboard list of requests

**Current State:** When the admin clicks "Approve" from the email link, the system:
1. Updates the `access_requests` document status to `approved`
2. Updates the user's document in `users/{uid}` → sets `access_level` to `"private"`
3. Sends a confirmation email to the user

**What You Need To Verify & Fix:**
- [ ] After admin approves a user, that user should be able to **log in from any device** and immediately see all private content — because the `access_level: "private"` is stored in Firestore (not localStorage), it's **permanent and device-independent**.
- [ ] The access remains until the admin manually changes it back (there is no auto-expiry for approved users).
- [ ] If the admin denies the request, the user should receive a denial email and their access should stay as `"public"`.
- [ ] Make sure the admin can also **revoke** a previously approved user's access by changing their `access_level` back to `"public"` in the admin dashboard.

---

## 🏗️ Architecture Overview (For Your Reference)

Here's how the system works so you understand the big picture:

```
┌─────────────┐     ┌──────────────┐     ┌────────────────────┐
│  User Signs  │────▶│  Firestore   │────▶│  access_level:     │
│  Up / Logs In│     │  users/{uid} │     │  "public" (default)│
└─────────────┘     └──────────────┘     └────────────────────┘
       │
       ▼
┌─────────────────┐     ┌───────────────┐     ┌─────────────────┐
│  Clicks "Request │────▶│  API creates  │────▶│  Admin gets     │
│  Access" button  │     │  Firestore    │     │  email with     │
│  fills form      │     │  access_      │     │  Approve / Deny │
└─────────────────┘     │  requests/    │     │  links          │
                        │  {id}         │     └─────────────────┘
                        └───────────────┘            │
                                                     ▼
                                          ┌─────────────────────┐
                                          │  Admin clicks       │
                                          │  "Approve"          │
                                          │  → user's           │
                                          │  access_level =     │
                                          │  "private"          │
                                          │  (PERMANENT)        │
                                          └─────────────────────┘
```

**Key Files to Know:**
| File | Purpose |
|------|---------|
| `src/components/auth/AuthProvider.tsx` | Global auth context — listens to Firebase Auth + Firestore user doc in real-time |
| `src/lib/firebase.ts` | Firebase config (auth, db instances) |
| `src/lib/rbac.ts` | Legacy localStorage-based RBAC (being replaced by Firestore-based approach) |
| `src/app/login/page.tsx` | Public user login page |
| `src/app/signup/page.tsx` | Public user signup page |
| `src/app/request-access/page.tsx` | Access request page wrapper |
| `src/components/rbac/AccessRequestForm.tsx` | The actual form component |
| `src/app/api/request-access/route.ts` | API route — saves request + emails admin |
| `src/app/admin/approve/page.tsx` | Admin approval handler (via email link) |
| `src/app/api/send-approval-email/route.ts` | Sends approval/denial email to user |

---

## 🧪 How To Test Your Changes

### 🔐 Admin Email Access (For Testing)

The admin email is **Rahul's personal Gmail**. Since all approval/denial emails go to his inbox, you won't be able to test the admin approval flow without it.

**Rahul will share his Gmail ID and password with you on WhatsApp.** Use those credentials to:
- Log into his Gmail to check for incoming access request emails
- Click the Approve / Deny links in those emails to test the full flow

> ⚠️ **Do NOT change his password, delete emails, or use the account for anything other than testing this project. This is temporary access for testing only.**

### Testing Steps

1. **Sign Up:** Go to `/signup`, create a new account → verify toast appears → check Firestore `users` collection for the new document.
2. **Log In:** Go to `/login`, log in with the account → verify toast appears with name → verify redirect works.
3. **Request Access:** After login, go to `/request-access` → fill the form → submit → verify it saves to `access_requests` in Firestore.
4. **Admin Email:** Log into Rahul's Gmail (credentials shared on WhatsApp) → check for the approval email with Approve/Deny links.
5. **Approve:** Click the Approve link from the email → verify the user's `access_level` in Firestore changes to `"private"`.
6. **Cross-Device Test:** Log in with the approved user on a different browser / incognito window → verify private content is visible.

---

## 🚨 Git Rules — VERY IMPORTANT

```bash
# ✅ ALWAYS work on your branch:
git checkout feature/meedhansh-auth-fix

# ✅ Stage and commit locally:
git add .
git commit -m "feat: add toast notifications and fix auth flow"

# 🛑 STOP! Notify Rahul.
# Do NOT push until Rahul has reviewed your work.

# 🚀 Push ONLY after approval:
git push origin feature/meedhansh-auth-fix
```

**Only commit locally. Do NOT push until Rahul gives you the go-ahead.**

---

Good luck! If you have questions, message Rahul before making assumptions. 🚀
