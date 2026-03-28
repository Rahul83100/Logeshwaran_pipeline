# Bug Report & Audit Summary

**Date:** March 28, 2026
**Branch:** `testing/anagha-audit-mar28`

This report summarizes the results of the manual testing activity based on the `TASKS_ANAGHA.md` checklist, incorporating the audio feedback log and competitive benchmarking suggestions.

---

## 1. Security & Vulnerability Audit
- **Broken Access Control:** ✅ Verified and working perfectly. Admin pages are secured.
- **Input Sanitization:** ✅ Working properly.
- **Auth Flow:** ⏭️ Skipped during this test.

## 2. Admin Portal & CMS Testing
- **Navbar Sections (8-item limit):** ✅ Working for basic additions. It correctly blocks adding a 9th distinct section.
- **Fix Duplicates & Reset Issues:**
  - 🐛 **BUG:** Adding a custom section with the exact name of an existing section (e.g., "profile") bypasses normal restrictions and adds it.
  - 🐛 **BUG:** Clicking the "Fix Duplicates & Reset" button fails to erase these duplicate values.
  - 🐛 **BUG:** Once a duplicate bypasses the check, the navbar can exceed the limit (e.g., showing 9 items), while paradoxically displaying the "you can't add more" warning.
- **Custom Section CRUD:**
  - 🐛 **BUG:** The CRUD functionality for custom sections is broken. Specifically, image uploads fail silently—even when explicitly selecting a valid image file.
  - 🐛 **BUG:** Because image uploads fail, users cannot successfully add, edit, or delete items within these custom sections, and consequentially, verifying homepage image rendering also fails.
- **Experience & Profile:**
  - **Experience:** ✅ Updating the experience field works perfectly and accurately reflects on the live portfolio.
  - 🐛 **BUG (Profile Alignment):** The Profile field is completely inaccessible because it is hidden/rendered directly beneath the "Log Out" button. UI alignment needs fixing to allow access.

## 3. UI Alignment & UX Audit
- **Responsive Design:** ✅ Working smoothly across mobile, tablet, and desktop viewports.
  - The navbar does not overlap unexpectedly.
  - The hamburger menu accurately shows all available items.
  - Images in the Research and Projects cards correctly maintain their aspect ratios.
- **Navigation & Deep Linking:**
  - ✅ Clicking any navbar item handles scroll alignment correctly and activates the associated tab.
  - 🐛 **BUG:** Deep linking is broken for some sections. Refreshing the page with certain hash URLs (e.g., `localhost:3000/#patents`) fails to open the associated tab.
- **Visual Polish:**
  - ✅ No white-on-white text issues or inconsistent spacing detected.
  - 🐛 **BUG:** Overlapping icons are present inside the Admin Portal (though the live portfolio is unaffected).

## 4. Advanced Testing
- **Empty State Check:** ✅ Working. Deleting items successfully triggers the "No content added yet" fallback.
- **Image Performance:** ✅ Correctly guarded. Attempting to upload very large images (4MB+) successfully catches the error and displays: *"only images below 5MB can be uploaded"*.
- **Browser Compatibility:** ✅ Functions well on Google Chrome and Microsoft Edge.
- **Form Stress Test:**
  - ✅ The contact form successfully registers submissions and displays success messages.
  - 🐛 **BUG (Spam Protection):** The form currently allows limitless spamming. Submitting the form multiple times in rapid succession continues to process and show success messages without triggering rate limiting or CAPTCHAs.

---

## 5. Competitive Benchmarking: Academic Tier UI Suggestions
*Benchmarked against top-tier portals (e.g., Stanford, MIT)*

1. **The "Sticky" Sidebar Navigation**
   - **Idea:** On Desktop, transition from a top navbar to a Permanent Left Sidebar (Slim).
   - **Why:** Delivers a "Dashboard/Journal" feel popular in high-end profiles, making toggling between "Research" and "Patents" effortless.
2. **Publication "Cite" Button (One-Click BibTeX)**
   - **Idea:** Next to every paper/patent, add a tiny "Cite" button to copy BibTeX/APA formats directly to clipboard.
   - **Why:** The #1 requested feature by academic peers, proving utility over just showcasing credentials.
3. **Publication Filters (Topic Tags)**
   - **Idea:** Add horizontal topic filter tags (e.g., `#5G`, `#AI`, `#Networking`) to the Publications section.
   - **Why:** With 100+ publications, users shouldn't have to scroll infinitely. Shows a structured, deep research history.
4. **Visual "Recognition & Media" Strip (Logo Wall)**
   - **Idea:** Replace plain-text achievement bullets with a horizontal scrolling grid/strip of logos from associated universities, journals, and media outlets.
   - **Why:** Adds instant, premium social proof analogous to what TEDx speakers or IIM faculty use.
5. **📹 Embed a Featured Talk / Intro Video Section**
   - **Idea:** Add a full-width embedded YouTube/Vimeo player labeled "Watch My Featured Talk" immediately following the hero section.
   - **Why:** Prominently builds trust and authority instantly, rather than hiding media thumbs at the bottom.
