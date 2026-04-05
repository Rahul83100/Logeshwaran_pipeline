import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCD-EQscPp7zjSCt5rlZ1ZHvHJrMUrCZwg",
    authDomain: "logeshwaran-7e490.firebaseapp.com",
    projectId: "logeshwaran-7e490",
    storageBucket: "logeshwaran-7e490.firebasestorage.app",
    messagingSenderId: "331978304903",
    appId: "1:331978304903:web:a8b8c6c2cf4664e7397722"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function elevateUser(uid, email) {
    try {
        await setDoc(doc(db, 'users', uid), {
            uid: uid,
            email: email,
            name: "Admin User",
            role: "admin",
            access_level: "private",
            updated_at: serverTimestamp()
        }, { merge: true });
        console.log(`Successfully elevated user ${email} (${uid}) to admin in Firestore.`);
    } catch (error) {
        console.error("Error elevating user:", error);
    }
    process.exit(0);
}

// Note: You need the UID of the user from the Firebase Console or Auth state.
// Since I don't have the UID, I am providing this script for you to run.
// Replace the values below with your actual UID and email once you have them.

console.log("Usage: node fix-permissions.mjs <UID> <EMAIL>");
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log("Missing arguments. Please provide UID and EMAIL.");
    process.exit(1);
}

elevateUser(args[0], args[1]);
