import { initializeApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCD-EQscPp7zjSCt5rlZ1ZHvHJrMUrCZwg",
    authDomain: "logeshwaran-7e490.firebaseapp.com",
    projectId: "logeshwaran-7e490",
    storageBucket: "logeshwaran-7e490.firebasestorage.app",
    messagingSenderId: "331978304903",
    appId: "1:331978304903:web:a8b8c6c2cf4664e7397722"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

sendPasswordResetEmail(auth, "rahul636071@gmail.com")
  .then(() => {
    console.log("Password reset email sent successfully to rahul636071@gmail.com!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error sending password reset email:", error);
    process.exit(1);
  });
