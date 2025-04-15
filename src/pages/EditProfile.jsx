import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileSettings from "../components/UserPage/ProfileSettings";
import AccountActions from "../components/UserPage/AccountActions";

function EditProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Pobierz dane z nawigacji lub ustaw domyślne
  const [username, setUsername] = useState(location.state?.username || "");
  const [email, setEmail] = useState(
    location.state?.email || currentUser?.email || ""
  );
  const [userType, setUserType] = useState(
    location.state?.userType || "Not specified"
  );
  const [goal, setGoal] = useState(location.state?.goal || "Not specified");
  const [description, setDescription] = useState(
    location.state?.description || "No description provided."
  );

  const handleSaveProfile = async (profileData) => {
    try {
      // Symulacja zapisu (bez Firebase)
      setUsername(profileData.username);
      setEmail(profileData.email);
      setUserType(profileData.userType);
      setGoal(profileData.goal);
      setDescription(profileData.description);

      // Przekaz dane z powrotem do UserPage
      navigate("/user/details", {
        state: {
          username: profileData.username,
          email: profileData.email,
          userType: profileData.userType,
          goal: profileData.goal,
          description: profileData.description,
        },
      });
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

  return (
    <div className="mx-auto mt-12 max-w-2xl px-4">
      <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg transition-all hover:shadow-xl">
        <h1 className="mb-8 text-center font-serif text-4xl font-bold tracking-tight text-gray-800">
          Edit Profile
        </h1>
        <ProfileSettings
          initialUsername={username}
          initialEmail={email}
          initialUserType={userType}
          initialGoal={goal}
          initialDescription={description}
          onSave={handleSaveProfile}
        />
        <AccountActions onLogout={logout} />
      </div>
    </div>
  );
}

export default EditProfile;