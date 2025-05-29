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
    location.state?.username || currentUser?.displayName || "User",
  );
  const [description, setDescription] = useState(
    location.state?.description || "No description provided.",
  );
  const [userType, setUserType] = useState(
    location.state?.userType || "Not specified",
  );
  const [goal, setGoal] = useState(location.state?.goal || "Not specified");
  const [profileImage, setProfileImage] = useState(
    currentUser?.photoURL || "/profile_icon.jpg",
  );
  const [email, setEmail] = useState(
    location.state?.email || currentUser?.email || "",
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
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="bg-surface mx-auto mb-6 h-20 w-20 rounded-full"></div>
            <div className="bg-surface mx-auto mb-3 h-4 w-32 rounded"></div>
            <div className="bg-surface mx-auto h-3 w-24 rounded"></div>
          </div>
          <p className="font-quicksand text-text-muted mt-6 text-xl font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  const lastLogin = currentUser.lastLogin
    ? new Date(currentUser.lastLogin).toLocaleString()
    : "Unknown";

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="from-primary/5 via-background to-accent/5 bg-gradient-to-br pt-16 pb-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-montserrat text-text mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your Profile
            </h1>
            <p className="font-quicksand text-text-muted mx-auto max-w-2xl text-xl">
              Manage your account, track your progress, and discover your
              achievements
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="-mt-8 space-y-8">
          {/* Profile Header Card */}
          <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg hover:shadow-xl sm:p-10">
            <ProfileImageEditor
              initialImage={profileImage}
              onEditProfile={handleEditProfile}
            />
            <div className="mt-8">
              <LevelBar currentUser={currentUser} />
            </div>
          </div>

          {/* Stats & Info Grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Achievements */}
            <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg hover:shadow-xl">
              <Achievements />
            </div>

            {/* Profile Info */}
            <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg hover:shadow-xl">
              <ProfileInfo
                displayName={username}
                creationTime={currentUser.metadata.creationTime}
                lastLogin={lastLogin}
              />
            </div>
          </div>

          {/* Activity Dashboard */}
          <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg hover:shadow-xl">
            <h2 className="font-montserrat text-text mb-8 text-2xl font-bold">
              Activity Dashboard
            </h2>
            <div className="grid gap-8 xl:grid-cols-2">
              <div className="bg-surface border-border rounded-2xl border p-6 hover:shadow-md">
                <SavedQuizzes />
              </div>
              <div className="bg-surface border-border rounded-2xl border p-6 hover:shadow-md">
                <QuizHistory />
              </div>
            </div>
          </div>

          {/* Created Content */}
          <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg hover:shadow-xl sm:p-10">
            <CreatedQuizzes />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
