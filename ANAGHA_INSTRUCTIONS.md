# Instructions for Anagha & Antigravity AI (Data Entry & Polish)

Hi Anagha! Please paste this entire document into your Antigravity assistant.

### 🤖 DIRECTIVE FOR ANTIGRAVITY AI:
1. **PULL LATEST CODE:** Immediately run `git checkout develop` and `git pull origin develop`.
2. **CREATE BRANCH:** Create a new branch: `git checkout -b feature/anagha-data-populate`.
3. **DO THE WORK:** Follow the tasks in "Step 2 & 3" below.
4. **COMMIT LOCALLY:** Once work is done, run `git add .` and `git commit -m "feat: populate academic data and fix profile animation"`.
5. **🛑 STOP & WAIT:** DO NOT PUSH. Tell Anagha: "Tasks complete and committed locally. Please ask Rahul to review before I push."
6. **PUSH ONLY AFTER APPROVAL:** Only run `git push origin feature/anagha-data-populate` after Rahul has approved.

## Your Objective
Your primary goal is to use your Antigravity AI to migrate the missing data from the Christ University Faculty portal into this new website, and to fix the profile image animation. 

**CRITICAL RULE: Do not make any structural, architectural, backend, or layout changes to the website. The authentication and layout systems are finalized. You are only updating the data and fixing the hero image.**

### Important Links for You and Antigravity
Here are the critical links you will need for this task (if your Antigravity agent needs them for context):
- **Project Repository:** `https://github.com/Rahul83100/Logeshwaran_pipeline.git`
- **Christ University Faculty Source:** Visit the official Christ University (Deemed to be University) website and navigate to Dr. Logeshwaran J's faculty profile page to find the original publication and achievement lists.

## Step-by-Step Instructions

### Step 1: Initial Setup (AI should do this automatically)
- If not already cloned: `git clone https://github.com/Rahul83100/Logeshwaran_pipeline.git`
- **GET LATEST:** `git checkout develop` && `git pull origin develop`
- **START BRANCH:** `git checkout -b feature/anagha-data-populate`
- Run `npm install` and then `npm run dev`.
- Analyze the site structure to prepare for data entry.

### Step 2: Capture the Source Data
- Go to the official **Christ University Faculty Website** for Dr. Logeshwaran J.
- Take clear screenshots of **all** the remaining details and sub-details from his university profile that are missing from our local website.

### Step 3: Automate the Updates with Antigravity
- Open your Antigravity assistant.
- Upload all the screenshots you took.
- Give Antigravity the following exact prompt:
  > *"Here are the screenshots of Dr. Logeshwaran's full academic details from the university portal. Please update all the pending sub-details and data arrays in the website's code to match this information perfectly. Use the repository context if needed. **CRITICAL:** Do NOT change the existing website layout, colors, or backend architecture. Only update the data/text entries to ensure the site is fully populated."*

### Step 4: Fix the Profile Image Animation
- In the same or a new prompt, ask Antigravity to fix the alignment of Dr. Logeshwaran's profile image on the homepage.
- Explicitly ask Antigravity to **add the live effect / infinite loop animation** that was originally present in the base template so the website looks dynamic and premium again.

Once Antigravity completes these updates, verify the data on your localhost.

### Step 5: Review & Commit
- **COMMIT LOCALLY:** When done, run:
  ```bash
  git add .
  git commit -m "feat: populate academic data and fix profile animation"
  ```
- **STOP & NOTIFY RAHUL:** Do NOT push to GitHub yet. Send a message to Rahul to review your changes on your screen or via a screenshot.
- **PUSH (ONLY AFTER APPROVAL):** Once Rahul says "OK", push your branch:
  ```bash
  git push origin feature/anagha-data-populate
  ```
