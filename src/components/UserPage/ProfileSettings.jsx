import { useState } from "react";

function ProfileSettings({
  initialUsername,
  initialEmail,
  initialUserType,
  initialGoal,
  initialDescription,
  onSave,
}) {
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [userType, setUserType] = useState(initialUserType);
  const [goal, setGoal] = useState(initialGoal);
  const [description, setDescription] = useState(initialDescription);

  const handleSave = async () => {
    try {
      await onSave({ username, email, userType, goal, description });
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Profile Settings
      </h2>

      {/* Username */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {/* User Type */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          User Type
        </label>
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Student">Student</option>
          <option value="Uczeń">Uczeń</option>
          <option value="Nauczyciel">Nauczyciel</option>
          <option value="Wykładowca">Wykładowca</option>
          <option value="Pracownik">Pracownik</option>
          <option value="Ankieter">Ankieter</option>
          <option value="Inne">Inne</option>
        </select>
      </div>

      {/* Goal */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          Goal
        </label>
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="Własny rozwój">Własny rozwój</option>
          <option value="Nauczanie">Nauczanie</option>
        </select>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          About Me
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
          rows="4"
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-white transition-colors hover:bg-indigo-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default ProfileSettings;