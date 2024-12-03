// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import withFirebaseAuth from 'react-with-firebase-auth';
import { signInWithPopup, signOut } from "firebase/auth";
import {useAuth} from '../auth/AuthUserProvider.tsx';
// import {db} from '../../../server/firebase.ts'
import {getDocs, query, where, collection, getFirestore, doc, getDoc, setDoc} from 'firebase/firestore'

const firebaseConfig = {
  apiKey:  import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const providers = {
  googleProvider: new GoogleAuthProvider(),
};
const createComponentWithAuth = withFirebaseAuth({
  providers,
  firebaseAppAuth: auth,
});

const db = getFirestore(app);

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, providers.googleProvider);
    const user = result.user;

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          savedRecipes: []
        });
        console.log("New user document created");
      } else {
        console.log("Existing user document found");
      }
    }
  } catch (error) {
    console.error("Error during sign-in or Firestore operation:", error);
  }
};

const signOutFirebase = () => {
  signOut(auth).then(() => {
    // Sign-out successful.
    console.log("User signed out successfully");
  }).catch((error) => {
    // An error happened.
    console.error("Error signing out:", error);
  });
};


export {auth, providers, signInWithGoogle, signOutFirebase, app}