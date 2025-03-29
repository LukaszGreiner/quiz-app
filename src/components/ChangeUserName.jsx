// src/components/ChangeUsername.js
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { showError, showSuccess } from "../utils/toastUtils";

function ChangeUsername({ toggleForm }) {
  const [newUsername, setNewUsername] = useState("");
  const [message, setMessage] = useState("");
  const { changeUsername } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
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
        <div className="mb-4">
          <label
            htmlFor="username"
            className="mb-2 block font-medium text-gray-700"
          >
            New Username
          </label>
          <input
            type="text"
            id="username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter new username"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary hover:primary/90 w-full cursor-pointer rounded-md py-2 text-white transition-colors"
        >
          Update Username
        </button>
      </form>
    </div>
  );
}

export default ChangeUsername;
