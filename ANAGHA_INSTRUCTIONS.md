# Pending Tasks for Anagha (Data Entry & Polish)

Hi Anagha! Please follow these instructions carefully to finalize the data population for Dr. Logeshwaran's portfolio website.

## Your Objective
Your primary goal is to use your Antigravity AI to migrate the missing data from the Christ University Faculty portal into this new website, and to fix the profile image animation. 

**CRITICAL RULE: Do not make any structural, architectural, backend, or layout changes to the website. The authentication and layout systems are finalized. You are only updating the data and fixing the hero image.**

### Important Links for You and Antigravity
Here are the critical links you will need for this task (if your Antigravity agent needs them for context):
- **Project Repository:** `https://github.com/Rahul83100/Logeshwaran_pipeline.git`
- **Christ University Faculty Source:** Visit the official Christ University (Deemed to be University) website and navigate to Dr. Logeshwaran J's faculty profile page to find the original publication and achievement lists.

## Step-by-Step Instructions

### Step 1: Review the Current Site
- Clone the repository (if you haven't): `git clone https://github.com/Rahul83100/Logeshwaran_pipeline.git`
- **GET LATEST CODE:** If you already have it, run:
  ```bash
  git checkout develop
  git pull origin develop
  ```
- **CREATE YOUR BRANCH:** Always work on your own branch:
  ```bash
  git checkout -b feature/anagha-data-populate
  ```
- Run `npm install` and then `npm run dev` to start the localhost server.
- Browse the sections (Articles, Book Chapters, Patents, Awards, etc.) to see exactly which sub-details and lists are currently pending or missing context.

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
