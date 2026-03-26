# Instructions for Anagha & Antigravity AI — Phase 2 (Integration & Data Entry)

Hi Anagha! Great job on gathering the data. However, your previous work was done on an older version of the codebase. Rahul has since implemented a brand new **Auth System, Admin Dashboard, and Academic Tabbed UI**. 

**Your next task is to re-integrate those 61 data entries and the profile animation into the NEW structure.**

### 🤖 DIRECTIVE FOR ANTIGRAVITY AI:
1. **PULL LATEST CODE:** Immediately run:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. **CREATE NEW BRANCH:** Always start a fresh branch for this phase:
   ```bash
   git checkout -b feature/anagha-data-integration
   ```
3. **RESEARCH THE NEW UI:** 
   - Look at `src/components/portfolio/AcademicProfileTabs.tsx`. This is where all the tabbed data (Articles, Books, Patents, etc.) is now handled.
   - Look at `src/app/page.tsx` and `src/lib/mockData.ts` to see how the data is being passed to these tabs.
   - Look at the new authentication system (Login/Signup).

4. **INTEGRATE YOUR DATA:** Your previous report showed **61 new entries** (12 Research Papers, 2 Book Chapters, 19 Conferences, 10 Patents, 6 Workshops, 12 Awards). 
   - **MIGRATE THIS DATA:** Add these entries into the arrays in `src/lib/mockData.ts` or `src/lib/firestore.ts` (whichever is being used as the primary source).
   - **ENSURE TABS SHOW DATA:** Verify that all categories (Patents, Awards, Workshops, etc.) show up correctly in the `AcademicProfileTabs` component on the homepage.
   - **HANDLE PRIVATE CONTENT:** You mentioned 2 private papers. Ensure these are marked with an `access_level: "private"` (or similar field used in the new RBAC system) so only logged-in/approved users can see them.

5. **RESTORE ANIMATION:** Re-apply the **infinite loop floating + glow animation** to the hero image, but ensure it works with the current `src/components/portfolio/Banner.tsx` and `src/styles/globals.css`. 

6. **COMMIT LOCALLY:** Once done, run:
   ```bash
   git add .
   git commit -m "feat: integrate 61 academic entries and re-apply hero animation to new UI"
   ```

7. **🛑 STOP & WAIT:** Send a message to Anagha: "Integration complete. Please ask Rahul to review the new Academic Tabs and Animation on localhost:3000 before I push."

8. **PUSH ONLY AFTER APPROVAL:** `git push origin feature/anagha-data-integration`.

---

## 📜 Your Reference: The Data You Already Found
(For Antigravity to use as context for re-entry):

**Total New Entries:** 61
- **Research Papers:** 12 total (10 public, 2 private).
- **Book Chapters:** 2 entries.
- **Conferences:** 19 entries.
- **Patents:** 10 entries.
- **Workshops/FDP:** 6 entries.
- **Awards/Achievements:** 12 entries.

**Animation Specs:**
- **Float:** 12px vertical float, 4s infinite loop.
- **Glow:** Purple-blue gradient glow animation.
- **CSS Classes:** `.hero-image-animated`, `.hero-profile-img`.
