# Instructions for Meedhansh & Antigravity AI — Final Auth & Access Flow

Hi Meedhansh! Rahul has specific final logic requirements for the **Signup, Login, and Private Research Access** system. Please implement these exactly.

### 🤖 DIRECTIVE FOR ANTIGRAVITY AI:
1. **PULL LATEST CODE:** Immediately run:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. **CREATE NEW BRANCH:** 
   ```bash
   git checkout -b feature/meedhansh-final-auth
   ```
3. **DO THE WORK:** Implement the 4 major tasks listed below.
4. **COMMIT & REVIEW:** Once done, run `git add .` && `git commit -m "feat: finalize signup flow and access request redirects"`.
5. **🛑 STOP & WAIT:** Tell Meedhansh: "Final auth flow complete. Please ask Rahul to review on localhost:3000 before I push."
6. **PUSH ONLY AFTER APPROVAL:** `git push origin feature/meedhansh-final-auth`.

---

## 📋 Your Final Tasks

### Task 1: Update Signup Page (`src/app/signup/page.tsx`)
Rahul wants the signup form to have exactly these fields:
- **Name**
- **Email**
- **New Password**
- **Re-enter Password**
- [ ] Add the "Re-enter Password" field.
- [ ] **Validation:** Ensure the "New Password" and "Re-enter Password" match perfectly before allowing form submission. If they don't match, show a red error message.

### Task 2: Fix Private Research Redirects (`src/components/portfolio/ResearchCard.tsx`)
Currently, locked papers link to `/signup`. This needs to change:
- [ ] **Logic:** If a user clicks a "Private" research paper and they are NOT logged in, redirect them to the **Login Page** (`/login?redirect=/request-access`).
- [ ] After they log in successfully, the system should automatically redirect them to the **Submit Request Access** page (`/request-access`).

### Task 3: Submit Request Access Page (`src/app/request-access/page.tsx`) 
- [ ] Verify that the form asks the user: **"How do you know Prof. Logeshwaran?"** (This is the `reason` field in `AccessRequestForm.tsx`).
- [ ] Ensure this field is **Required** and meaningful.
- [ ] **Flow:** Once submitted, the request goes to Firestore, and an email is sent to the admin.

### Task 4: Admin Approval & Permanent Access
- **Admin Email:** The official admin is **rahul636071@gmail.com**.
- [ ] **Permanent Access:** Once the admin clicks "Approve" from their email, the user's `access_level` in Firestore must be set to `"private"`. 
- [ ] This access must be **permanent**. The user should be able to log in from **any device** and see all private research papers immediately, until the admin manually revokes it in the database.

---

## 🏗️ Architecture Reference
- **Repo:** `https://github.com/Rahul83100/Logeshwaran_pipeline.git`
- **Branch:** `develop`
- **Auth Provider:** `src/components/auth/AuthProvider.tsx` (Handles the global `userData.access_level`)
- **Research Logic:** `src/components/portfolio/ResearchCard.tsx` (Handles the lock/unlock UI)

**Do NOT push until Rahul has verified the signup validation and the redirect flow on localhost.**
