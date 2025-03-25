import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

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
      setSuccess("Password reset email sent! Check your inbox.");
      setEmail("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-md">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
        Forgot Password
      </h1>
      {success && <p className="mb-4 text-center text-green-500">{success}</p>}
      {error && <p className="mb-4 text-center text-red-500">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="rounded-lg bg-white p-6 shadow-md"
      >
        <div className="mb-6">
          <label
            htmlFor="email"
            className="mb-2 block font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your email"
            required
          />
        </div>
        <button
          type="submit"
          className="mb-4 w-full rounded-md bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Reset Password
        </button>

        <div className="text-center text-sm text-gray-600">
          <p>
            Remember your password?{" "}
            <Link
              to="/user/login"
              className="text-blue-600 transition-colors hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
