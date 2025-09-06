'use client';
import { GoogleAuthProvider, signInWithRedirect, signOut as firebaseSignOut, User } from "firebase/auth";
import { auth } from "./firebase";

export const signInWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithRedirect(auth, provider);
        // No user is returned here. The user is available after redirect
        // via onAuthStateChanged or getRedirectResult.
        // The AuthProvider handles this.
    } catch (error) {
        console.error("Error signing in with Google: ", error);
        // Re-throw the error to be caught by the calling function
        throw error;
    }
};

export const signOut = async () => {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error("Error signing out: ", error);
    }
};
