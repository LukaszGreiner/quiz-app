import { useState } from "react";
import { useAuth } from "../context/AuthContext";
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

  const [username, setUsername] = useState(
    location.state?.username || currentUser?.displayName || "User"
  );
  const [description, setDescription] = useState(
    location.state?.description || "No description provided."
  );
  const [userType, setUserType] = useState(
    location.state?.userType || "Not specified"
  );
  const [goal, setGoal] = useState(location.state?.goal || "Not specified");
  const [profileImage, setProfileImage] = useState(
    currentUser?.photoURL || "/profile_icon.jpg"
  );
  const [email, setEmail] = useState(
    location.state?.email || currentUser?.email || ""
  );

  const handleEditProfile = () => {
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
      <p className="mt-8 text-center text-lg font-medium font-quicksand text-dark">
        Loading...
      </p>
    );
  }

  const lastLogin = currentUser.lastLogin
    ? new Date(currentUser.lastLogin).toLocaleString()
    : "Unknown";

  return (
    <div className="mx-auto mt-12 max-w-2xl px-4">
      <div className="rounded-xl bg-background p-8 shadow-lg transition-all hover:shadow-xl">
        <h1 className="mb-8 text-center font-montserrat text-4xl font-bold tracking-tight text-dark">
          Your Profile
        </h1>
        <ProfileImageEditor
          initialImage={profileImage}
          onEditProfile={handleEditProfile}
        />
        <LevelBar currentUser={currentUser} />
        <Achievements />
        <ProfileInfo
          displayName={username}
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