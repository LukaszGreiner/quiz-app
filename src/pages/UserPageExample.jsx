// Example: UserPage - Polish only version
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Btn from "../components/common/Btn";
import ProfileImageEditor from "../components/UserPage/ProfileImageEditor";
import SavedQuizzes from "../components/UserPage/SavedQuizzes";
import QuizHistory from "../components/UserPage/QuizHistory";
import CreatedQuizzes from "../components/UserPage/CreatedQuizzes";
import Achievements from "../components/UserPage/Achievements";
import ProfileInfo from "../components/UserPage/ProfileInfo";
import LevelBar from "../components/UserPage/LevelBar";
import StreakCard from "../components/UserPage/StreakCard";

function UserPage() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // For user-generated content, use Polish defaults
  const [username] = useState(
    location.state?.username || 'Nie określono',
  );
  const [description] = useState(
    location.state?.description || 'Nie określono',
  );
  const [userType] = useState(
    location.state?.userType || 'Nie określono',
  );
  const [goal] = useState(location.state?.goal || 'Nie określono');
  const [profileImage] = useState(
    location.state?.profileImage || currentUser?.photoURL || "/profile_icon.jpg",
  );

  const handleEditProfile = () => {
    navigate("/user/edit-profile", {
      state: {
        username,
        userType,
        goal,
        description,
      },
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
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
            Ładowanie...
          </p>
        </div>
      </div>
    );
  }

  const lastLogin = currentUser.lastLogin
    ? new Date(currentUser.lastLogin).toLocaleString()
    : 'Ostatnie logowanie';

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="from-primary/5 via-background to-accent/5 bg-gradient-to-br pt-16 pb-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-montserrat text-text mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Profil Użytkownika
            </h1>
            <p className="font-quicksand text-text-muted mx-auto max-w-2xl text-xl">
              Zarządzaj swoim kontem, śledź postępy i odkrywaj swoje osiągnięcia
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="-mt-8 space-y-8">
          {/* Profile Header Card */}
          <div className="bg-surface-elevated border-border rounded-3xl border p-4 sm:p-8 lg:p-10 shadow-lg hover:shadow-xl">
            <ProfileImageEditor
              initialImage={profileImage}
              onEditProfile={handleEditProfile}
              onLogout={handleLogout}
            />
            <div className="mt-6 sm:mt-8">
              <LevelBar currentUser={currentUser} />
            </div>
            <div className="mt-6 sm:mt-8">
              <StreakCard />
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
                userId={currentUser.uid}
                creationTime={currentUser.metadata.creationTime}
                lastLogin={lastLogin}
              />
            </div>
          </div>

          {/* Activity Dashboard */}
          <div className="bg-surface-elevated border-border rounded-3xl border p-8 shadow-lg hover:shadow-xl">
            <h2 className="font-montserrat text-text mb-8 text-2xl font-bold">
              Panel Aktywności
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
            <CreatedQuizzes authorId={currentUser?.uid} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
