# 🛠️ Rahul's Project Management Commands

This guide contains all the essential commands to manage the Logeshwaran Portfolio project, handle intern updates, and run the development environment.

---

## 🚀 1. Local Development
Commands to get the project running on your machine.

### Start the Development Server
Runs the site at **http://localhost:3000** with hot-reloading (changes show up instantly).
```bash
npm run dev
```

### Install New Dependencies
Run this if an intern adds a new package (like a library for animations or icons).
```bash
npm install
```

---

## 📂 2. Managing Intern Changes
How to pull, preview, and merge work from your interns (Anagha, Meedhansh).

### Step A: Fetch Latest Changes
Always run this first to see what's new on GitHub without changing your local files.
```bash
git fetch origin
```

### Step B: Preview an Intern's Branch
If Anagha says she's finished work on `feature/anagha-data-integration`, run this to switch to her branch and see it locally.
```bash
git checkout feature/anagha-data-integration
# Then run 'npm run dev' to see her changes
```

### Step C: Merge into Develop (Testing)
Once you've previewed the branch and like it, merge it into the `develop` branch.
```bash
# 1. Switch to develop
git checkout develop

# 2. Pull latest develop just in case
git pull origin develop

# 3. Merge the intern's branch
git merge origin/feature/anagha-data-integration --no-edit
```

### Step D: Make it "Live" on Main
After testing on `develop`, merge everything into the `main` branch.
```bash
# 1. Switch to main
git checkout main

# 2. Merge develop into main
git merge develop --no-edit

# 3. Push to GitHub
git push origin main
```

---

## 🔍 3. Useful Utilities

### Check What Branch You're On
```bash
git branch
```

### Check for Unsaved Changes
```bash
git status
```

### Discard Local Changes (Safety Reset)
If you made a mistake and want to revert a file to the last saved version:
```bash
git restore <filename>
```

### Stash Changes
If git won't let you switch branches because of unsaved changes, "hide" them temporarily:
```bash
git stash
# Then later, to bring them back:
git stash pop
```

---

## 🗑️ 4. Deleting a User
Currently, the Admin Portal lets you **Revoke Access** (makes them public), but to completely **Delete** a user from the system, you must use the Firebase Console.

### Step 1: Delete Login Credentials (Auth)
1. Go to the [Firebase Console](https://console.firebase.google.com/u/0/project/logeshwaran-7e490/authentication/users)
2. Search for the user's email.
3. Click the **3 dots (⋮)** next to their name and select **Delete account**.

### Step 2: Delete Data (Firestore)
1. Go to the [Firestore Database](https://console.firebase.google.com/u/0/project/logeshwaran-7e490/firestore/databases/-default-/data)
2. Go to the `users` collection and delete the document with their UID.
3. Go to the `access_requests` collection and delete their requests by searching for their email.

---

> [!TIP]
> **Pro Workflow:** Always test changes on the `develop` branch first. Only merge to `main` when you're 100% happy with how it looks on localhost:3000.
