import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import auth from "../firebase/firebase.init";
import axios from "axios";

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create user with email & password
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign in with email & password
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google
  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Update user profile
  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  // Password reset
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Log out
  const logOut = () => {
    setLoading(true);
    setDbUser(null);
    return signOut(auth);
  };

  // Fetch user from MongoDB
  const fetchDbUser = async (firebaseUser) => {
    if (!firebaseUser?.email) {
      setDbUser(null);
      return null;
    }

    try {
      const token = await firebaseUser.getIdToken();
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDbUser(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching dbUser:", error);
      setDbUser(null);
      return null;
    }
  };

  // Refresh dbUser (call this after role changes)
  const refreshDbUser = async () => {
    if (user) {
      return await fetchDbUser(user);
    }
    return null;
  };

  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch MongoDB user data
        await fetchDbUser(currentUser);
      } else {
        setDbUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    dbUser,
    loading,
    createUser,
    signIn,
    googleSignIn,
    updateUserProfile,
    resetPassword,
    logOut,
    refreshDbUser,
    isAdmin: dbUser?.role === "admin",
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
