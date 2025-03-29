import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Make sure to import db for Firestore access
import ChangeUsername from "../components/ChangeUserName";

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

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect logic here if needed
    } catch (error) {
      console.error("Wystąpił błąd z wylogowaniem:", error);
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
        User Profile
      </h1>

      <div className="rounded-lg bg-white p-6 shadow-md">
        {/* User Info Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Account Details
          </h2>
          <div className="mt-4 space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Email:</span>{" "}
              {currentUser?.email || "Not available"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Username:</span>{" "}
              {username || "Not set"}{" "}
              {/* Display the username from Firestore */}
            </p>
          </div>
        </div>

        {/* Change Username Section */}
        <div className="mb-6">
          <button
            onClick={() => setShowUsernameForm(!showUsernameForm)}
            className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            {showUsernameForm ? "Cancel" : "Change Username"}
          </button>

          {showUsernameForm && (
            <div className="mt-4">
              <ChangeUsername toggleForm={setShowUsernameForm} />
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserPage;
