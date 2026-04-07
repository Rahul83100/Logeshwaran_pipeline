# Comprehensive Deployment & Handoff Guide

This guide provides step-by-step instructions on how to hand over the portfolio project to the client, set it up on their local machine, configure their own Firebase and email services, and deploy the application to production using their custom domain.

---

## 1. Prerequisites (Client's Laptop Setup)
Before starting, ensure the client has the following installed on their laptop:
- **Node.js**: Download and install the latest LTS version from [nodejs.org](https://nodejs.org/).
- **Git**: Download and install from [git-scm.com](https://git-scm.com/).
- **Code Editor**: e.g., Visual Studio Code.

---

## 2. Firebase Setup (Client's Account)
The client needs their own Firebase project to manage their data securely.

### Step 2.1: Create Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and follow the prompts. (You can enable Google Analytics if desired).
3. If the project requires higher limits or Cloud Functions later, switch the billing plan from Spark (Free) to **Blaze (Pay as you go)** under the *Billing* section.

### Step 2.2: Add Web App & Get Keys
1. In the Firebase console overview page, click the **Web `</>`** icon to add a new web app.
2. Name the app (e.g., "Portfolio Website").
3. Copy the `firebaseConfig` object details (API key, authDomain, projectId, etc.). You will need these for the `.env.local` file.

### Step 2.3: Set up Authentication
1. Go to **Build > Authentication** in the left sidebar.
2. Click **Get Started**, then click **Sign-in method**.
3. Enable **Email/Password**.
4. Go to the **Users** tab and click **Add user**. Create the Admin account (e.g., `admin@theirdomain.com` and a strong password). Save these credentials as they will be `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the environment variables.

### Step 2.4: Set up Firestore Database & Rules
1. Go to **Build > Firestore Database** and click **Create database**.
2. Start in **Production mode**. Choose a location closest to their audience.
3. Once created, go to the **Rules** tab and paste the following security rules:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Function to check if the user is an admin
    // Replace the email below with the exact admin email created in Step 2.3
    function isAdmin() {
      return request.auth != null && request.auth.token.email == "admin@theirdomain.com";
    }

    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }

    // Profile data is fully public
    match /profile/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Resume document is public
    match /resume/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Users collection rules
    match /users/{userId} {
      // User can read their own document
      allow read: if request.auth != null && request.auth.uid == userId;
      // Admins can read and write all users
      allow read, write: if isAdmin();
      // Allow users to create their document upon sign-up securely
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId
                    && !request.resource.data.diff(resource.data).affectedKeys()
                    .hasAny(['role', 'access_level']);
    }

    // AccessRequests collection rules
    match /access_requests/{requestId} {
      allow read: if isAdmin() || (request.auth != null && request.auth.uid == resource.data.uid);
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }
  }
}
\`\`\`
*(Make sure to update the `isAdmin()` function's email string to match their admin email).*

---

## 3. Email Automation Setup (SendGrid)
Since the client has their own domain, they should set up SendGrid for reliable email delivery.

### Step 3.1: Create SendGrid Account
1. Sign up at [SendGrid](https://sendgrid.com/).
2. Create an API key: Go to **Settings > API Keys > Create API Key**. Give it **Full Access**, create it, and copy the key (starts with `SG.`).

### Step 3.2: Domain Authentication (Sender Identity)
1. In SendGrid, go to **Settings > Sender Authentication**.
2. Click **Authenticate Your Domain**.
3. Enter their domain (e.g., `theirdomain.com`).
4. SendGrid will provide several DNS records (CNAME). The client must add these to their domain registrar (GoDaddy, Namecheap, Route53, etc.).
5. Click **Verify** in SendGrid. Once verified, emails sent from `admin@theirdomain.com` will not go to spam.

---

## 4. Local Setup & Data Migration
Now, pull the code onto the client's laptop and configure it.

1. Open the terminal and clone the repository:
   \`\`\`bash
   git clone <repository_url>
   cd logishoren-portfolio
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a `.env.local` file in the root of the project and fill in the client's details:

   \`\`\`env
   # Firebase Config (From Step 2.2)
   NEXT_PUBLIC_FIREBASE_API_KEY=their_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=their_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=their_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=their_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=their_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=their_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=their_measurement_id
   
   # Server-side Firebase
   FIREBASE_PROJECT_ID=their_project_id
   
   # Admin Credentials (From Step 2.3)
   ADMIN_EMAIL=admin@theirdomain.com
   ADMIN_PASSWORD=their_secure_admin_password
   
   # SendGrid API Key (From Step 3.1)
   SENDGRID_API_KEY=SG.their_sendgrid_key
   
   # Site URL (Use localhost for testing, change for production deployment)
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   \`\`\`

4. **Data Migration**: To seed the client's empty Firestore database with initial layout structures, run the local dev server and log into the Admin Dashboard. Use the dashboard's creation functions to re-enter data, or write a quick script to copy over documents from the old Firebase project if raw structure copy is needed.
   
5. Start the local server to verify:
   \`\`\`bash
   npm run dev
   \`\`\`

---

## 5. Production Deployment (Vercel)
Vercel is the recommended hosting platform for Next.js applications.

1. Go to [Vercel](https://vercel.com/) and sign up with GitHub/GitLab.
2. Click **Add New > Project** and import the repository containing the portfolio.
3. During the setup phase on Vercel, open the **Environment Variables** section. Add **all** the variables from the `.env.local` file (Update `NEXT_PUBLIC_SITE_URL` to the final domain URL like `https://theirdomain.com`).
4. Click **Deploy**.
5. Once deployed, to assign their custom domain: Go to the Vercel project's **Settings > Domains**.
6. Add `theirdomain.com`. Vercel will provide IP/Nameserver instructions to point the domain registrar to Vercel.

---

## 6. Post-Deployment Verification
- Ensure the production domain has TLS/SSL activated.
- Try an **Access Request** flow: Log in as a normal user, submit an access request. Check that the admin email receives the SendGrid email, click the "Approve" link, and verify the user gets permission.
- Log into the Admin Dashboard (`https://theirdomain.com/admin/login`) and ensure the content editing interfaces work correctly and sync with the frontend.
