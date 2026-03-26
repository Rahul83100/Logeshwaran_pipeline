# Instructions for Meedhansh & Antigravity AI — Fresh Start (Phase 2)

Hi Meedhansh! Rahul has completely overhauled the **Auth System, Admin Dashboard, and RBAC architecture**. 

**IMPORTANT:** We are discarding any work you did on older versions. You must pull the current version and start fresh to ensure your changes work with the new system.

### 🤖 DIRECTIVE FOR ANTIGRAVITY AI:
1. **DISCARD OLD WORK:** Do not attempt to merge or use any changes made previously on old branches.
2. **PULL CURRENT CODE:** Immediately run:
   ```bash
   git checkout develop
   git pull origin develop
   ```
3. **VERIFY VERSION:** Run `npm install` and then `npm run dev`. Navigate to `localhost:3000`. 
   - Verify that the **Academic Tabs** (Articles, Books, etc.) are visible.
   - Verify the new **Login/Signup** links are present.
4. **CREATE FRESH BRANCH:** 
   ```bash
   git checkout -b feature/meedhansh-auth-v2
   ```
5. **IMPLEMENT NEW CHANGES:** Your task is to enhance the *current* Auth system. Follow the checklist below.
6. **COMMIT LOCALLY:** `git add .` && `git commit -m "feat: enhance current auth and dashboard flow"`.
7. **🛑 STOP & WAIT:** Tell Meedhansh: "Fresh implementation complete. Please ask Rahul to review on localhost:3000 before I push."
8. **DO NOT PUSH:** Only push to `origin feature/meedhansh-auth-v2` after Rahul's explicit approval.

---

## 📋 Your Tasks (Checklist)

### Task 1: Toast Notifications
- [ ] Implement a reusable **Toast component** in `src/components/ui/Toast.tsx`.
- [ ] Add "Success" and "Error" toasts to the **current** Login and Signup pages.
- [ ] Success Toast: "Welcome back, [Name]!" or "Account created successfully!"

### Task 2: Auth Flow Polish
- [ ] Ensure that after Login/Signup, the user is correctly redirected based on the `redirect` query parameter.
- [ ] Add error handling to the forms (e.g., "Invalid credentials", "Email already exists") using the new Toast system.

### Task 3: Admin Dashboard Enhancements
- [ ] Look at `src/app/admin/dashboard/page.tsx` and `src/app/admin/access-requests/page.tsx`.
- [ ] Add a "Revoke Access" button for approved users in the access requests list.
- [ ] Ensure the "Approve/Deny" actions correctly update the Firestore `users` document (`access_level` field).

---

## 🏗️ Architecture Reference
- **Branch:** `develop`
- **Auth Context:** `src/components/auth/AuthProvider.tsx` (Real-time Firestore sync)
- **Database:** Firestore `users` and `access_requests` collections.
- **Admin Pages:** Located under `src/app/admin/`.

**Only commit locally. Wait for Rahul to see the changes on your screen.**
