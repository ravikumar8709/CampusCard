'use client';
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, User } from "firebase/auth";
import { auth } from "./firebase";

export const signInWithGoogle = async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
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
