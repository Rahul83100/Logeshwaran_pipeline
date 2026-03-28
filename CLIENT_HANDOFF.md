# Project Handoff & Deployment Guide

This document summarizes the current state of Dr. Logeshwaran's academic portfolio and provides a complete step-by-step guide for handing it over to the client, deploying it to production, and setting up his custom domain.

---

## 1. What We Have Built
We've successfully created a fully custom, data-driven academic portfolio using a modern tech stack (Next.js 14 + Firebase + Tailwind CSS).
- **Public Website:** A premium, animated (Framer Motion), and responsive homepage showcasing Research Papers, Journals, Books, Conferences, Patents, Projects, Workshops, Awards, and Blog Posts.
- **Admin Portal (`/admin`):** A custom-built Content Management System (CMS) that allows Dr. Logeshwaran to add, edit, or delete any of his academic records without touching code.
- **Role-Based Access Control (RBAC):** Normal users can sign up, but only the Root Admin (Dr. Logeshwaran) can access the `/admin` portal. Visitors can request access to private research papers.
- **Firebase Backend:** Used Firestore for seamless database storage, Firebase Authentication for user accounts, and Firebase Storage for uploading profile pictures and blog thumbnails.
- **Contact Inbox:** A fully functional inbox integrated directly into the Admin Portal to receive messages from the homepage contact form.

---

## 2. Deploying & The "Two Sites" Confusion
**Question:** *"I only have one domain (`logeswaran.com`), but we have two different pages for the Admin Portal and the public website. Where do we deploy the Admin Portal?"*

**Answer:** You only need **one domain** and **one deployment**! 
The Admin Portal is not a separate application; it is simply a secured internal route *inside* the main website. 
- When someone visits `logeswaran.com`, they see the public portfolio.
- When Dr. Logeshwaran visits `logeswaran.com/admin` and logs in, he accesses the private dashboard.
- Therefore, you only deploy to Netlify **once**.

---

## 3. How to Deploy on Netlify

Netlify is the perfect choice for Next.js applications. Follow these steps to get it live:

1. **Push to GitHub**: Make sure all your recent changes are pushed to your GitHub repository's `main` branch.
2. **Connect to Netlify**: Go to [Netlify.com](https://www.netlify.com/), log in, and click **Add New Site** > **Import an existing project**.
3. Select GitHub and choose your repository (`Logeshwaran_pipeline`).
4. **Configure Build Settings**:
   - Framework preset: `Next.js`
   - Build command: `npm run build`
   - Publish directory: `.next`
5. **Add Environment Variables (CRITICAL STEP)**:
   Before clicking "Deploy", click **Add environment variables**. You must copy every single line from your local `.env.local` file into Netlify. 
   *(Specifically, ensure `NEXT_PUBLIC_ADMIN_EMAIL` matches Dr. Logeshwaran's email).*
6. **Deploy**: Click the Deploy button. After a few minutes, Netlify will give you a temporary URL (like `https://happy-liger-12345.netlify.app`).

---

## 4. Setting up the Custom Domain
Once the Netlify build succeeds:

1. In your Netlify dashboard for the project, go to **Domain Management**.
2. Click **Add custom domain** and type `logeswaran.com`.
3. Netlify will ask you to verify ownership. Depending on where you bought the domain (GoDaddy, Namecheap, Hostinger), Netlify will provide instructions to change your **Nameservers** or add **A Records/CNAMEs** in your domain registrar's DNS settings.
4. Update those DNS records on your domain registrar.
5. Wait. DNS propagation can take a few hours. Netlify will automatically issue a free SSL/HTTPS certificate once the domain connects.

---

## 5. Client Handoff (Transferring Ownership)
To ensure Dr. Logeshwaran owns the backend data and isn't dependent on your personal accounts:

### Step A: Transfer Firebase
1. Go to your [Firebase Console](https://console.firebase.google.com/).
2. Select the `logeshwaran-7e490` project.
3. Click the **Settings Gear** (top left) > **Users and permissions**.
4. Click **Add member**, enter Dr. Logeshwaran's email, and assign him the **Owner** role.
5. He will receive an email invitation. Once he accepts it, you can safely remove your own email from the project if desired.

### Step B: Create the Admin Account
Since the system relies on exact email matching for security:
1. Make sure `NEXT_PUBLIC_ADMIN_EMAIL` in Netlify's environment variables is set to his exact email (e.g., `dr.j.logeshwaran@gmail.com`).
2. When the website is live, ask him to go to `logeswaran.com/signup`.
3. Have him sign up with that exact email address. 
4. The system will automatically recognize him as the Root Admin, and he can immediately navigate to `logeswaran.com/admin/dashboard` to manage his content.

### Step C: Transfer SendGrid (Optional)
If you used your own SendGrid account for email notifications (like Access Requests), ask him to create a free SendGrid account, generate an API key, and update the `SENDGRID_API_KEY` environment variable in Netlify.

---

## 6. Current Limitations & Things to Know
When handing this over, it's totally normal for an app to have some quirks. Inform the client about these so there are no surprises:

1. **Next.js Caching:** Next.js heavily caches pages for performance. If he edits a blog post or adds a project in the Admin Portal, and doesn't immediately see it on the public homepage, tell him it's just cached. Doing a hard refresh (`Ctrl + Shift + R`) usually clears it.
2. **Firebase Free Tier Limits:** The portfolio runs on the Firebase "Spark" (Free) plan. It includes 1GB of database storage and 50,000 document reads per day. For a personal academic portfolio, this is *more* than enough for a lifetime. However, if he decides to host massive gigabyte-sized video files, he will hit the Storage limit. Stick to images and PDFs!
3. **Image Compression:** The admin portal `ImageUploader` is fantastic, but tell him not to upload raw 15MB 4K photos straight from a DSLR camera as profile pictures. It slows down the site and eats his Firebase storage. Suggest compressing images via TinyPNG or similar before uploading.
