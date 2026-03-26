import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

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

createUserWithEmailAndPassword(auth, "rahul636071@gmail.com", "admin12345")
  .then((userCredential) => {
    console.log("Admin account created successfully:", userCredential.user.email);
    process.exit(0);
  })
  .catch((error) => {
    if (error.code === 'auth/email-already-in-use') {
       console.log("Account already exists! Try resetting the password or logging in.");
    } else {
       console.error("Error creating account:", error);
    }
    process.exit(1);
  });
