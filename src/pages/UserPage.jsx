import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Make sure to import db for Firestore access
import ChangeUsername from "../components/ChangeUserName";
import LevelBar from "../components/UserPage/LevelBar";

function UserPage() {
  const { currentUser, logout } = useAuth();
  const [username, setUsername] = useState(null); // State to store username
  const [showUsernameForm, setShowUsernameForm] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUsername(userDoc.data().username); // Set the username from Firestore
        } else {
          console.error("Nie znaleziono takiego użytkownika!");
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const [description, setDescription] = useState(
    currentUser.profileDescription || "No description provided.",
  );
  const [userType, setUserType] = useState(
    currentUser.userType || "Not specified",
  );
  const [goal, setGoal] = useState(currentUser.goal || "Not specified");
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect logic here if needed
    } catch (error) {
      console.error("Wystąpił błąd z wylogowaniem:", error);
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

  const lastLogin = currentUser.lastLogin
    ? new Date(currentUser.lastLogin).toLocaleString()
    : "Unknown";

  return (
    <div className="mx-auto mt-12 max-w-lg px-4">
      <h1 className="mb-8 text-center font-serif text-4xl font-bold tracking-tight text-gray-800">
        Your Profile
      </h1>

      <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg transition-all hover:shadow-xl">
        {/* Profile Image */}
        <div className="mb-6 flex justify-center">
          <img
            src={profileImage}
            alt="Profile"
            className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-md transition-transform hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>

        <LevelBar currentUser={currentUser} />

        {/* Name */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Name
          </label>
          <p className="text-lg font-semibold text-gray-900">
            {currentUser.displayName || "Not provided"}
          </p>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Email
          </label>
          <p className="text-lg text-gray-900">{currentUser.email}</p>
        </div>

        {/* Joined */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Joined
          </label>
          <p className="text-lg text-gray-900">
            {currentUser.metadata.creationTime
              ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
              : "Unknown"}
          </p>
        </div>

        {/* Last Login */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Last Login
          </label>
          <p className="text-lg text-gray-900">{lastLogin}</p>
        </div>

        {/* User Type Selector */}
        <div className="mb-6">
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
            <option value="Inne">Inne</option>
          </select>
        </div>

        {/* Goal Selector */}
        <div className="mb-6">
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

        {/* Profile Description Textbox */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            About Me
          </label>
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
                className="mt-2 rounded-lg bg-indigo-500 px-4 py-2 text-white transition-colors hover:bg-indigo-600"
              >
                Save
              </button>
            </div>
          ) : (
            <p
              onClick={() => setIsEditingDescription(true)}
              className="cursor-pointer leading-relaxed text-gray-700 italic transition-colors hover:text-indigo-600"
            >
              {description}
            </p>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full rounded-lg bg-gradient-to-r from-red-500 to-red-600 py-3 font-medium tracking-wide text-white shadow-md transition-all duration-300 hover:from-red-600 hover:to-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserPage;
