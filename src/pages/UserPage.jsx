import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, User, Activity, Trophy, Settings, BarChart3, Calendar, Flame, ArrowLeft } from "lucide-react";
import { useCurrentUserProfile } from "../hooks/useCurrentUserProfile";
import { useStreak } from "../hooks/useStreak";
import { useEffect } from "react";
import Btn from "../components/common/Btn";
import QuizHistory from "../components/UserPage/QuizHistory";
import CreatedQuizzes from "../components/UserPage/CreatedQuizzes";
import Badges from "../components/UserPage/Badges";
import Achievements from "../components/UserPage/Achievements";
import ProfileInfo from "../components/UserPage/ProfileInfo";
import LevelBar from "../components/UserPage/LevelBar";
import ActivityCalendar from "../components/UserPage/ActivityCalendar";
import QuickStatsCard from "../components/UserPage/QuickStatsCard";
import PerformanceMetrics from "../components/UserPage/PerformanceMetrics";
import MobileOverview from "../components/UserPage/MobileOverview";
import TodayMotivation from "../components/UserPage/TodayMotivation";
import StreakReviveModal from "../components/Header/StreakReviveModal";
import StreakDebugInfo from "../components/UserPage/StreakDebugInfo";
import { streakService } from "../services/streakService";

function UserPage() {
  const { currentUser, logout } = useAuth();
  const { userData, loading: profileLoading } = useCurrentUserProfile();
  const { streakData, loading: streakLoading } = useStreak();
  const location = useLocation();
  const navigate = useNavigate();
  const [showReviveModal, setShowReviveModal] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    // If user was on stats tab, redirect to activity
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    return tab === 'stats' ? 'activity' : tab || 'overview';
  });
  

  // Helper function to format date in Polish
  const formatJoinedDate = (createdAt) => {
    if (!createdAt) return "Nieznana data";
    
    try {
      const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
      return date.toLocaleDateString('pl-PL', { 
        month: 'long', 
        year: 'numeric' 
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Nieznana data";
    }
  };

  // Get user data with fallbacks
  const getDisplayName = () => {
    return userData?.username || 
           userData?.displayName || 
           currentUser?.displayName || 
           "Użytkownik";
  };

  const getProfileImage = () => {
    return userData?.profileImage || 
           currentUser?.photoURL || 
           "/profile_icon.jpg";
  };

  const getJoinedDate = () => {
    const createdAt = userData?.createdAt || currentUser?.metadata?.creationTime;
    return formatJoinedDate(createdAt);
  };

  const getUserGoal = () => {
    return userData?.goal || "Nie określono celu";
  };

  const getUserType = () => {
    return userData?.userType || "Nie określono";
  };

  // Show revive modal when streak data loads and user can revive
  useEffect(() => {
    if (!streakLoading && streakData?.canRevive && !showReviveModal) {
      // Check if modal was already shown today
      const today = new Date().toDateString();
      const lastShown = localStorage.getItem('reviveModalShown');
      
      if (lastShown !== today) {
        // Add a small delay to ensure page has loaded
        const timer = setTimeout(() => {
          setShowReviveModal(true);
          localStorage.setItem('reviveModalShown', today);
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [streakData, streakLoading, showReviveModal]);

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
    navigate("/user/edit-profile");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };

  if (!currentUser || profileLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="bg-surface mx-auto mb-6 h-20 w-20 rounded-full"></div>
            <div className="bg-surface mx-auto mb-3 h-4 w-32 rounded"></div>
            <div className="bg-surface mx-auto h-3 w-24 rounded"></div>
          </div>
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
    { id: "achievements", label: "Osiągnięcia", icon: Trophy },
    { id: "settings", label: "Ustawienia", icon: Settings },
  ];

  // Show debug only in development
  const isDebugMode = process.env.NODE_ENV === 'development';

  return (
    <div className="bg-background min-h-screen">
      {/* Debug info - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mx-auto max-w-6xl p-4">
          <StreakDebugInfo />
        </div>
      )}

      {/* Modern Profile Summary Card */}
      <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <div className="-mt-2 mb-6 sm:-mt-4 sm:mb-8">
          <div className="bg-surface-elevated border-border rounded-xl border p-4 shadow-lg sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              {/* Profile Image Section */}
              <div className="flex justify-center sm:justify-start">
                <div className="relative">
                  <img
                    src={getProfileImage()}
                    alt="Zdjęcie profilowe"
                    className="border-border h-16 w-16 rounded-full border-2 object-cover sm:h-20 sm:w-20"
                  />
                  {currentUser && (
                    <div className={`absolute -bottom-1 -right-1 flex items-center gap-[2px] rounded-full px-1.5 py-0.5 shadow-sm ${
                      streakData?.hasCompletedToday 
                        ? 'bg-gradient-to-r from-accent to-yellow-600' 
                        : 'bg-gradient-to-r from-gray-400 to-gray-500'
                    }`}>
                      <Flame className="size-3 text-white" />
                      <span className="text-white text-xs font-bold">
                        {streakData?.currentStreak || 0}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Profile Information */}
              <div className="flex-1 text-center sm:text-left">
                <div className="mb-3">
                  <h2 className="overflow-scroll scroll-hidden text-text text-xl font-bold sm:text-2xl">
                    {getDisplayName()}
                  </h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-text-muted" />
                    <p className="text-text-muted text-xs">
                      Dołączył {getJoinedDate()}
                    </p>
                  </div>
                </div>
                
                {/* XP Progress Bar */}
                <div className="w-full">
                  <LevelBar currentUser={currentUser} compact={true} />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-row gap-2 sm:flex-col sm:gap-2">
                <Btn
                  variant="primary"
                  size="sm"
                  onClick={handleEditProfile}
                  className="flex-1 sm:w-auto"
                >
                  <Settings className="mr-1 h-3 w-3" />
                  <span className="text-xs">Edytuj</span>
                </Btn>
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex-1 sm:w-auto"
                >
                  <LogOut className="mr-1 h-3 w-3" />
                  <span className="text-xs">Wyloguj</span>
                </Btn>
              </div>
            </div>
            
            {/* Last Login - Compact */}
            {lastLogin !== "Nieznana" && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-text-muted text-xs text-center sm:text-left">
                  Ostatnie logowanie: <span className="text-text">{lastLogin}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Motywacja do dzisiejszych quizów - nad zakładami */}
        <div className="mb-6 sm:mb-8">
          <TodayMotivation onOpenReviveModal={() => setShowReviveModal(true)} />
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
                    className={`cursor-pointer flex flex-shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 sm:flex-1 sm:justify-center ${
                      activeTab === tab.id
                        ? "bg-primary shadow-sm"
                        : "hover:bg-surface-elevated"
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
              {/* Streak Statistics */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-surface-elevated border-border rounded-xl border p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <Trophy className="text-accent h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-text text-2xl font-bold">
                        {streakData?.longestStreak || 0}
                      </p>
                      <p className="text-text-muted text-sm">Najdłuższa passa</p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-elevated border-border rounded-xl border p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-correct/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <Calendar className="text-correct h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-text text-2xl font-bold">
                        {streakData?.totalQuizDays || 0}
                      </p>
                      <p className="text-text-muted text-sm">Łączne dni</p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-elevated border-border rounded-xl border p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-500/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <BarChart3 className="text-yellow-500 h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-text text-2xl font-bold">
                        {streakData?.monthlyPercentage || 0}%
                      </p>
                      <p className="text-text-muted text-sm">W tym miesiącu</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div className="bg-surface-elevated border-border rounded-xl border p-3 sm:p-6">
                <ActivityCalendar />
              </div>
              
              <div className="bg-surface-elevated border-border rounded-lg border p-4 sm:rounded-xl sm:p-6">
                <QuizHistory />
              </div>
              <div className="bg-surface-elevated border-border rounded-lg border p-4 sm:rounded-xl sm:p-6">
                <CreatedQuizzes authorId={currentUser?.uid} />
              </div>
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
                  displayName={getDisplayName()}
                  userId={currentUser.uid}
                  creationTime={currentUser.metadata.creationTime}
                  lastLogin={lastLogin}
                  userData={userData}
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

      {/* Streak Revive Modal - Full screen overlay */}
      <StreakReviveModal 
        isOpen={showReviveModal} 
        onClose={() => setShowReviveModal(false)} 
      />
    </div>
  );
}

export default UserPage;
