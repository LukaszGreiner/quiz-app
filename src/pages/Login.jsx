import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { showError, showSuccess } from "../utils/toastUtils";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await login(email, password);
      const user = userCredential.user;

      // Update lastLogin property
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        lastLogin: new Date().toISOString(),
      });

      navigate("/user/details");
    } catch (err) {
      setError("Nieprawidłowa dane logowania");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user document already exists
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Generate a unique username for Google users
        const adjectives = ["Cool", "Happy", "Smart", "Quick", "Brave"];
        const nouns = ["Penguin", "Tiger", "Eagle", "Fox", "Wolf"];
        let username;
        let isUnique = false;

        while (!isUnique) {
          const randomAdj =
            adjectives[Math.floor(Math.random() * adjectives.length)];
          const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
          const randomNum = Math.floor(Math.random() * 1000);
          username = `${randomAdj}${randomNoun}${randomNum}`;

          const q = query(
            collection(db, "users"),
            where("username", "==", username),
          );
          const querySnapshot = await getDocs(q);
          isUnique = querySnapshot.empty;
        }

        // Create user document
        await setDoc(userDocRef, {
          email: user.email,
          username: username,
          createdAt: new Date().toISOString(),
          isAdmin: false,
          lastLogin: new Date().toISOString(),
        });
      } else {
        // Update lastLogin property
        await updateDoc(userDocRef, {
          lastLogin: new Date().toISOString(),
        });
      }

      navigate("/user/details");
    } catch (err) {
      setError("Logowanie się nie powiodło!");
    }
  };
  return (
    <div className="mx-auto mt-8 max-w-md">
      <h1 className="text-text mb-6 text-center text-3xl font-bold">Sign in</h1>
      {error && <p className="text-incorrect mb-4 text-center">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="bg-surface-elevated border-border rounded-lg border p-6 shadow-md"
      >
        {" "}
        <div className="mb-4">
          <label htmlFor="email" className="text-text mb-2 block font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-border bg-surface text-text focus:ring-primary focus:border-border-focus w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="text-text mb-2 block font-medium"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-border bg-surface text-text focus:ring-primary focus:border-border-focus w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="Enter your password"
            required
          />
        </div>{" "}
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-text-inverse mb-4 w-full cursor-pointer rounded-md py-2 transition-colors"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="border-border bg-surface-elevated text-text hover:bg-surface mb-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border py-2 transition-colors"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.24 10.32v3.26h5.47c-.22 1.4-.86 2.57-1.82 3.37l2.96 2.27c1.77-1.64 2.8-4.04 2.8-6.9 0-.66-.06-1.3-.17-1.92h-9.24z"
              fill="#4285F4"
            />
            <path
              d="M12 22c2.9 0 5.36-1.02 7.35-2.76l-2.96-2.27c-.9.6-2.03.95-3.39.95-2.6 0-4.8-1.75-5.58-4.11h-3.06v2.3C6.26 19.38 9 22 12 22z"
              fill="#34A853"
            />
            <path
              d="M6.42 13.89c-.2-.6-.31-1.24-.31-1.89s.11-1.29.31-1.89v-2.3h-3.06C2.96 8.8 2.74 10.36 2.74 12s.22 3.2.62 4.11l3.06-2.22z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.69c1.47 0 2.79.5 3.83 1.48l2.86-2.86C16.83 2.44 14.52 1.69 12 1.69 9 1.69 6.26 4.31 5.36 7.58l3.06 2.22c.78-2.36 2.98-4.11 5.58-4.11z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>{" "}
        <div className="text-text-muted flex justify-between text-sm">
          <Link
            to="/reset-password"
            className="hover:text-primary transition-colors"
          >
            Forgot password?
          </Link>
          <p>
            No account?{" "}
            <Link
              to="/signup"
              className="text-primary transition-colors hover:underline"
            >
              Create here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
