import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileImageEditor from "../components/UserPage/ProfileImageEditor";
import SavedQuizzes from "../components/UserPage/SavedQuizzes";
import QuizHistory from "../components/UserPage/QuizHistory";
import CreatedQuizzes from "../components/UserPage/CreatedQuizzes";
import Achievements from "../components/UserPage/Achievements";
import ProfileInfo from "../components/UserPage/ProfileInfo";
import LevelBar from "../components/UserPage/LevelBar";

function UserPage() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Stan profilu
  const [username, setUsername] = useState(location.state?.username || null);
  const [description, setDescription] = useState(
    location.state?.description ||
      currentUser?.profileDescription ||
      "No description provided."
  );
  const [userType, setUserType] = useState(
    location.state?.userType || currentUser?.userType || "Not specified"
  );
  const [goal, setGoal] = useState(
    location.state?.goal || currentUser?.goal || "Not specified"
  );
  const [profileImage, setProfileImage] = useState(
    currentUser?.photoURL || "/profile_icon.jpg"
  );
  const [email, setEmail] = useState(
    location.state?.email || currentUser?.email || ""
  );

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUsername(userDoc.data().username || username);
        } else {
          console.error("Nie znaleziono takiego użytkownika!");
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleEditProfile = () => {
    // Przekaz dane do EditProfile
    navigate("/user/edit-profile", {
      state: {
        username,
        email,
        userType,
        goal,
        description,
      },
    });
  };

  if (!currentUser) {
    return (
      <p className="mt-8 text-center text-lg font-medium text-gray-500">
        Loading...
      </p>
    );
  }

  const lastLogin = currentUser.lastLogin
    ? new Date(currentUser.lastLogin).toLocaleString()
    : "Unknown";

  return (
    <div className="mx-auto mt-12 max-w-2xl px-4">
      <div className="rounded-xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg transition-all hover:shadow-xl">
        <h1 className="mb-8 text-center font-serif text-4xl font-bold tracking-tight text-gray-800">
          Your Profile
        </h1>
        <ProfileImageEditor
          initialImage={profileImage}
          onEditProfile={handleEditProfile}
        />
        <LevelBar currentUser={currentUser} />
        <Achievements />
        <ProfileInfo
          displayName={currentUser.displayName || username}
          creationTime={currentUser.metadata.creationTime}
          lastLogin={lastLogin}
        />
        <SavedQuizzes />
        <QuizHistory />
        <CreatedQuizzes />
      </div>
    </div>
  );
}

export default UserPage;