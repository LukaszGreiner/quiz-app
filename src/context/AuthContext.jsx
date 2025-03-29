// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Generate a username based on user UUID (user.uid)
    const username = `user_${user.uid}`;

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      username: username,
      createdAt: new Date().toISOString(),
      isAdmin: false, // Default to false
    });

    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };

  // Function to change username
  const changeUsername = async (newUsername) => {
    if (!currentUser) throw new Error("Użytkownik nie jest zalogowany");

    // Validate new username
    if (!newUsername || newUsername.trim().length < 3) {
      throw new Error(
        "Nazwa użytkownika musi składać się z co najmniej 3 liter",
      );
    }

    // Check if username is unique
    const q = query(
      collection(db, "users"),
      where("username", "==", newUsername.trim()),
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error("Nazwa użytkownika jest zajęta");
    }

    // Update username in Firestore
    await setDoc(
      doc(db, "users", currentUser.uid),
      { username: newUsername.trim() },
      { merge: true },
    );
    return newUsername;
  };

  const value = {
    isAuthenticated,
    currentUser,
    login,
    signup,
    logout,
    changeUsername,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
