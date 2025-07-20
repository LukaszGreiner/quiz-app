import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, User, Activity, Trophy, Settings, BarChart3 } from "lucide-react";
import Btn from "../components/common/Btn";
import ProfileImageEditor from "../components/UserPage/ProfileImageEditor";
import SavedQuizzes from "../components/UserPage/SavedQuizzes";
import QuizHistory from "../components/UserPage/QuizHistory";
import CreatedQuizzes from "../components/UserPage/CreatedQuizzes";
import Achievements from "../components/UserPage/Achievements";
import ProfileInfo from "../components/UserPage/ProfileInfo";
import LevelBar from "../components/UserPage/LevelBar";
import StreakCard from "../components/UserPage/StreakCard";
import StreakDashboard from "../components/UserPage/StreakDashboard";
import StreakDebugger from "../components/UserPage/StreakDebugger";
import QuickStatsCard from "../components/UserPage/QuickStatsCard";
import ProgressChart from "../components/UserPage/ProgressChart";
import PerformanceMetrics from "../components/UserPage/PerformanceMetrics";

function UserPage() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  const [username] = useState(
    location.state?.username || "Nie określono",
  );
  const [description] = useState(
    location.state?.description || "Nie określono",
  );
  const [userType] = useState(
    location.state?.userType || "Nie określono",
  );
  const [goal] = useState(location.state?.goal || "Nie określono");
  const [profileImage] = useState(
    location.state?.profileImage || currentUser?.photoURL || "/profile_icon.jpg",
  );
  const [email] = useState(
    location.state?.email || currentUser?.email || "Nie określono",
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
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
          </div>{" "}
          <p className="font-quicksand text-text-muted mt-6 text-xl font-medium">
            Ładowanie profilu...
          </p>
        </div>
      </div>
    );
  }
  const lastLogin = currentUser.lastLogin
    ? new Date(currentUser.lastLogin).toLocaleString()
    : "Nieznana";

  // Configuration for tabs
  const tabs = [
    { id: "overview", label: "Przegląd", icon: User },
    { id: "activity", label: "Aktywność", icon: Activity },
    { id: "stats", label: "Statystyki", icon: BarChart3 },
    { id: "achievements", label: "Osiągnięcia", icon: Trophy },
    { id: "settings", label: "Ustawienia", icon: Settings },
  ];

  // Show debug only in development
  const isDebugMode = process.env.NODE_ENV === 'development';

  return (
    <div className="bg-background min-h-screen">
      {/* Compact Header */}
      <div className="from-primary/5 via-background to-accent/5 bg-gradient-to-br pt-16 pb-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-text mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Twój Profil
            </h1>
            <p className="text-text-muted text-lg">
              Zarządzaj swoim kontem i śledź postępy
            </p>
          </div>
        </div>
      </div>

      {/* Profile Card - Compact */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-4 mb-8">
          <div className="bg-surface-elevated border-border rounded-2xl border p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Profile Image - Smaller */}
              <div className="flex-shrink-0">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="border-border h-20 w-20 rounded-full border-2 object-cover"
                />
              </div>
              
              {/* Profile Info - Inline */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-text text-xl font-bold">{username}</h2>
                <p className="text-text-muted text-sm">{email}</p>
                <div className="mt-2">
                  <LevelBar currentUser={currentUser} compact={true} />
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3">
                <Btn
                  variant="secondary"
                  size="sm"
                  onClick={handleEditProfile}
                >
                  Edytuj profil
                </Btn>
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Btn>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-surface border-border rounded-xl border p-1 shadow-sm">
            <div className="flex flex-wrap gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-primary text-text-inverse shadow-sm"
                        : "text-text hover:bg-surface-elevated"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8 pb-16">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Stats Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StreakCard compact={true} />
                <QuickStatsCard />
                <ProgressChart compact={true} />
              </div>
              
              {/* Recent Activity */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-surface-elevated border-border rounded-xl border p-6">
                  <SavedQuizzes />
                </div>
                <div className="bg-surface-elevated border-border rounded-xl border p-6">
                  <QuizHistory />
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div className="space-y-6">
              <div className="bg-surface-elevated border-border rounded-xl border p-6">
                <QuizHistory />
              </div>
              <div className="bg-surface-elevated border-border rounded-xl border p-6">
                <CreatedQuizzes authorId={currentUser?.uid} />
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <StreakDashboard />
                <ProgressChart />
              </div>
              
              {isDebugMode && (
                <div className="bg-surface-elevated border-border rounded-xl border p-6">
                  <StreakDebugger />
                </div>
              )}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="space-y-6">
              <div className="bg-surface-elevated border-border rounded-xl border p-6">
                <Achievements />
              </div>
              
              <PerformanceMetrics />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-surface-elevated border-border rounded-xl border p-6">
                <ProfileInfo
                  displayName={username}
                  userId={currentUser.uid}
                  creationTime={currentUser.metadata.creationTime}
                  lastLogin={lastLogin}
                />
              </div>
              
              <div className="bg-surface-elevated border-border rounded-xl border p-6">
                <h3 className="text-text mb-4 text-lg font-semibold">Zarządzanie kontem</h3>
                <div className="space-y-3">
                  <Btn
                    variant="secondary"
                    onClick={handleEditProfile}
                    className="w-full sm:w-auto"
                  >
                    Edytuj profil
                  </Btn>
                  <Btn
                    variant="danger"
                    onClick={handleLogout}
                    className="w-full sm:w-auto"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Wyloguj się
                  </Btn>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPage;
