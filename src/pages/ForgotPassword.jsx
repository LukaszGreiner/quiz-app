import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import Btn from "../components/common/Btn";
import Logo from "../components/common/Logo";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(
        "Email z linkiem do resetowania hasła został wysłany! Sprawdź swoją skrzynkę odbiorczą.",
      );
      setEmail("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-background flex min-h-screen w-screen flex-col items-center p-6">
      <div className="sm:w-sm md:w-md">
        <Logo className="mb-12 flex" />

        <h1 className="mb-2 text-center text-2xl">Nie pamiętasz hasła?</h1>
        <p className="text-text-muted mb-12 text-center">
          Aby zresetować hasło, wpisz adres e-mail powiązany ze swoim kontem.
        </p>

        {success && (
          <div className="bg-correct/10 border-correct text-correct mb-6 rounded-lg border px-4 py-3 text-center text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-incorrect/10 border-incorrect text-incorrect mb-6 rounded-lg border px-4 py-3 text-center text-sm">
            {error}
          </div>
        )}

        <div className="bg-surface-elevated border-border overflow-hidden rounded-lg border shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div>
              <label
                htmlFor="email"
                className="text-text mb-1.5 block text-sm font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-border bg-surface text-text focus:ring-primary/20 focus:border-border-focus hover:border-border-focus w-full rounded-md border px-3 py-2.5 transition-colors focus:ring-4 focus:outline-none"
                placeholder="Wprowadź swój email"
                required
              />
            </div>

            <div className="pt-2">              <Btn
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                Zresetuj Hasło
              </Btn>
            </div>
          </form>
        </div>

        <div className="text-text-muted mt-6 text-center text-sm">
          <p>
            Pamiętasz swoje hasło?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/85 focus:ring-primary/20 rounded-md px-1 py-1 transition-colors focus:ring-2 focus:outline-none"
            >
              Zaloguj się tutaj
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
