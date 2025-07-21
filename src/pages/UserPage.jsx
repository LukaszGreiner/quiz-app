import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, User, Activity, Trophy, Settings, BarChart3 } from "lucide-react";
import Btn from "../components/common/Btn";
import ProfileImageEditor from "../components/UserPage/ProfileImageEditor";
import SavedQuizzes from "../components/UserPage/SavedQuizzes";
import QuizHistory from "../components/UserPage/QuizHistory";
import CreatedQuizzes from "../components/UserPage/CreatedQuizzes";
import Badges from "../components/UserPage/Badges";
import Achievements from "../components/UserPage/Achievements";
import ProfileInfo from "../components/UserPage/ProfileInfo";
import LevelBar from "../components/UserPage/LevelBar";
import StreakCard from "../components/UserPage/StreakCard";
import StreakDashboard from "../components/UserPage/StreakDashboard";
import StreakDebugger from "../components/UserPage/StreakDebugger";
import QuickStatsCard from "../components/UserPage/QuickStatsCard";
import ProgressChart from "../components/UserPage/ProgressChart";
import PerformanceMetrics from "../components/UserPage/PerformanceMetrics";
import MobileOverview from "../components/UserPage/MobileOverview";
import TodayMotivation from "../components/UserPage/TodayMotivation";
import { streakService } from "../services/streakService";

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

  // Development helper function
  const handleFixStreak = async () => {
    if (!currentUser?.uid) return;
    
    try {
      console.log("Fixing streak for user:", currentUser.uid);
      await streakService.recalculateStreakFromHistory(currentUser.uid);
      alert("Streak został naprawiony! Odśwież stronę.");
      window.location.reload();
    } catch (error) {
      console.error("Error fixing streak:", error);
      alert("Błąd podczas naprawy streak: " + error.message);
    }
  };

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
      {/* Mobile-First Header */}
      <div className="from-primary/5 via-background to-accent/5 bg-gradient-to-br pt-16 pb-4 sm:pb-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-text mb-1 text-2xl font-bold tracking-tight sm:mb-2 sm:text-3xl lg:text-4xl">
              Twój Profil
            </h1>
            <p className="text-text-muted text-base sm:text-lg">
              Zarządzaj swoim kontem i śledź postępy
            </p>
          </div>
        </div>
      </div>

      {/* Mobile-First Profile Card */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-2 mb-6 sm:-mt-4 sm:mb-8">
          <div className="bg-surface-elevated border-border rounded-xl border p-4 shadow-lg sm:rounded-2xl sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              {/* Profile Image */}
              <div className="flex justify-center sm:justify-start">
                <div className="relative">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="border-border h-16 w-16 rounded-full border-2 object-cover sm:h-20 sm:w-20"
                  />
                  <div className="bg-success absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white"></div>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-text text-lg font-bold sm:text-xl">{username}</h2>
                <p className="text-text-muted mb-2 text-sm">{email}</p>
                <div className="w-full">
                  <LevelBar currentUser={currentUser} compact={true} />
                </div>
              </div>
              
              {/* Actions - Mobile Stack */}
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <Btn
                  variant="secondary"
                  size="sm"
                  onClick={handleEditProfile}
                  className="w-full sm:w-auto"
                >
                  Edytuj profil
                </Btn>
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full sm:w-auto"
                >
                  <LogOut className="mr-2 h-4 w-4 sm:mr-0" />
                  <span className="sm:hidden">Wyloguj</span>
                </Btn>
                {/* Development only - Fix Streak button */}
                {process.env.NODE_ENV === 'development' && (
                  <Btn
                    variant="danger"
                    size="sm"
                    onClick={handleFixStreak}
                    className="w-full sm:w-auto"
                  >
                    🔧 Napraw Streak
                  </Btn>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Motywacja do dzisiejszych quizów - nad zakładami */}
        <div className="mb-6 sm:mb-8">
          <TodayMotivation />
        </div>

        {/* Mobile-First Navigation Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-surface border-border rounded-lg border p-1 shadow-sm sm:rounded-xl">
            {/* Mobile: Horizontal scroll tabs */}
            <div className="flex gap-1 overflow-x-auto scrollbar-none sm:flex-wrap">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 sm:flex-1 sm:justify-center ${
                      activeTab === tab.id
                        ? "bg-primary text-text-inverse shadow-sm"
                        : "text-text hover:bg-surface-elevated"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="whitespace-nowrap text-xs sm:text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-4 pb-16 sm:space-y-6 sm:pb-20">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Mobile-First Overview - tylko na mobilnych */}
              <div className="block sm:hidden">
                <MobileOverview activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>
              
              {/* Statystyki - na wszystkich urządzeniach */}
              <div className="bg-surface-elevated border-border rounded-lg border p-4 sm:rounded-xl sm:p-6">
                <QuickStatsCard />
              </div>
              
              {/* Odznaki */}
              <div className="bg-surface-elevated border-border rounded-lg border p-4 sm:rounded-xl sm:p-6">
                <Badges />
              </div>
              
              {/* Stworzone Quizy */}
              <div className="bg-surface-elevated border-border rounded-lg border p-4 sm:rounded-xl sm:p-6">
                <CreatedQuizzes authorId={currentUser?.uid} isOverview={true} />
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-surface-elevated border-border rounded-lg border p-4 sm:rounded-xl sm:p-6">
                <QuizHistory />
              </div>
              <div className="bg-surface-elevated border-border rounded-lg border p-4 sm:rounded-xl sm:p-6">
                <CreatedQuizzes authorId={currentUser?.uid} />
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-4 sm:space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
                <StreakDashboard />
                <ProgressChart />
              </div>
              
              {isDebugMode && (
                <div className="bg-surface-elevated border-border rounded-lg border p-4 sm:rounded-xl sm:p-6">
                  <StreakDebugger />
                </div>
              )}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-surface-elevated border-border rounded-lg border p-4 sm:rounded-xl sm:p-6">
                <Achievements />
              </div>
              
              <PerformanceMetrics />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-surface-elevated border-border rounded-lg border p-4 sm:rounded-xl sm:p-6">
                <ProfileInfo
                  displayName={username}
                  userId={currentUser.uid}
                  creationTime={currentUser.metadata.creationTime}
                  lastLogin={lastLogin}
                />
              </div>
              
              <div className="bg-surface-elevated border-border rounded-lg border p-4 sm:rounded-xl sm:p-6">
                <h3 className="text-text mb-4 text-base font-semibold sm:text-lg">Zarządzanie kontem</h3>
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
