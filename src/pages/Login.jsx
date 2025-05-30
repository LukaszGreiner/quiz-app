import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Btn from "../components/common/Btn";
import Logo from "../components/common/Logo";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, handleGoogleAuth } = useAuth();
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

      // Check if user has completed profile setup
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      if (userData?.profileCompleted) {
        navigate("/user/details");
      } else {
        navigate("/profile-setup");
      }
    } catch {
      setError("Nieprawidłowa dane logowania");
    }
  };
  const handleGoogleLogin = async () => {
    setError("");
    try {
      const result = await handleGoogleAuth();
      const userData = result.userData;

      // Check if user has completed profile setup
      if (userData?.profileCompleted) {
        navigate("/user/details");
      } else {
        navigate("/profile-setup");
      }
    } catch (error) {
      console.error("Google login error:", error);
      // Sprawdź czy popup został zablokowany
      if (error.code === "auth/popup-blocked") {
        setError("Popup został zablokowany. Sprawdź ustawienia przeglądarki.");
      } else if (error.code === "auth/popup-closed-by-user") {
        setError("Logowanie zostało anulowane.");
      } else {
        setError("Logowanie się nie powiodło!");
      }
    }
  };
  return (
    <div className="bg-background flex min-h-screen w-screen flex-col items-center p-6">
      <div className="sm:w-sm md:w-md">
        <Logo className="mb-12 flex" />

        <h1 className="mb-2 text-center text-2xl">Logowanie</h1>
        <p className="text-text-muted mb-12 text-center">
          Zaloguj się, aby kontynuować
        </p>

        {error && (
          <div className="bg-incorrect/10 border-incorrect text-incorrect mb-6 rounded-lg border px-4 py-3 text-center text-sm">
            {error}
          </div>
        )}

        <div className="bg-surface-elevated border-border overflow-hidden rounded-lg border shadow-md">
          {" "}
          <div className="space-y-4 p-6">
            <Btn
              type="button"
              variant="outline"
              size="lg"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-2"
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
              Kontynuuj za pomocą Google
            </Btn>
          </div>
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="border-border w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-surface-elevated text-text-muted px-4">
                lub
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 p-6 pt-0">
            <div>
              <label
                htmlFor="email"
                className="text-text mb-1.5 block text-sm font-medium"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-border bg-surface text-text focus:ring-primary/20 focus:border-border-focus hover:border-border-focus w-full rounded-md border px-3 py-2.5 transition-colors focus:ring-4 focus:outline-none"
                placeholder="Wpisz swój email"
                required
                aria-describedby="email-error"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-text mb-1.5 block text-sm font-medium"
              >
                Hasło
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-border bg-surface text-text focus:ring-primary/20 focus:border-border-focus hover:border-border-focus w-full rounded-md border px-3 py-2.5 transition-colors focus:ring-4 focus:outline-none"
                  placeholder="Wpisz hasło"
                  required
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-muted hover:text-text focus:text-text focus:ring-primary/20 absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 focus:ring-2 focus:outline-none"
                  aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              {" "}
              <Btn type="submit" variant="primary" size="lg" className="w-full">
                Logowanie
              </Btn>
            </div>
          </form>
        </div>

        <div className="text-text-muted mt-6 flex flex-col items-center justify-between gap-3 text-sm sm:flex-row">
          <Link
            to="/reset-password"
            className="text-primary hover:text-primary/85 focus:ring-primary/20 rounded-md px-1 py-1 transition-colors focus:ring-2 focus:outline-none"
          >
            Nie pamiętasz hasła?
          </Link>
          <p className="text-center">
            Nie masz jeszcze konta?{" "}
            <Link
              to="/signup"
              className="text-primary hover:text-primary/85 focus:ring-primary/20 rounded-md px-1 py-1 transition-colors focus:ring-2 focus:outline-none"
            >
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
