import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function UserPage() {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] = useState(
    currentUser.profileDescription || "No description provided."
  );
  const [userType, setUserType] = useState(currentUser.userType || "Not specified");
  const [goal, setGoal] = useState(currentUser.goal || "Not specified");
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile({
        profileDescription: description,
        userType,
        goal,
      });
      setIsEditingDescription(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  if (!currentUser) {
    return (
      <p className="mt-8 text-center text-lg font-medium text-gray-500">
        Loading...
      </p>
    );
  }

  const profileImage = currentUser.photoURL || "/profile_icon.jpg";
  const experience = currentUser.experience || 0;
  const level = Math.floor(experience / 500) + 1;
  const experienceToNextLevel = 500 - (experience % 500);
  const progressPercentage = ((experience % 500) / 500) * 100;
  const lastLogin = currentUser.lastLogin
    ? new Date(currentUser.lastLogin).toLocaleString()
    : "Unknown";

  return (
    <div className="mx-auto mt-12 max-w-lg px-4">
      <h1 className="mb-8 text-center text-4xl font-serif font-bold text-gray-800 tracking-tight">
        Your Profile
      </h1>
      <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg transition-all hover:shadow-xl">
        {/* Profile Image */}
        <div className="mb-6 flex justify-center">
          <img
            src={profileImage}
            alt="Profile"
            className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md transition-transform hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Experience and Level Bar */}
        <div className="mb-8">
          <label className="mb-2 block text-sm font-medium text-gray-600">
            Level {level}
          </label>
          <div className="relative h-3 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="absolute h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {experience} / 500 XP • <span className="font-medium">{experienceToNextLevel} XP</span> to next level
          </p>
        </div>

        {/* Name */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-600">Name</label>
          <p className="text-lg font-semibold text-gray-900">
            {currentUser.displayName || "Not provided"}
          </p>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-600">Email</label>
          <p className="text-lg text-gray-900">{currentUser.email}</p>
        </div>

        {/* Joined */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-600">Joined</label>
          <p className="text-lg text-gray-900">
            {currentUser.metadata.creationTime
              ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
              : "Unknown"}
          </p>
        </div>

        {/* Last Login */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-600">Last Login</label>
          <p className="text-lg text-gray-900">{lastLogin}</p>
        </div>

        {/* User Type Selector */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-600">User Type</label>
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
            <option value="Inne">Inne</option>
          </select>
        </div>

        {/* Goal Selector */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-600">Goal</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="Własny rozwój">Własny rozwój</option>
            <option value="Nauczanie">Nauczanie</option>
          </select>
        </div>

        {/* Profile Description Textbox */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-600">About Me</label>
          {isEditingDescription ? (
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                rows="4"
                placeholder="Tell us about yourself..."
              />
              <button
                onClick={handleSaveProfile}
                className="mt-2 rounded-lg bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <p
              onClick={() => setIsEditingDescription(true)}
              className="text-gray-700 italic leading-relaxed cursor-pointer hover:text-indigo-600 transition-colors"
            >
              {description}
            </p>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full rounded-lg bg-gradient-to-r from-red-500 to-red-600 py-3 text-white font-medium tracking-wide shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserPage;