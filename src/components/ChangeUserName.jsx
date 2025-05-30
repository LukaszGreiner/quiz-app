// src/components/ChangeUsername.js
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { showError, showSuccess } from "../utils/toastUtils";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useUsernameValidation } from "../hooks/useUsernameValidation";

function ChangeUsername({ toggleForm }) {
  const [newUsername, setNewUsername] = useState("");
  const [message, setMessage] = useState("");
  const { changeUsername } = useAuth();
  // Use username validation hook
  const {
    validationState: { isValid: isUsernameValid, error: validationMessage },
    isChecking: isCheckingUsername,
    validateUsername: checkUsername,
  } = useUsernameValidation();
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setNewUsername(value);
    setMessage(""); // Clear form message when typing
    checkUsername(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!isUsernameValid) {
      setMessage("Nazwa użytkownika nie jest prawidłowa");
      showError("Nazwa użytkownika nie jest prawidłowa");
      return;
    }

    try {
      await changeUsername(newUsername);
      setMessage("Zmieniono nazwę użytkownika!");
      showSuccess("Zmieniono nazwę użytkownika!");
      toggleForm();
      setNewUsername("");
    } catch (err) {
      setMessage(err.message);
      showError(err.message);
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-md">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
        Change Username
      </h1>
      {message && (
        <p
          className={`mb-4 text-center ${message.includes("Zmieniono") ? "text-success" : "text-warning"}`}
        >
          {message}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className="rounded-lg bg-white p-6 shadow-md"
      >
        {" "}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="mb-2 block font-medium text-gray-700"
          >
            New Username
          </label>
          <div className="relative">
            <input
              type="text"
              id="username"
              value={newUsername}
              onChange={handleUsernameChange}
              className={`w-full rounded-md border px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                newUsername.trim() && isUsernameValid
                  ? "border-green-500 ring-green-500/20"
                  : newUsername.trim() && !isUsernameValid
                    ? "border-red-500 ring-red-500/20"
                    : ""
              }`}
              placeholder="Enter new username"
              required
            />
            {newUsername.trim() && (
              <div className="absolute top-1/2 right-3 -translate-y-1/2">
                {isCheckingUsername ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                ) : isUsernameValid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
          </div>
          {newUsername.trim() && validationMessage && (
            <p
              className={`mt-2 text-sm ${
                isUsernameValid ? "text-green-600" : "text-red-600"
              }`}
            >
              {validationMessage}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={
            !newUsername.trim() || !isUsernameValid || isCheckingUsername
          }
          className="bg-primary hover:primary/90 w-full cursor-pointer rounded-md py-2 text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          Update Username
        </button>
      </form>
    </div>
  );
}

export default ChangeUsername;
