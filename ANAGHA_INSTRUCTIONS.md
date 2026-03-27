# Instructions for Anagha & Antigravity AI — Phase 3 (UI Cleanup & Content Updates)

Hi Anagha! For today, we are focusing on polishing the Home Page UI and updating project content. Please follow these instructions carefully.

### 🤖 DIRECTIVE FOR ANTIGRAVITY AI:

1. **PULL LATEST CODE:** Ensure you are working on Rahul's current version:
   ```bash
   git checkout main
   git pull origin main
   ```

2. **CREATE NEW BRANCH:** Always start a fresh branch for this task:
   ```bash
   git checkout -b feature/ui-cleanup-content-update
   ```

3. **FIX UI ALIGNMENT (Home Page):**
   - **Login/Logout Buttons:** They are currently too large and overlapping other icons. Resize them to be sleek and fix their positioning so they don't overlap.
   - **Social Media Icons:** Move all social media icons (Facebook, Instagram, etc.) from the top/header area to the **bottom (Footer)** of the page.

4. **HERO IMAGE FIX:**
   - The hero image is currently cropped at the top. 
   - **Fix:** Adjust the styling to display the **full image** without top cropping, while keeping the same layout proportions.

5. **UPDATE PROJECT IMAGES:**
   - Replace the current placeholder/old images for the following portfolio items with high-quality, relevant visuals:
     - **IoT Healthcare Monitoring & Alert System**
     - **AI Based Brain Cancer Detection Device**
     - (And all other projects listed below these).
   - **Tip:** Use the `generate_image` tool (via Gemini) to create professional images for these specific topics.
   - Also update images for the **Blog** and **News** sections.

6. **COMMIT LOCALLY:** Once done, run:
   ```bash
   git add .
   git commit -m "feat: fix UI alignment, relocate social icons, and update portfolio visuals"
   ```

7. **🛑 STOP & WAIT:** Notify Rahul that the changes are ready for local review.
   - **DO NOT PUSH** until Rahul has run the code locally and given his approval.

8. **PUSH AFTER APPROVAL:** 
   ```bash
   git push origin feature/ui-cleanup-content-update
   ```
